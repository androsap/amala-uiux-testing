import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Certificate Text | Loyalty Management System";
    }

    deleteData(membershiptypeid) {
        let url = api.url.membershiptype.delete;
        let data = { membershiptypeid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleChangePage(page, awardvouchercode = null) {
        this.props.changePage({ page, awardvouchercode });
    }

    render() {
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const configurationTable = {
            url: api.url.awardvouchertext.list,
            criteria: { awardcode: this.props.awardcode },
            columns: [
                { type: 'field', title: 'Language Code', dataIndex: 'langcode', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active',
                    render: (value, row, index) => { return ((value) ? "ACTIVE" : "INACTIVE") }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleChangePage('form', row.awardvouchercode)} />
                            </span>
                        )
                    }
                },
            ]
        };
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} md={19} lg={21} xxl={22}>
                        <Title level={4}>Manage Certificate Text</Title>
                    </Col>
                    <Col xs={24} md={5} lg={3} xxl={2}>
                        {
                            (usermenu[menucode][prefixmenuname + '_UPDATE']) ?
                                <Button htmlType="button" type="primary" size="default" label="Add New" onClick={() => (this.handleChangePage('form'))} /> : null
                        }
                    </Col>
                    <Divider />
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);