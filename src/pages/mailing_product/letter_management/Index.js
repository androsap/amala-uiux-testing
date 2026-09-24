import React from 'react';
import { api } from '../../../config/Services';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Alert, Button, SearchForm, TableBase, LanguageSelect } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    
    componentDidMount() {
        document.title = 'Manage Letter | Loyalty Management System';
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(lettercode) {
        let url = api.url.letter.delete;
        let data = { lettercode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success(responsemessage);
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
            { labeltext: 'Letter Code', datafield: 'lettercode', type: 'text', placeholder: 'Letter Code', showDefaultSearch: true },
            { labeltext: 'Letter Name', datafield: 'lettername', type: 'text', placeholder: 'Letter Name', showDefaultSearch: true },
            { labeltext: 'Language', datafield: 'language', type: 'component', placeholder: 'Language', showDefaultSearch: true, component: LanguageSelect },
        ];
        const configurationTable = {
            url: api.url.letter.retrieve,
            columns: [
                { type: 'field', title: 'Letter Code', dataIndex: 'lettercode', sorter: true },
                { type: 'field', title: 'Letter Name', dataIndex: 'lettername', sorter: true },
                { type: 'field', title: 'Language', dataIndex: 'languagename', sorter: false },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/letter-management/form/' + (row.lettercode)} size='small' label='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.lettercode)} />
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
                        <Title level={3}>Manage Letter</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/letter-management/form/'} size='middle' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
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