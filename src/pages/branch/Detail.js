import React from 'react';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Form, Table, Row, Col, Typography } from 'antd';
const { Column } = Table;
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: {},
            loading: false,
            branchcode: this.props.branchcode
        };
    }

    componentDidMount() {
        this.getDetail(this.state.branchcode);
    }

    getDetail = (branchcode) => {
        let url = api.url.branch.list;
        let criteria = { branchcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let active = (result[0].active !== undefined) ? result[0].active : false;
                    let areaList = result[0].area ? result[0].area : [];
                    let tickOffList = result[0].ticketoffices ? result[0].ticketoffices : [];

                    this.setState({ active, areaList, tickOffList });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    render() {
        const { areaList, tickOffList, loading } = this.state;

        let country = [], city = [];
        if (areaList && areaList.length) {
            for (let val of areaList) {
                if (val.statename === '' || val.statename === undefined) {
                    country.push(val.countryname);
                } else {
                    city.push(val.cityname);
                }
            }
        }
        let countryArea = country.length ? country.join(", ") : "-";
        let cityArea = city.length ? city.join(", ") : "-";

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <Title level={4}>Branch Area</Title>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}><label>Country</label></Col>
                    <Col span={16}>: {countryArea}</Col>
                    <Col span={8}><label>City</label></Col>
                    <Col span={16}>: {cityArea}</Col>
                </Row>
                <Row style={{ marginTop: '30px' }}>
                    <Col>
                        <Title level={4}>Ticket Office</Title>
                    </Col>
                </Row>
                <Row>
                    <Table rowKey={record => record.branchcode} dataSource={tickOffList} size="small" pagination={false} loading={loading} >
                        <Column title="No" dataIndex="number" key="number" render={(t, r, i) => ++i} />
                        <Column title="Ticket Office ID" dataIndex="tickoffid" key="tickoffid" />
                        <Column title="Ticket Office Name" dataIndex="tickoffname" key="tickoffname" />
                        <Column title="Status" dataIndex="active" key="active" render={(text) => (text) ? 'Active' : 'Inactive'} />
                    </Table>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);