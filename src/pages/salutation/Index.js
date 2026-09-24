import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { Alert, Button, SearchForm, SelectBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Table, Spin } from 'antd';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const { Column } = Table;
const configurationSearchForm = [
    { labeltext: "Salutation Code", datafield: "salutationcode", type: 'text', placeholder: 'Salutation Code', showDefaultSearch: true },
    { labeltext: "Salutation Name", datafield: "salutationname", type: 'text', placeholder: 'Salutation Name', showDefaultSearch: true },
    { labeltext: "Gender", datafield: "gender", type: 'text', placeholder: 'Gender', showDefaultSearch: true },
    { labeltext: "Language Name", datafield: "langname", type: 'text', placeholder: 'Language Name', showDefaultSearch: true }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false
        }
    }

    componentDidMount() {
        document.title = "Manage Salutation | Loyalty Management System";
    }

    handleOpenModal = () => {
        this.setState({ visible: true });
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        this.setState({ visible: false });
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { isLoading, visible } = this.state;
        const configurationTable = {
            url: api.url.salutation.list,
            columns: [
                { type: 'field', title: 'Salutation Code', dataIndex: 'salutationcode', sorter: true },
                { type: 'field', title: 'Salutation Name', dataIndex: 'salutationname', sorter: true },
                { type: 'field', title: 'Gender', dataIndex: 'gender', sorter: true },
                { type: 'field', title: 'Language Name', dataIndex: 'langname', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return ((value) ? 'Active' : 'Inactive') }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/salutation/form/' + row.salutationcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Modal visible={visible} title="Set Salutation Default" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={960}>
                    <FormDefault handleOk={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={18}>
                        <Title level={3}>Manage Salutation</Title>
                    </Col>
                    <Col xs={24} xl={6} style={{ textAlign: 'right' }}>
                        <Button type="primary" url={'/salutation/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                        <Button type="primary" htmlType="button" size="default" label="Set Default" className="btn-custom-info" onClick={() => this.handleOpenModal()} />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}


class FormDefaultApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            dataDetail: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.getLanguage();
    }

    getDetail = (dataList) => {
        let paging = { limit: -1, page: 1 }
        let sort = { salutationname: 'asc' };
        let url = api.url.salutation.list;
        let column = [];
        let criteria = {};
        criteria.active = true;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                let dataResult = response.result;
                let dataDetail = {};
                for (const field in dataResult) {
                    if (dataResult[field]['isdefault']) {
                        dataDetail[dataResult[field]['langcode'] + "|SPLIT|" + dataResult[field]['gender']] = dataResult[field]['salutationcode'];
                    }
                }
                this.setState({ dataList, dataDetail, isLoading: false })
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getLanguage = () => {
        let paging = { limit: -1, page: 1 }
        let sort = { langname: 'asc' };
        let url = api.url.language.list;
        let column = [];
        let criteria = {};
        criteria.active = true;
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var dataListLanguage = response.result;

                sort = { salutationname: 'asc' };
                url = api.url.salutation.list;
                RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
                    var salutationList = response.result;

                    let dataList = [];
                    for (const field in dataListLanguage) {
                        dataList[field] = {};
                        dataList[field]['langcode'] = dataListLanguage[field]['langcode'];
                        dataList[field]['langname'] = dataListLanguage[field]['langname'];
                        dataList[field]['active'] = dataListLanguage[field]['active'];
                        dataList[field]['optionsmale'] = [];
                        dataList[field]['optionsfemale'] = [];
                        for (const field2 in salutationList) {
                            if (dataListLanguage[field]['langcode'] === salutationList[field2]['langcode']) {
                                let value = {
                                    label: salutationList[field2]['salutationname'],
                                    value: salutationList[field2]['salutationcode']
                                }
                                if (salutationList[field2]['gender'] === 'MALE') {
                                    dataList[field]['optionsmale'].push(value);
                                } else if (salutationList[field2]['gender'] === 'FEMALE') {
                                    dataList[field]['optionsfemale'].push(value);
                                }
                            }
                        }
                    }
                    this.getDetail(dataList);
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                let data = [];
                for (const field in input) {
                    if (input[field]) {
                        let splitvalue = field.split("|SPLIT|");
                        let langcode = (splitvalue[0]) ? splitvalue[0] : null;
                        let gender = (splitvalue[1]) ? splitvalue[1] : null;
                        let salutationcode = (input[field]) ? input[field] : null;
                        data.push({ langcode, gender, salutationcode });
                    }
                }

                let message = 'New data has been created';
                let url = api.url.salutation.setdefault;
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.handleOk();
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });

    }
    render() {
        const { dataList, isLoading, dataDetail } = this.state;
        return (
            <Form onSubmit={this.saveAction}>
                <Spin spinning={isLoading}>
                    <Table rowKey={record => record.langcode} dataSource={dataList} size="middle" pagination={false} loading={isLoading} scroll={{ y: 440 }}>
                        <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="5%" />
                        <Column title="Language" dataIndex="langname" key="langname" render={(val, row) => val ? val : '-'} width="10%" />
                        <Column title="Male" dataIndex="male" key="male" width="10%"
                            render={(val, row) =>
                                <SelectBase form={this.props.form} datafield={row.langcode + "|SPLIT|MALE"} defaultValue={dataDetail[row.langcode + "|SPLIT|MALE"]} placeholder="Male" options={(row.optionsmale) ? row.optionsmale : []} style={{ margin: '0px 10px' }} />
                            }
                            className="padding-0"
                            align="center"
                        />
                        <Column title="Female" dataIndex="female" key="female" width="10%"
                            render={(val, row) =>
                                <SelectBase form={this.props.form} datafield={row.langcode + "|SPLIT|FEMALE"} defaultValue={dataDetail[row.langcode + "|SPLIT|FEMALE"]} placeholder="Female" options={(row.optionsfemale) ? row.optionsfemale : []} style={{ margin: '0px 10px', }} />
                            }
                            className="padding-0"
                            align="center"
                        />
                    </Table>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="primary" label="Save" />
                    </Row>
                </Spin>
            </Form>
        )
    }
}

const FormDefault = Form.create()(FormDefaultApp);
export default Form.create()(App);