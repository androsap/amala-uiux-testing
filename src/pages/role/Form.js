import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DetailRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, TextArea, CheckboxBase, Alert, Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Card } from 'antd';
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                rolecode: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true
            },
            userMenuList: [],
            userMenuDetail: [],
            enrollmentDetail: []
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
            //role can't update action
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
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail(rolecode, actionspage) {
        let url = api.url.role.retrieveroledetail;
        let data = { rolecode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                if (result.length !== 0) {
                    let rolename = (result.rolename) ? result.rolename : '';
                    let roledescription = (result.roledescription) ? result.roledescription : '';
                    let active = (result.active !== undefined) ? result.active : false;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;

                    /* mapping user menu detail */
                    let userMenuDetail = [];
                    let usermenu = (result.usermenu) ? result.usermenu : [];
                    for (const field in usermenu) {
                        for (const field2 in usermenu[field].listmenu) {
                            for (const field3 in usermenu[field].listmenu[field2].function) {
                                userMenuDetail["user|SPLIT|" + usermenu[field].groupcode + "|SPLIT|" + usermenu[field].listmenu[field2].menucode + "|SPLIT|" + usermenu[field].listmenu[field2].function[field3].functioncode] = (usermenu[field].listmenu[field2].function[field3].grant) ? true : false;
                            }
                        }
                    }

                    /* mapping enrollment access */
                    let enrollmentDetail = [];
                    let enrollmembershiplist = (result.enrollmembershiplist) ? result.enrollmembershiplist : [];
                    for (const field in enrollmembershiplist) {
                        enrollmentDetail["membership|SPLIT|" + enrollmembershiplist[field].membershipid] = (enrollmembershiplist[field].grant) ? true : false;
                    }

                    let setValue = { rolename, roledescription };
                    this.props.form.setFieldsValue(setValue);

                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
                    let fieldvalue = { ...this.state.fieldvalue, rolecode, active };
                    this.setState({ fieldvalue, fielddisabled, userMenuDetail, enrollmentDetail, isLoading: false });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({
                    responseCode: response.status.responsecode,
                    responseMessage: response.status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    saveAction = (e, type) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                // call loader
                this.setState({ isLoading: true });
                //define parameter
                let rolename = input.rolename;
                let roledescription = input.roledescription;

                let data = { rolename, roledescription };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.role.create;
                } else {
                    url = api.url.role.update;
                    data.rolecode = this.props.match.params.ID;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/role');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    handleStatusChange = (event) => {
        let active = event === null ? null : event.target.value;
        this.setState({ active });
    }

    deleteData(rolecode, active) {
        let url = (active) ? api.url.role.deactivate : api.url.role.activate;
        let data = { rolecode };
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

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { userMenuDetail, enrollmentDetail } = this.state;
        const { rolecode, active } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render forms
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Role</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="Role Name" datafield="rolename" form={this.props.form} validationrules={['required', 'pattern.letterspace', 'max.45']} disabled={generalfielddisabled} />
                                    <TextArea labeltext="Description" datafield="roledescription" form={this.props.form} validationrules={['pattern.alphanumericspace', 'max.255']} maxLength="255" disabled={generalfielddisabled} />
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
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(rolecode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(rolecode, active)} /> : ""
                                }
                                <Button url="/role" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                        {
                            (actionspage !== 'create') ?
                                <React.Fragment>
                                    <Divider />
                                    <UserMenuForm {...this.props} disabled={generalfielddisabled} actionspage={actionspage} active={active} menucode={menucode} prefixmenuname={prefixmenuname} rolecode={rolecode} userMenuDetail={userMenuDetail} enrollmentDetail={enrollmentDetail} />
                                </React.Fragment> : null
                        }
                    </Spin>
                </Row>
            );
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

class UserMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userMenuList: [],
            enrollmentAccessList: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this.getMenu();
        this.getMembership();
    }

    getMenu() {
        let paging = { limit: -1, page: 1 };
        let url = api.url.role.getmenu;
        var result = RetrieveRequest(url, {}, paging, [], {});
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    userMenuList: result
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getMembership() {
        let paging = { limit: -1, page: 1 }
        let url = api.url.membership.list;
        var result = RetrieveRequest(url, {}, paging, [], {});
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {

                const options = [];
                for (const field in result) {
                    if (options[result[field].membershiptypeid] === undefined) { options[result[field].membershiptypeid] = {}; }

                    options[result[field].membershiptypeid].membershiptypename = result[field].membershiptypename;
                    options[result[field].membershiptypeid].membershiptypeid = result[field].membershiptypeid;

                    if (options[result[field].membershiptypeid].memberships === undefined) { options[result[field].membershiptypeid].memberships = []; }

                    let memberships = {};
                    memberships.membershipid = result[field].membershipid;
                    memberships.membershipname = result[field].membershipname;
                    options[result[field].membershiptypeid].memberships.push(memberships);
                }

                let enrollmentAccessList = [];
                var key = 0;
                for (const field in options) {
                    enrollmentAccessList[key] = options[field];
                    key++;
                }

                this.setState({
                    enrollmentAccessList,
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    sortMenu(datas) {
        var myData = {};
        if (datas && datas.length > 0) {
            myData = [...datas];
            myData.sort((a, b) => a.groupname > b.groupname);
            myData.map((item) => {
                return item;
            });
        }
        return myData;
    }

    sortMembership(datas) {
        var myData = {};
        if (datas.length > 0) {
            myData = [...datas];
            myData.sort((a, b) => a.membershiptypename > b.membershiptypename);
            myData.map((item, i) => {
                return item;
            }
            );
        }
        return myData;
    }

    saveAction = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                /* mapping user menu permission */
                var usermenu = [];
                var key = 0;
                for (const field in input) {
                    if (field.substring(0, 4) === 'user') {
                        usermenu[key] = {};
                        usermenu[key]["functioncode"] = field.split("|SPLIT|")[3];
                        usermenu[key]["grant"] = (input[field]) ? true : false;
                        key++;
                    }
                }

                /* mapping enroll base membership permission */
                var enrollmembershiplist = [];
                var key2 = 0;
                for (const field2 in input) {
                    if (field2.substring(0, 10) === 'membership') {
                        enrollmembershiplist[key2] = {};
                        enrollmembershiplist[key2]["membershipid"] = field2.split("|SPLIT|")[1];
                        enrollmembershiplist[key2]["grant"] = (input[field2]) ? true : false;
                        key2++;
                    }
                }

                let message = 'Data has been updated';
                let url = api.url.role.setrolepermit;
                let rolecode = this.props.rolecode;
                let data = { rolecode, function: usermenu, enrollmembershiplist };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/role');
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                });
            }
        });
        return false;
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { userMenuList, enrollmentAccessList, isLoading } = this.state;
        const { menucode, prefixmenuname, actionspage, active } = this.props;
        var sortedMenu = this.sortMenu(userMenuList);
        var sortMembership = this.sortMembership(enrollmentAccessList);
        var setPermissionList = '';
        var enrollmentAccess = '';

        if (sortedMenu.length) {
            setPermissionList = sortedMenu.map((val_1, key) =>
                <Card key={key} title={val_1.groupname} bordered={false} style={{ width: '100%', margin: '10px 0' }} size="small">
                    <Row type="flex">
                        {
                            val_1.listmenu.map((val_2, key_2) =>
                                <Col key={key_2} xs={24} sm={12} md={6} lg={4} xl={4} style={{ marginTop: 10, height: '100%' }}>
                                    <Row>
                                        <Title style={{ fontSize: '14px' }}>{val_2.menuname}</Title>
                                        {
                                            val_2.function.map((val_3, key_3) =>
                                                <Col key={key_3} span={24}>
                                                    <CheckboxBase datafield={"user|SPLIT|" + val_1.groupcode + "|SPLIT|" + val_2.menucode + "|SPLIT|" + val_3.functioncode} form={this.props.form} initialvalue={this.props.userMenuDetail["user|SPLIT|" + val_1.groupcode + "|SPLIT|" + val_2.menucode + "|SPLIT|" + val_3.functioncode]} disabled={this.props.disabled}>{val_3.functionname}</CheckboxBase>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </Col>
                            )
                        }
                    </Row>
                </Card>
            );
        }

        if (sortMembership.length) {
            enrollmentAccess = sortMembership.map((val_1, key_1) =>
                <Card key={key_1} title={val_1.membershiptypename} bordered={false} style={{ width: '100%', margin: '10px 0' }} size="small">
                    <Row type="flex">
                        {
                            val_1.memberships.map((val_2, key_2) =>
                                <Col key={key_2} xs={24} sm={12} md={6} lg={6} xl={6} style={{ marginTop: 10, height: '100%' }}>
                                    <CheckboxBase datafield={"membership|SPLIT|" + val_2.membershipid} form={this.props.form} initialvalue={this.props.enrollmentDetail["membership|SPLIT|" + val_2.membershipid]} disabled={this.props.disabled}>{val_2.membershipname}</CheckboxBase>
                                </Col>
                            )
                        }
                    </Row>
                </Card>
            );
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Role Permission</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Title level={4}>User Menu</Title>
                        <div style={{ background: '#f0f2f5', padding: '20px', overflow: 'scroll', height: '400px', marginBottom: 30 }}>
                            {setPermissionList}
                        </div>
                        <Title level={4}>Enrollment Access</Title>
                        <div style={{ background: '#f0f2f5', padding: '20px', overflow: 'scroll', height: '400px' }}>
                            {enrollmentAccess}
                        </div>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create') ?
                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                    : (actionspage === 'update' && active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                        : null
                            }
                            <Button url="/role" htmlType="link" type="default" label="Back" />
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>
        )
    }
}

const UserMenuForm = (Form.create()(UserMenu));

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));