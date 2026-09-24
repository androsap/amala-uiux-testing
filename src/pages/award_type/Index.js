import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Award Type | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(awardtypecode) {
        let url = api.url.awardtype.delete;
        let data = { awardtypecode };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Award Type Code", datafield: "awardtypecode", type: 'text', placeholder: 'Award Type Code', showDefaultSearch: true },
            { labeltext: "Award Type Name", datafield: "awardtypename", type: 'text', placeholder: 'Award Type Name', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.awardtype.list,
            columns: [
                { type: 'field', title: 'Award Type Code', dataIndex: 'awardtypecode', sorter: true },
                { type: 'field', title: 'Award Type Name', dataIndex: 'awardtypename', sorter: true },
                { type: 'field', title: 'Category Type', dataIndex: 'categorytype', sorter: true },
                { type: 'field', title: 'Category Code', dataIndex: 'categorycode', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        //encodeURIComponent, handle for encode special char in awardtypecode
                        return (
                            <span>
                                <Button url={'/award-type/form/' + encodeURIComponent(row.awardtypecode)} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.awardtypecode)} />
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
                        <Title level={3}>Manage Award Type</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/award-type/form/'} size="middle" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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