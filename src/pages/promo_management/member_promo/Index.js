import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, SearchForm, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { StatusPromo } from '../../../data';
import TableBase from '../../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            criteria: {},
        }
    }
    componentDidMount() {
        document.title = 'Manage Member Promo| Loyalty Management System';
    }

    handleSearchForm = (criteria, criteriadata) => {
        criteriadata.statuslist = (criteriadata.statuslist) ? criteriadata.statuslist : ['VALIDATION', 'SUCCESS', 'NOT_ELIGIBLE', 'CANCELLED'];
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    deleteData(memberpromocode) {
        let url = api.url.memberpromo.delete;
        let data = { memberpromocode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number ', showDefaultSearch: true },
            { labeltext: 'Promo Code', datafield: 'promocode', type: 'text', placeholder: 'Promo Code', showDefaultSearch: true },
            { labeltext: 'Registration Code', datafield: 'registrationcode', type: 'text', placeholder: 'Registration Code', showDefaultSearch: true },
            { labeltext: 'Registration Date', datafield: 'createdDate', type: 'datepicker', placeholder: 'Registration Date', showDefaultSearch: true, specialSearchLike: true },
            {
                labeltext: 'Status', datafield: 'statuslist', type: 'select', placeholder: 'Status', showDefaultSearch: false, specialSearchArray: true,
                options: StatusPromo.filter(function (val) { return (val.value !== 'REGISTERED') })
            }
        ];
        const configurationTable = {
            url: api.url.memberpromo.list,
            criteria: {},
            criteriadata: { statuslist: ['VALIDATION', 'SUCCESS', 'NOT_ELIGIBLE', 'CANCELLED'], useregistrationcode: false },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Promo Code', dataIndex: 'promocode', sorter: true },
                {
                    type: 'field', title: 'Registration Code', dataIndex: 'registrationcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Registration Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (_value, row) => {
                        return (
                            <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.memberpromocode)} />
                        )
                    }
                },
            ],

        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Member Promo</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));