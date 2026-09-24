import React from 'react';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Form, Table, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Alert } from '../../../components/Base/BaseComponent';
import moment from 'moment';

const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.getDetail(this.props.match.params.ID);
    }

    getDetail(memberid) {
        this.setState({ isLoading: true });
        DetailRequest(api.url.profileintegration.getoriginmember, { memberid }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                let number = 0;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

                this.setState({ dataList, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
                this.setState({ isLoading: false });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div style={{ background: '#ffffff', overflow: 'auto', paddingRight: '5px' }} >
                    <Table rowKey={record => record.number} dataSource={this.state.dataList} size='middle' pagination={false} loading={this.state.isLoading} >
                        <Column title='No' dataIndex='number' key='No' render={(val, row, i) => i + 1} width='5%' />
                        <Column title='Member Name' dataIndex='name' key='Name' width='25%'
                            render={(value, record) => (
                                <span> {(value) ? value : '-'} </span>
                            )} />
                        <Column title='Tier' dataIndex='tierid' key='Tier' width='12%' />
                        <Column title='Merge Date' dataIndex='mergewithdate' key='Merge Date' width='15%'
                            render={(value, record) => (
                                <span>{moment(value).format('DD/MM/YYYY')}</span>
                            )} />
                        <Column title='Status' dataIndex='status' key='Status' width='10%' />
                        <Column title='Action' dataIndex='memberidorigin' key='Action' width='35%' align='center'
                            render={(value, record) => (
                                <span>
                                    <a href={'/' + this.props.match.url.split('/')[1] + '/form/' + value} style={{ cursor: 'pointer', marginRight: 8 }}><Icon type='link' /><span> To Profile</span></a>
                                    {this.state.dataList[0] === undefined ? '' : this.state.dataList[0].isneedcorrection === false || this.state.dataList[0].isneedcorrection === 'false'? '' :
                                        <Link to={{ pathname: '/correction-transaction', state: { memberidorigin: value, memberiddestination: this.props.match.params.ID } }} className="btn btn-outline-dark btn-sm">
                                            <Icon type='edit' /> Correction
                                        </Link> }
                                </span>
                            )} />
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
