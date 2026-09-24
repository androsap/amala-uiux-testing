import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, SelectBase, InputText, UploadBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
//import { toast } from 'react-toastify';
import uuid from 'uuid/v4';

const optionsType = [
    { label: "KTP", value: "KTP" },
    { label: "KITAS", value: "KITAS" },
    { label: "SIM", value: "SIM" },
    { label: "PASSPORT", value: "PASSPORT" },
    { label: "VISA", value: "VISA" }
]

const optionsStatus = [
    { label: "Verified", value: "VERIFIED" },
    { label: "Unverified", value: "UNVERIFIED" },
    { label: "Rejected", value: "REJECTED" }
]

const prefixmenuname = 'MMBRIDT'
const menucode = 'MMBRIDT'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            identityimage: null,
            identityuserimage: null,
            fileidentityimage: [],
            fileidentityuserimage: [],
            upload: false,
            uploadUser: false,
            key: 1,
            keyUpload1: uuid(),
            errorFormat: false,
            errorSize: false,
            fielddisabled: {
                specialfielddisabled: true,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.memberidentityid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'View';
            let actionspage = 'view';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'Edit';
                actionspage = 'update';
                generalfielddisabled = false;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberidentityid) => {
        let url = api.url.memberidentity.list;
        let data = { memberidentityid };

        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, data).then((response) => {
            const { status = {}, result } = response;
            const { responsecode } = status;

            if (responsecode === '0000') {
                if (result) {
                    const {
                        identitynumber: numberidentity,
                        identitytype: typeidentity,
                        identityimage,
                        identityuserimage,
                        status
                    } = result[0] || {};

                    this.props.form.setFieldsValue({
                        numberidentity, typeidentity, status
                    });

                    this.setState({
                        identityimage,
                        identityuserimage,
                        key: this.state.key + 1, keyUpload1: uuid()
                    })

                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const { actionspage, errorFormat, errorSize } = this.state;
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.match.params.ID;
                let path = '/identitycard/';
                let identitynumber = (input.numberidentity) ? input.numberidentity : null;
                let identitytype = (input.typeidentity) ? input.typeidentity : null;;
                let status = (actionspage !== 'create' && input.status) ? "UNVERIFIED" : input.status;
                let reason = null;

                let message = 'New data has been created';
                let data = { memberid, identitynumber, identitytype, status, path, reason };
                let url = '';

                if (actionspage === 'create') {
                    url = api.url.memberidentity.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.memberidentity.update;
                    data.memberidentityid = this.props.memberidentityid;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var identityimage = (input.identityimage && input.identityimage[0] && input.identityimage[0]['originFileObj']) ? (errorFormat ? null : errorSize ? null : input.identityimage[0]['originFileObj']) : null;
                var identityuserimage = (input.identityuserimage && input.identityuserimage[0] && input.identityuserimage[0]['originFileObj']) ? (errorFormat ? null : errorSize ? null : input.identityuserimage[0]['originFileObj']) : null;
                fileRequest.append("identityimage", identityimage);
                fileRequest.append("identityuserimage", identityuserimage);
                fileRequest.append("path", path);
                
                SaveRequest(url, data, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshHeader();
                        this.props.onClose();
                        this.props.refreshList();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangeUpload = () => {
        this.setState({ upload: true });
    }

    onChangeUploadUser = () => {
        this.setState({ uploadUser: true });
    }

    errorCondition = (type, value) => {
        this.setState({ [type]: value })
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        const { generalfielddisabled } = this.state.fielddisabled;
        const { actionspage, identityimage, identityuserimage, key, keyUpload1 } = this.state;

        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext="Identity Type" datafield="typeidentity" options={optionsType} validationrules={['required']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="ID Card No" datafield="numberidentity" validationrules={['max.45', 'required']} maxLength={45} disabled={generalfielddisabled} />
                                <UploadBase form={this.props.form} accept={'image/jpeg, image/png'} maxSize={.5} value={identityimage} labeltext="Identity Image" datafield="identityimage" validationrules={actionspage === 'create' ? ['required'] : null} disabled={generalfielddisabled} onChange={this.onChangeUpload} key={keyUpload1} errorCondition={(type, value) => this.errorCondition(type, value)} custom={true} />
                                <UploadBase form={this.props.form} accept={'image/jpeg, image/png'} maxSize={.5} value={identityuserimage} labeltext="Identity User Image" datafield="identityuserimage" validationrules={actionspage === 'create' ? ['required'] : null} disabled={generalfielddisabled} onChange={this.onChangeUploadUser} key={key} errorCondition={(type, value) => this.errorCondition(type, value)} custom={true} />
                                {
                                    (actionspage !== 'create') ? <SelectBase form={this.props.form} labeltext="Status" datafield="status" options={optionsStatus} disabled={true} allowClear={false} /> : null
                                }
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                <Button htmlType="submit" type="default" label="Save" />
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));