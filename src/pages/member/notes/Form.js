import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { getProfile } from '../../../utilities/AuthService';
import { connect } from 'react-redux';
import { Button, Alert, SelectBase, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Divider, Empty } from 'antd';
import { TypeNotes, Level } from '../../../data';
import ReactJson from 'react-json-view';

const prefixmenuname = 'MBNOTES';
const menucode = 'MBNOTES';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            validationrulesvalue: [],
            maxlengthvalue: null,
            fieldvalue: {
                databefore: null,
                dataafter: null,
                createdby: null
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.membernotesid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (membernotesid, actionspage) => {
        let url = api.url.membernotes.list;
        let criteria = { membernotesid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (result.length !== 0) {

                    let { type, level, notes, createdBy, databefore, dataafter } = result[0] || {};
                    let generalfielddisabled = (actionspage === 'view' || type === 'LOG' || createdBy !== getProfile().username) ? true : false;
                    actionspage = (actionspage === 'view' || type === 'LOG' || createdBy !== getProfile().username) ? 'view' : 'edit';

                    this.setState({
                        actionspage,
                        fielddisabled: { ...this.state.fielddisabled, generalfielddisabled },
                        fieldvalue: { ...this.state.fieldvalue, databefore, dataafter, createdby: createdBy }
                    });
                    let titlepage = (actionspage === 'view' || type === 'LOG' || createdBy !== getProfile().username) ? 'View' : 'Edit';
                    this.props.setTitlePage(titlepage);

                    let setValue = { typemembernotes: type, levelmembernotes: level, notesmembernotes: notes };
                    this.props.form.setFieldsValue(setValue);
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
            } else this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { typemembernotes, notesmembernotes, levelmembernotes } = input || {};
                const memberid = this.props.memberid;

                let message = '';
                let data = {
                    memberid,
                    type: typemembernotes,
                    notes: notesmembernotes,
                    level: (typemembernotes === 'COMPLAINT') ? levelmembernotes : null
                };

                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.membernotes.create;
                } else {
                    message = 'New data has been updated';
                    url = api.url.membernotes.update;
                    data.membernotesid = this.props.membernotesid;
                }
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);

                        this.props.refreshHeader();
                        this.props.onClose();
                        this.props.refreshList();
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    handleNotesType = () => {
        this.props.form.setFieldsValue({ levelmembernotes: undefined });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { generalfielddisabled } = this.state.fielddisabled;
        const { databefore, dataafter } = this.state.fieldvalue;
        const { actionspage, isLoading } = this.state;
        let type = this.props.form.getFieldValue('typemembernotes');

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext='Note Type' datafield='typemembernotes' validationrules={['required']} options={TypeNotes.slice(0, 2)} onChange={this.handleNotesType} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} className={(type === 'COMPLAINT') ? '' : 'hidden'} labeltext='Level' datafield='levelmembernotes' validationrules={((type === 'COMPLAINT')) ? ['required'] : []} options={Level} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext='Notes' datafield='notesmembernotes' validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} className={(type === 'LOG') ? '' : 'hidden'}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Divider>Before</Divider>
                                {
                                    (databefore !== null) ?
                                        <ReactJson style={{ height: '250px', overflowY: 'scroll' }} displayDataTypes={false} src={JSON.parse(databefore)} /> : <Empty />
                                }
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={12}>
                                <Divider>After</Divider>
                                {
                                    (databefore !== null) ?
                                        <ReactJson style={{ height: '250px', overflowY: 'scroll' }} displayDataTypes={false} src={JSON.parse(dataafter)} /> : <Empty />
                                }
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view') ? <Button htmlType='submit' type='default' label='Save' /> : null
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