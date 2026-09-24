import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, Button, Alert } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Table, Modal } from 'antd';
import { Tabs } from 'antd';
import Create from './area/Create';
import List from './area/List';

const { Column } = Table;
const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                branchcode: null,
                active: false
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
            areaList: [],
            areaType: null,
            showListModal: false,
            showAddModal: false
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (branchcode, actionspage) => {
        let url = api.url.branch.list;
        let criteria = { branchcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let branchcode = (result[0].branchcode) ? result[0].branchcode : '';
                    let branchname = (result[0].branchname) ? result[0].branchname : '';
                    let description = (result[0].description) ? result[0].description : '';
                    let active = (result[0].active !== undefined) ? result[0].active : false;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let areaList = (result[0].area !== undefined) ? result[0].area : [];

                    let setValue = { branchcode, branchname, description };
                    this.props.form.setFieldsValue(setValue);
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    let fieldvalue = { ...this.state.fieldvalue, branchcode, active };

                    this.setState({ fielddisabled, fieldvalue, areaList });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                //define parameter
                let branchcode = input.branchcode.toUpperCase();
                let branchname = input.branchname.toUpperCase();
                let description = (input.description && input.description.length > 0) ? input.description : null;

                let data = { branchcode, branchname, description };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.branch.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.branch.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/branch');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    };

    deleteData(branchcode, active) {
        let url = (active) ? api.url.branch.deactivate : api.url.branch.activate;
        let data = { branchcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    deleteAreaData(branchcode, countrycode, citycode, type) {
        let url = api.url.brancharea.delete;
        let data = { branchcode, countrycode, citycode, type };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback);
    }

    handleOpenModal = (area, type) => {
        if (type === 'ADD') {
            this.setState({ areaType: area, showAddModal: true });
        } else {
            this.setState({ areaType: area, showListModal: true });
        }
    }

    handleOk = () => {
        this.setState({ showListModal: false, showAddModal: false });
        this.checkPermission();
    };

    handleCancel = () => {
        this.setState({ showListModal: false, showAddModal: false });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, loading, showAddModal, showListModal, areaType } = this.state;
        const { active, branchcode } = this.state.fieldvalue;
        const { specialfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;

        let area = this.state.areaList;
        let country = [], city = [];
        if (area.length) {
            for (let val of area) {
                if (val.cityname) {
                    city.push({ countrycode: val.countrycode, citycode: val.citycode, cityname: val.cityname, branchcode: val.branchcode });
                } else {
                    country.push({ countrycode: val.countrycode, countryname: val.countryname, branchcode: val.branchcode });
                }

            }
        }

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Branch | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Branch</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Tabs defaultActiveKey="1" style={{ marginTop: '-20px' }}>
                            <TabPane tab="Detail Information" key="1">
                                <Form {...formItemLayout} onSubmit={this.saveAction}>
                                    <Row gutter={24}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                            <InputText form={this.props.form} labeltext="Branch Code" datafield="branchcode" validationrules={['required', 'pattern.alphanumeric', 'max.10',]} maxLength="10" disabled={specialfielddisabled} />
                                            <InputText form={this.props.form} labeltext="Branch Name" datafield="branchname" validationrules={['required', 'pattern.letterspace', 'max.45']} maxLength="45" disabled={generalfielddisabled} />
                                            <TextArea form={this.props.form} labeltext="Description" datafield="description" validationrules={['pattern.alphanumericspace', 'max.255']} maxLength="255" disabled={generalfielddisabled} />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                        {
                                            (actionspage === 'create') ?
                                                <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                                : (actionspage === 'update' && active) ?
                                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                                    : null
                                        }
                                        {
                                            (actionspage !== 'create') ?
                                                (active) ?
                                                    <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(branchcode, active)} /> :
                                                    <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(branchcode, active)} /> : ""
                                        }
                                        <Button url="/branch" htmlType="link" type="default" label="Back" />
                                    </Row>
                                </Form>
                            </TabPane>
                            {
                                (actionspage !== 'create') && (usermenu["BRNCAREA"]["BRNCAREA_ACCESS"]) ?
                                    <TabPane tab="Branch Area" key="2">
                                        {/* <BranchArea /> */}

                                        <Modal visible={showAddModal} title={"Add " + ((areaType === 'COUNTRY') ? 'Country' : 'City')} loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true}>
                                            <Create areatype={areaType} branchcode={this.props.match.params.ID} closemodalrefresh={this.handleOk} />
                                        </Modal>
                                        <Modal
                                            visible={showListModal}
                                            title={((areaType === 'COUNTRY') ? 'Country' : 'City') + " Coverage Area"}
                                            loading={loading}
                                            onCancel={this.handleCancel}
                                            footer={null}
                                            destroyOnClose={true}
                                        >
                                            <List areatype={areaType} />
                                        </Modal>

                                        <Row gutter={24}>
                                            {/* COUNTRY */}
                                            <Col className="gutter-row" span={12}>
                                                <Row>
                                                    <Col xs={24} xl={6}>
                                                        <Title level={4}>Country</Title>
                                                    </Col>
                                                    <Col xs={24} xl={18} align="right" style={{ paddingTop: 4 }}>
                                                        {
                                                            (active) && (usermenu["BRNCAREA"]["BRNCAREA_CREATE"]) ? <Button htmlType="button" type="primary" size="small" label="Add Country" onClick={() => this.handleOpenModal('COUNTRY', 'ADD')} /> : ''
                                                        }
                                                        <Button htmlType="button" type="primary" size="small" label="View Existing Area Coverage" onClick={() => this.handleOpenModal('COUNTRY', 'LIST')} />
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginBottom: 30 }}>
                                                    <Table rowKey={record => record.countrycode} dataSource={country} size="middle" pagination={false} onChange={this.handleTableChange} span={6}>
                                                        <Column title="No" dataIndex="number" key="number" render={(t, r, i) => ++i} />
                                                        <Column title="Country" dataIndex="countryname" key="countryname" />
                                                        <Column
                                                            title="Action"
                                                            key="action"
                                                            render={(text, record) => (
                                                                <span>
                                                                    {
                                                                        (active) && usermenu["BRNCAREA"]["BRNCAREA_DELETE"] ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteAreaData(record.branchcode, record.countrycode, '', 'COUNTRY')} /> : ''
                                                                    }
                                                                </span>
                                                            )}
                                                        />
                                                    </Table>
                                                </Row>
                                            </Col>

                                            {/* CITY */}
                                            <Col className="gutter-row" span={12}>
                                                <Row>
                                                    <Col xs={24} xl={6}>
                                                        <Title level={4}>City</Title>
                                                    </Col>
                                                    <Col xs={24} xl={18} align="right" style={{ paddingTop: 4 }}>
                                                        {
                                                            (active) && (usermenu["BRNCAREA"]["BRNCAREA_CREATE"]) ? <Button htmlType="button" type="primary" size="small" label="Add City" onClick={() => this.handleOpenModal('CITY', 'ADD')} /> : ''
                                                        }
                                                        <Button htmlType="button" type="primary" size="small" label="View Existing Area Coverage" onClick={() => this.handleOpenModal('CITY', 'LIST')} />
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginBottom: 30 }}>
                                                    <Table rowKey={record => record.citycode} dataSource={city} size="middle" pagination={false} onChange={this.handleTableChange} span={6}>
                                                        <Column title="No" dataIndex="number" key="number" render={(t, r, i) => ++i} />
                                                        <Column title="City" dataIndex="cityname" key="cityname" />
                                                        <Column
                                                            title="Action"
                                                            key="action"
                                                            render={(text, record) => (
                                                                <span>
                                                                    {
                                                                        (active) && (usermenu["BRNCAREA"]["BRNCAREA_DELETE"]) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteAreaData(record.branchcode, record.countrycode, record.citycode, 'CITY')} /> : ""
                                                                    }
                                                                </span>
                                                            )}
                                                        />
                                                    </Table>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </TabPane> : ""
                            }
                        </Tabs>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}


// class BranchArea extends Component{

//     render(){
//         return(
//             <div>coba</div>
//         )
//     }
// }

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));