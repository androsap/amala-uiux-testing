import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { Alert, Button, UploadCSV, SwitchButton, SelectBase, PartnerSelect, MembershipSelect, TierSelect, ChannelSelect, BranchSelect, CountrySelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Modal, Empty, Spin, Table, Typography } from 'antd';
import { Month, Gender } from '../../../../data';
import TableCardnumber from './Cardnumber'
import { ExcelRenderer } from 'react-excel-renderer';

const { Text } = Typography;
const { Column } = Table;

class MemberCriteria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'create',
            specificmember: false,
            isLoading: false,
            data: [],
            rows: [],
            cardnumber: [],
            visible: false,
            showcardnumber: false,
        }
    }

    componentDidMount() {
        document.title = ' Add New Redemption Promo | Loyalty Management System';
        this.getDetail();
    }
    async getDetail() {
        const { promocatalogcode } = this.props;
        this.setState({ isLoading: true })
        await DetailRequest(api.url.redemptionpromo.criteriacategory.getcriteriacategory, { promocatalogcode }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                let data = result.find(o => o.criteriatypecode === 'MEMBER');
                if (data !== undefined) {
                    let branchofficeaddress = data.promocategory.find(o => o.category === 'Branch Office Address').data;
                    let partnerenrollcode = data.promocategory.find(o => o.category === 'Partner Enroll Code').data;
                    let branchofficeenrollment = data.promocategory.find(o => o.category === 'Branch Office Enrollment').data;
                    let birthdatemonth = data.promocategory.find(o => o.category === 'Birth Date Month').data.toString();
                    let gender = data.promocategory.find(o => o.category === 'Gender').data;
                    let country = data.promocategory.find(o => o.category === 'Country').data;
                    let membership = data.promocategory.find(o => o.category === 'Membership').data;
                    let enrollchannel = data.promocategory.find(o => o.category === 'Enroll Channel').data;
                    let cardnumber = data.promocategory.find(o => o.category === 'Card Number').data;
                    let tier = data.promocategory.find(o => o.category === 'Tier').data;
                    let specificmember = (cardnumber === undefined) ? false : (cardnumber.length !== 0) ? true : false;
                    let datafield = { branchofficeaddress, partnerenrollcode, enrollchannel, birthdatemonth, branchofficeenrollment, gender, country, membership, tier, specificmember };
                    this.props.form.setFieldsValue(datafield);
                    if (birthdatemonth === '') this.props.form.resetFields(['birthdatemonth', []]);;
                    this.criteriaTypeDisabledField();
                    this.setState({ data: result, action: 'update', cardnumber, specificmember });
                };
            };
            this.componentPartnerSelect.retrieveData();
            this.componentBranchEnrollSelect.retrieveData();
            this.componentBranchAddressSelect.retrieveData();
            this.componentChannelSelect.retrieveData();
            this.componentMembershipSelect.retrieveData();
            this.componentCountrySelect.retrieveData();
            this.componentTierSelect.retrieveData();
            setTimeout(() => { this.setState({ isLoading: false }) }, 1500);
        })
    };

    criteriaTypeDisabledField = () => {
        let membershipdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'membership').active === true) ? false : true;
        let tierdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'tier').active === true) ? false : true;
        let countrydisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'country').active === true) ? false : true;
        let branchofficeenrollmentdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'branchofficeenrollment').active === true) ? false : true;
        let branchofficeaddressdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'branchofficeaddress').active === true) ? false : true;
        let enrollchanneldisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'enrollchannel').active === true) ? false : true;
        let partnerenrollcodedisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'partnerenrollcode').active === true) ? false : true;
        let genderdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'gender').active === true) ? false : true;
        let birthdatemonthdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'birthdatemonth').active === true) ? false : true;
        let cardnumberdisabled = this.props.memberdisabled ? true : (this.props.dataMemberCategory.find(o => o.categorytypecode === 'cardnumber').active === true) ? false : true;

        this.setState({ membershipdisabled, tierdisabled, countrydisabled, branchofficeenrollmentdisabled, branchofficeaddressdisabled, enrollchanneldisabled, partnerenrollcodedisabled, genderdisabled, birthdatemonthdisabled, cardnumberdisabled })
    }

    saveAction = (e) => {
        e.preventDefault();
        const { action } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let dataList = {};
                let datamember = [];
                let data = (action === 'update') ? this.state.data.find(o => o.criteriatypecode === 'MEMBER') : undefined;

                let membership = {}, branchofficeaddress = {}, branchofficeenrollment = {}, country = {}, enrollchannel = {},
                    tier = {}, partnerenrollcode = {}, gender = {}, birthdatemonth = {}, cardnumber = {};

                if (action === 'update') {
                    membership['promocategorycode'] = (data.promocategory.find(o => o.category === 'Membership').promocategorycode);
                    membership['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Membership').promocriteriacode);
                    branchofficeaddress['promocategorycode'] = (data.promocategory.find(o => o.category === 'Branch Office Address').promocategorycode);
                    branchofficeaddress['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Branch Office Address').promocriteriacode);
                    branchofficeenrollment['promocategorycode'] = (data.promocategory.find(o => o.category === 'Branch Office Enrollment').promocategorycode);
                    branchofficeenrollment['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Branch Office Enrollment').promocriteriacode);
                    country['promocategorycode'] = (data.promocategory.find(o => o.category === 'Country').promocategorycode);
                    country['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Country').promocriteriacode);
                    enrollchannel['promocategorycode'] = (data.promocategory.find(o => o.category === 'Enroll Channel').promocategorycode);
                    enrollchannel['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Enroll Channel').promocriteriacode);
                    tier['promocategorycode'] = (data.promocategory.find(o => o.category === 'Tier').promocategorycode);
                    tier['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Tier').promocriteriacode);
                    partnerenrollcode['promocategorycode'] = (data.promocategory.find(o => o.category === 'Partner Enroll Code').promocategorycode);
                    partnerenrollcode['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Partner Enroll Code').promocriteriacode);
                    gender['promocategorycode'] = (data.promocategory.find(o => o.category === 'Gender').promocategorycode);
                    gender['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Gender').promocriteriacode);
                    birthdatemonth['promocategorycode'] = (data.promocategory.find(o => o.category === 'Birth Date Month').promocategorycode);
                    birthdatemonth['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Birth Date Month').promocriteriacode);
                    cardnumber['promocategorycode'] = (data.promocategory.find(o => o.category === 'Card Number').promocategorycode);
                    cardnumber['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Card Number').promocriteriacode);
                };
                membership['categorytypecode'] = 'membership';
                membership['data'] = (values.specificmember === true) ? [undefined] : (values.membership === undefined) ? [undefined] : (values.membership.length === 0) ? [undefined] : values.membership;
                branchofficeaddress['categorytypecode'] = 'branchofficeaddress';
                branchofficeaddress['data'] = (values.specificmember === true) ? [undefined] : (values.branchofficeaddress === undefined) ? [undefined] : (values.branchofficeaddress.length === 0) ? [undefined] : values.branchofficeaddress;
                branchofficeenrollment['categorytypecode'] = 'branchofficeenrollment';
                branchofficeenrollment['data'] = (values.specificmember === true) ? [undefined] : (values.branchofficeenrollment === undefined) ? [undefined] : (values.branchofficeenrollment.length === 0) ? [undefined] : values.branchofficeenrollment;
                country['categorytypecode'] = 'country';
                country['data'] = (values.specificmember === true) ? [undefined] : (values.country === undefined) ? [undefined] : (values.country.length === 0) ? [undefined] : values.country;
                enrollchannel['categorytypecode'] = 'enrollchannel';
                enrollchannel['data'] = (values.specificmember === true) ? [undefined] : (values.enrollchannel === undefined) ? [undefined] : (values.enrollchannel.length === 0) ? [undefined] : values.enrollchannel;
                tier['categorytypecode'] = 'tier';
                tier['data'] = (values.specificmember === true) ? [undefined] : (values.tier === undefined) ? [undefined] : (values.tier.length === 0) ? [undefined] : values.tier;
                partnerenrollcode['categorytypecode'] = 'partnerenrollcode';
                partnerenrollcode['data'] = (values.specificmember === true) ? [undefined] : (values.partnerenrollcode === undefined) ? [undefined] : (values.partnerenrollcode.length === 0) ? [undefined] : values.partnerenrollcode;
                gender['categorytypecode'] = 'gender';
                gender['data'] = (values.specificmember === true) ? [undefined] : (values.gender === undefined) ? [undefined] : (values.gender.length === 0) ? [undefined] : values.gender;
                birthdatemonth['categorytypecode'] = 'birthdatemonth';
                birthdatemonth['data'] = (values.specificmember === true) ? [undefined] : (values.birthdatemonth === undefined) ? [undefined] : [values.birthdatemonth];

                cardnumber['type'] = 'cardnumber';
                cardnumber['categorytypecode'] = 'cardnumber';
                cardnumber['filename'] = values.specificmember === false ? null : values.uploadcardnumber[0].name;
                cardnumber['data'] = values.uploadcardnumber !== undefined ? null : values.specificmember === false ? null : this.state.cardnumber.length !== 0 ? this.state.cardnumber : [undefined];

                datamember.push(membership, branchofficeaddress, branchofficeenrollment, enrollchannel, partnerenrollcode, gender, birthdatemonth, cardnumber, tier, country);

                let promocriteria = Object.assign({ criteriatypecode: 'MEMBER', promocategory: datamember });
                if (action === 'create') {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteria: [promocriteria] });
                } else {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteriacode: data.promocriteriacode, criteriatypecode: 'MEMBER', promocategory: datamember });
                }

                let message = '';
                let url = '';
                if (action === 'create') {
                    message = 'New data has been created';
                    url = api.url.redemptionpromo.criteriacategory.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.redemptionpromo.criteriacategory.update;
                }
                var fileRequest = new FormData();
                var file = (values.uploadcardnumber !== undefined) ? values.uploadcardnumber[0]['originFileObj'] : null;
                fileRequest.append('file', file);

                if (values.specificmember === false) {
                    if (cardnumber.data === null || cardnumber.data[0] === undefined) { } else {
                        let promocategorycode = cardnumber.promocategorycode;
                        let data = { promocategorycode };
                        DetailRequest(api.url.redemptionpromo.criteriacategory.delete, data).then((response) => {
                            const { responsecode, responsemessage } = response.status;
                            if (responsecode.substring(0, 1) === '0') {
                                file = null;
                            } else {
                                Alert.error(responsemessage);
                            }
                        });
                    }
                }
                SaveRequest(url, dataList, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.form.resetFields();
                    } else {
                        Alert.error(responsemessage);
                    }
                });
                setTimeout(() => {
                    this.getDetail();
                    this.setState({ action: 'update', isLoading: false });
                }, 1000);
            }
        });
    };

    onChangeSpecific = (value) => {
        this.setState({ specificmember: value });
        if (!value) { this.props.form.resetFields(['uploadcardnumber', []]) };
    };

    handleOpenModal = (type) => {
        if (type === 'cardnumber') this.setState({ showcardnumber: true });
        if (type === 'preview') this.setState({ visible: true });
    };
    
    handleCancel = () => {
        this.setState({ showcardnumber: false });
        this.setState({ visible: false });
    };

    handleChange = (file) => {
        if (file.fileList.length === 0) this.setState({ rows: [] });
    };

    handleDownload = () => {
        window.location.href = 'https://amala-pdt.garuda-indonesia.com/uploads/accrualpromotemplate/Example_Upload.csv';
    };

    handleFile = (e) => {
        var reader = new FileReader();
        if (e.file === undefined) {
            reader.readAsDataURL(e.file);
        }

        if (Object.keys(e).length) {
            let fileObj = e.file;
            if (!(fileObj.type === 'text/csv')) {
                Alert.error('Unknown file format. Only (.csv) file will be uploaded.');
                return false;
            }

            if (fileObj) {
                reader.readAsDataURL(e.file);
                ExcelRenderer(fileObj, (err, resp) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let newRows = [];
                        resp.rows.slice(1).map((row, index) => {
                            if (row && row !== 'undefined') {
                                newRows.push({
                                    key: index,
                                    cardnumber: row[0],
                                });
                            }
                        });

                        if (newRows.length === 0) {
                            Alert.error('No data found in file.');
                            return false;
                        } else {
                            this.setState({
                                fileName: fileObj.name,
                                cols: resp.cols,
                                rows: newRows
                            });
                        }
                    }
                });
                this.setState({ fileObj });
                return e && e.fileList;
            }
        }

        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { rows, visible, specificmember, cardnumber, action, showcardnumber, isLoading, membershipdisabled, tierdisabled, countrydisabled, branchofficeenrollmentdisabled, branchofficeaddressdisabled, enrollchanneldisabled, partnerenrollcodedisabled, genderdisabled, birthdatemonthdisabled, cardnumberdisabled } = this.state;
        //render form
        return (
            <Row>
                <Modal visible={showcardnumber} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    {(cardnumber !== undefined) ? <TableCardnumber {...this.props} cardnumber={cardnumber} /> : <Empty image='../assets/images/searching.svg' imageStyle={{ height: 200 }} description='' className={(!cardnumber) ? '' : 'hidden'} />}
                </Modal>
                <Modal title='File Preview' visible={visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    {
                        (rows.length) ?
                            <PreviewSpecificMember {...this.props} {...this.state} />
                            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No data displayed</span>} />
                    }
                </Modal>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout} >
                        <Row>
                            <SwitchButton form={this.props.form} defaultChecked={false} labeltext='Spesific Member' datafield='specificmember' onChange={this.onChangeSpecific} />
                            <Row style={{ display: (specificmember) ? 'block' : 'none' }}>
                                <Col xs={16} >
                                    <UploadCSV labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} getValueFromEvent={(e) => this.handleFile(e)} form={this.props.form} labeltext='Card Number' datafield='uploadcardnumber' onChange={this.handleChange} validationrules={[!specificmember ? '' : 'required']} disabled={cardnumberdisabled} onlyOne={true} />
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                    <Button htmlType='button' type='default' size='default' label='Preview' onClick={() => this.handleOpenModal('preview')} disabled={!rows.length} />
                                    <Button htmlType='button' type='default' size='default' label='Example Upload File (.csv)' onClick={() => this.handleDownload()} />
                                </Col>
                                <Col xs={8}>
                                    <Row style={{ display: (cardnumber === undefined) ? 'none' : ((cardnumber.length === 0) ? 'none' : 'block') }} ><Button style={{ marginTop: 3 }} type='primary' size='default' label='View Cardnumber' htmlType='button' onClick={() => this.handleOpenModal('cardnumber')} disabled={cardnumberdisabled} /></Row>
                                </Col>
                            </Row>
                            <Row style={{ display: specificmember ? 'none' : 'block' }}>
                                <Divider></Divider>
                                <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} mode='multiple' form={this.props.form} labeltext='Membership' datafield='membership' disabled={membershipdisabled} />
                                <TierSelect ref={(e) => { this.componentTierSelect = e }} mode='multiple' form={this.props.form} labeltext='Tier' datafield='tier' disabled={tierdisabled} />
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} mode='multiple' form={this.props.form} labeltext='Country' datafield='country' disabled={countrydisabled} />
                                <BranchSelect ref={(e) => { this.componentBranchEnrollSelect = e }} form={this.props.form} mode='multiple' labeltext='Branch Office Enroll' datafield='branchofficeenrollment' disabled={branchofficeenrollmentdisabled} />
                                <BranchSelect ref={(e) => { this.componentBranchAddressSelect = e }} form={this.props.form} mode='multiple' labeltext='Branch Office Adress' datafield='branchofficeaddress' disabled={branchofficeaddressdisabled} />
                                <ChannelSelect ref={(e) => { this.componentChannelSelect = e }} mode='multiple' form={this.props.form} labeltext='Enroll Channel' datafield='enrollchannel' disabled={enrollchanneldisabled} />
                                <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} mode='multiple' form={this.props.form} labeltext='Partner Channel Code' datafield='partnerenrollcode' disabled={partnerenrollcodedisabled} />
                                <SelectBase form={this.props.form} mode='multiple' labeltext='Gender' datafield='gender' options={Gender} disabled={genderdisabled} />
                                <SelectBase form={this.props.form} labeltext='Birth Date (Month)' datafield='birthdatemonth' options={Month} disabled={birthdatemonthdisabled} />
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ margin: 30 }}>
                                <Button htmlType='submit' type='primary' label={(action === 'create' ? 'Save' : 'Submit')} onClick={this.saveAction} />
                                <Button url='/promo-catalog' htmlType='link' type='default' label='Back' />
                            </Row>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

class PreviewSpecificMember extends Component {
    render() {
        let { rows, fileName } = this.props;
        rows = rows.filter((obj) => { return obj.cardnumber !== undefined }).map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Form.Item>
                <Text strong>File Name: {fileName}</Text>
                <Table rowKey={record => record.number} dataSource={rows} pagination={false} scroll={{ y: 260 }}>
                    <Column title='Card Number' dataIndex='cardnumber' key='cardnumber' render={(value) => ((value) ? value : '-')} width={50} />
                </Table>
            </Form.Item>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(MemberCriteria));