import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TableBase, MembershipSelect  } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Membership | Loyalty Management System";
    }

    deleteData(membershipid) {
        let url = api.url.membership.delete;
        let data = { membershipid };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.membership.list,
            columns: [
                { type: 'field', title: 'Membership Code', dataIndex: 'membershipid', sorter: true },
                { type: 'field', title: 'Membership Name', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Membership Type', dataIndex: 'membershiptypename', sorter: true },
                {
                    type: 'html', title: 'Exclusive', dataIndex: 'exclusive', sorter: true,
                    render: (value, row, index) => { return (value) ? "Yes" : "No" }
                },
                {
                    type: 'html', title: 'Unique Number', dataIndex: 'firstnum', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/membership/form/' + row.membershipid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.membershipid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Membership Code", datafield: "membershipid", type: 'text', placeholder: 'Membership Code', showDefaultSearch: true },
            { labeltext: "Membership Name", datafield: "membershipname", type: 'component', placeholder: 'Membership Name', component: MembershipSelect, showDefaultSearch: true, custom: true },
            { labeltext: "Membership Type", datafield: "membershiptypename", type: 'text', placeholder: 'Membership Type', showDefaultSearch: true },
            { labeltext: "Unique Number", datafield: "firstnum", type: 'text', placeholder: 'Unique Number', showDefaultSearch: true }
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Membership</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/membership/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);