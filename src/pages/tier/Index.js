import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import ManageRank from './ManageRank';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Tier Name", datafield: "tiername", type: 'text', placeholder: 'Tier Name', showDefaultSearch: true },
    { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership', showDefaultSearch: true },
    { labeltext: "Membership Type", datafield: "membershiptypename", type: 'text', placeholder: 'Membership Type', showDefaultSearch: true },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: false }
];
class App extends React.Component {
    state = {
        visible: false
    }
    componentDidMount() {
        document.title = "Manage Tier | Loyalty Management System";
    }

    deleteData(tierid) {
        let url = api.url.tier.delete;
        let data = { tierid };
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
    };


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;

        const configurationTable = {
            url: api.url.tier.list,
            columns: [
                { type: 'field', title: 'Tier Name', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Membership Type', dataIndex: 'membershiptypename', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/tier/form/' + row.tierid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tierid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={3}>Manage Tier</Title>
                    </Col>
                    <Col xs={24} xl={4} style={{ display: 'inline-flex' }}>
                        <Button type="primary" url={'/tier/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                        <Button htmlType='button' type="primary" size="default" label="Manage Rank" onClick={this.showModal} />
                    </Col>
                    <Divider />

                    <Modal title="Manage Tier Rank" visible={this.state.visible} onCancel={this.handleCancel} footer={null} width={960} destroyOnClose={true}>
                        <ManageRank handleCancel={this.handleCancel} />
                    </Modal>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);