import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage User | Loyalty Management System";
    }

    deleteData(username, active) {
        console.log('log active', active)
        let url = (active === 'ACTIVE' || active === 'Active') ? api.url.user.deactivate : api.url.user.activate;
        let data = { username };
        let status = (active === 'ACTIVE' || active === 'Active') ? true : false;
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
        DeleteRequest(url, data, callback, status);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Username", datafield: "username", type: 'text', placeholder: 'Username', showDefaultSearch: true },
            { labeltext: "Full Name", datafield: "userfullname", type: 'text', placeholder: 'Full Name', showDefaultSearch: true },
            { labeltext: "Email", datafield: "useremail", type: 'text', placeholder: 'Email', showDefaultSearch: true },
            { labeltext: "Ticket Office ID", datafield: "tickoffid", type: 'text', placeholder: 'Ticket Office ID', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.user.list,
            columns: [
                { type: 'field', title: 'Username', dataIndex: 'username', sorter: true },
                { type: 'field', title: 'Full Name', dataIndex: 'userfullname', sorter: true },
                { type: 'field', title: 'Email', dataIndex: 'useremail', sorter: true },
                {
                    type: 'html', title: 'Ticket Office ID', dataIndex: 'tickoffid', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, { username, status }, index) => {
                        const isActive = status.toLowerCase() === 'active';
                        const props = {
                            menucode, 
                            prefixmenuname
                        }

                        return (
                            <span>
                                <Button 
                                    url={`/user/form/${username}`} 
                                    size="small" 
                                    label={isActive ? "Edit" : "View"}
                                    {...props}
                                    {...isActive ? { actioncode: "UPDATE" } : null }
                                    actioncode = "UPDATE"
                                />
                                <Button 
                                    htmlType="button" 
                                    size="small" 
                                    type={isActive ? "danger" : "default"}
                                    {...isActive ? null : { className: "btn-custom-green" } } 
                                    label={isActive ? "Deactivate" : "Activate"} 
                                    {...props}
                                    actioncode="DELETE" 
                                    onClick={() => this.deleteData(username, status)} 
                                /> 
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage User</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/user/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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