import React, { Component } from 'react';
import { DeleteRequest, RetrieveRequest, SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert, BranchSelect, Button, CountrySelect, MembershipSelect, NationalitySelect, SearchForm, TableBase, TierSelect, UploadDraggerBase, InputText, InputSearch, UploadCSV } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal, Spin, Divider, Empty, Table, Typography } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { StatusString, MemberStatus } from '../../../../data';
import { ExcelRenderer } from 'react-excel-renderer';

const { Text } = Typography;
const { Column } = Table;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleupload: false
        };
    };

    componentDidMount() {
        document.title = 'Accrual Promo Management | Loyalty Management System';
    };

    activeDeactivate(criteriacode, status) {
        const { type } = this.props;
        let url = ((status === 'ACTIVE') ? api.url.promomanage.member.deactivate : api.url.promomanage.member.activate);
        let data = (type === 'specific_member') ? { criteriamembercode: criteriacode } : { criteriacode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : `Selected data has been successfully ${status.toLowerCase()}ate`);
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };

        if (type === 'specific_member') {
            DeleteRequest(url, data, callback, true);
        } else DeleteRequest(url, data, callback);
    };

    deleteData(criteriacode) {
        const { type } = this.props;
        let url = (type === 'specific_member') ? api.url.promomanage.member.delete : api.url.promomanage.criteria.delete;
        let data = (type === 'specific_member') ? { criteriamembercode: criteriacode } : { criteriacode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback)
    };

    handleSearchForm = (previouscriteria) => {
        const { type } = this.props;
        const criteriavalue = previouscriteria[`${type}`];
        const name = previouscriteria[`${type}name`];
        const criteria = (type === 'specific_member') ? previouscriteria :
            (type === 'corporate') ? { criteriavalue, name } : {
                criteriavalue,
                name: (name) ? `%${name}%` : null
            };
        this.componentTable.handleSearchForm(criteria);
    };

    handleModal = (value, type) => {
        this.setState({ [type]: value });
        if (!value) this.componentTable.getList();
    };

    handleDownload = () => {
        window.location.href = 'https://amala-pdt.garuda-indonesia.com/uploads/accrualpromotemplate/Example_Upload.csv';
    };

    render() {
        const { visible, visibleupload } = this.state;
        const { menucode, prefixmenuname, type, promocode, upload } = this.props;
        const configurationSearchForm = (type === 'membership') ? [
            { labeltext: 'Membership Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Membership Name', showDefaultSearch: true },
            { labeltext: 'Membership ID', datafield: `${[type]}`, type: 'exact', placeholder: 'Membership ID', showDefaultSearch: true },
        ] : (type === 'tier') ? [
            { labeltext: 'Tier Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Tier Name', showDefaultSearch: true },
            { labeltext: 'Tier ID', datafield: `${[type]}`, type: 'exact', placeholder: 'Tier ID', showDefaultSearch: true },
        ] : (type === 'country') ? [
            { labeltext: 'Country Name', datafield: `${[type]}name`, type: 'exact', placeholder: 'Country Name', showDefaultSearch: true },
            { labeltext: 'Country Code', datafield: `${[type]}`, type: 'exact', placeholder: 'Country Code', showDefaultSearch: true },
        ] : (type === 'nationality') ? [
            { labeltext: 'Nationality', datafield: `${[type]}`, type: 'exact', placeholder: 'Nationality', showDefaultSearch: true },
        ] : (type === 'branch_office_enrollment' || type === 'branch_office_address') ? [
            { labeltext: `BO ${(type === 'branch_office_enrollment') ? 'Enrollment' : 'Address'} Name`, datafield: `${[type]}name`, type: 'exact', placeholder: `BO ${(type === 'branch_office_enrollment') ? 'Enrollment' : 'Address'} Name`, showDefaultSearch: true },
            { labeltext: `BO ${(type === 'branch_office_enrollment') ? 'Enrollment' : 'Address'} Code`, datafield: `${[type]}`, type: 'exact', placeholder: `BO ${(type === 'branch_office_enrollment') ? 'Enrollment' : 'Address'} Code`, showDefaultSearch: true },
        ] : (type === 'specific_member') ? [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Member Status', datafield: 'memberstatus', type: 'select', placeholder: 'Member Status', showDefaultSearch: true, options: MemberStatus, noSuffixPlaceholder: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', showDefaultSearch: true, options: StatusString, noSuffixPlaceholder: true },
        ] : [
            { labeltext: 'Corporate Name', datafield: `${[type]}name`, type: 'text', placeholder: 'Corporate Name', showDefaultSearch: true },
            { labeltext: 'Corporate Cardnumber', datafield: `${[type]}`, type: 'text', placeholder: 'Corporate Cardnumber', showDefaultSearch: true },
        ];

        const firstTitle = (type === 'specific_member') ? 'Member Status' : (type === 'corporate') ? 'Corporate Name' : `${(type === 'membership') ? 'Membership' : (type === 'tier') ? 'Tier' : (type === 'country') ? 'Country' : 'Branch Office'} Name`;
        const secondTitle = (type === 'membership') ? 'Membership ID' : (type === 'tier') ? 'Tier ID' : (type === 'country') ? 'Country Code' : (type === 'nationality') ? 'Nationality' : (type === 'branch_office_enrollment' || type === 'branch_office_address') ? 'Branch Office Code' : (type === 'specific_member') ? 'Status' : 'Corporate Cardnumber';
        const criteriakey = (type === 'branch_office_enrollment') ? 'BO_ENROLL' : (type === 'branch_office_address') ? 'BO_ADDRESS' : (type === 'specific_member') ? 'CARDNUMBER' : type.toUpperCase();

        let configurationTable = {
            url: (type === 'specific_member') ? api.url.promomanage.member.retrieve : api.url.promomanage.criteria.retrieve,
            criteria: (type === 'specific_member') ? { promocode } : { criteriakey, promocode },
            columns: [
                {
                    type: 'field', title: 'Cardnumber', dataIndex: 'cardnumber', sorter: true, key: 'specific_member',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true, key: 'specific_member',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: firstTitle, dataIndex: (type === 'specific_member') ? 'memberstatus' : (type === 'corporate') ? 'name' : 'name', sorter: true, key: 'nationality',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: secondTitle, dataIndex: (type === 'specific_member') ? 'status' : 'criteriavalue', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', align: 'center',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {(type === 'specific_member') ? ((row.status === 'INACTIVE') ? <Button htmlType='button' size='small' label='Activate' type='default' className='btn-custom-green' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.activeDeactivate(row.criteriamembercode, row.status)} />
                                    : <Button htmlType='button' size='small' label='Deactivate' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.activeDeactivate(row.criteriamembercode, row.status)} />) : null
                                }
                                {(type === 'specific_member') ?
                                    <Button htmlType='button' size='small' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' icon='delete' onClick={() => this.deleteData(row.criteriamembercode)} /> :
                                    <Button htmlType='button' size='small' label='Delete' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' type='danger' onClick={() => this.deleteData(row.criteriacode)} />
                                }
                            </span>
                        )
                    }
                },
                { type: 'field' }
            ]
        };

        if (type !== 'specific_member') configurationTable = { ...configurationTable, columns: configurationTable.columns.filter(obj => obj.key !== 'specific_member') };
        if (type === 'nationality') configurationTable = { ...configurationTable, columns: configurationTable.columns.filter(obj => obj.key !== 'nationality') };

        return (
            <React.Fragment>
                <Modal centered visible={visible || visibleupload} closable={!upload || visible} onCancel={() => this.handleModal(false, (visible) ? 'visible' : 'visibleupload')} footer={null} destroyOnClose={true} width={700}
                    title={<Row type='flex' justify='space-around' align='middle'>
                        <Col sm={(upload && visibleupload) ? 12 : 24}><Row type='flex' justify='start'>
                            {`${(visible) ? 'Add' : 'Upload'} ${jsUcfirst(type, '_')}`}
                        </Row></Col>
                        {(upload && visibleupload) ? <Col sm={12}><Row type='flex' justify='end'>
                            <Button htmlType='button' type='default' size='default' label='Example Upload File (.csv)' onClick={() => this.handleDownload()} />
                        </Row></Col> : null}
                    </Row>} >
                    <FormAdd {...this.props} visibleupload={visibleupload} type={type} ref={(e) => { this.componentAddMembership = e }} onClose={() => this.handleModal(false, (visible) ? 'visible' : 'visibleupload')} />
                </Modal>

                <Row style={{ marginBottom: 15 }}>
                    <Col xs={23} lg={(upload) ? 16 : 20}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup {jsUcfirst(type, '_')}</Divider>
                    </Col>
                    <Col xs={1}><span></span></Col>
                    <Col xs={24} lg={(upload) ? 7 : 3}>
                        {(upload) ?
                            <Button htmlType='button' type='primary' style={{ marginTop: 15, marginBottom: 15 }} size='default' label='New with Upload' icon='upload' onClick={() => this.handleModal(true, 'visibleupload')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' /> : null
                        }
                        <Button htmlType='button' type='primary' style={{ marginTop: 15 }} size='default' label='+ New Setup' onClick={() => this.handleModal(true, 'visible')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
};

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actioncode: 'create',
            rows: [],
            corporatecardnumberfielddisabled: false,
            corporatenamefielddisabled: false
        };
    };

    componentDidMount() { };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { criteriavalueform } = input || {};
                const { type, match } = this.props;

                const promocode = match.params.ID;
                const promocategorytype = 'MEMBER';
                const criteriakey = (type === 'branch_office_enrollment') ? 'BO_ENROLL' : (type === 'branch_office_address') ? 'BO_ADDRESS' : (type === 'specific_member') ? 'CARDNUMBER' : type.toUpperCase();

                let data = (type === 'specific_member') ? { promocode, cardnumber: criteriavalueform } : { promocode, promocategorytype, criteriakey, criteriavaluelist: [criteriavalueform] };
                let url = (type === 'specific_member') ? api.url.promomanage.member.create : api.url.promomanage.criteria.create;
                let message = 'New data has been created';

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.onClose();
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    saveUploadAction = (e) => {
        e.preventDefault();
        const { type } = this.props;
        const fileupload = this.props.form.getFieldValue('specificcardnumber');

        this.setState({ isLoading: true });
        if (fileupload.length !== 0) {
            let message = 'New data has been created';
            let url = api.url.promomanage.upload;

            let dataList = {
                filename: fileupload[0]['name'],
                promocategorytype: 'MEMBER',
                promocode: this.props.match.params.ID
            };

            if (type === 'corporate') {
                url = api.url.promomanage.criteriaupload;
                dataList.criteriakey = 'CORPORATE';
            } else dataList.criteriatype = 'CARDNUMBER';

            var fileRequest = new FormData();
            var file = fileupload[0]['originFileObj'];
            fileRequest.append('file', file);

            SaveRequest(url, dataList, fileRequest).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode === '0000') {
                    Alert.success((responsemessage) ? responsemessage : message);
                    this.props.onClose();
                    this.setState({ isLoading: false });
                } else {
                    Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                };
            });
        } else {
            this.setState({ isLoading: false });
            Alert.error('Please upload file to process it');
        }
    };

    handleInput = async (value) => {
        if (value && (value.length > 0)) {
            const { type } = this.props;

            if (type === 'membership') {
                this.componentMembershipSelect.retrieveData({ membershipname: `%${value}%` });
            } else if (type === 'tier') {
                this.componentTierSelect.retrieveData({ tiername: `%${value}%` });
            } else if (type === 'country') {
                this.componentCountrySelect.retrieveData({ countryname: `%${value}%` });
            } else if (type === 'nationality') {
                this.componentNationalitySelect.retrieveData({ nationality: `%${value}%` });
            } else if (type === 'branch_office_enrollment' || type === 'branch_office_address') {
                this.componentBranchSelect.retrieveData({ branchname: `%${value}%` });
            };
        } else this.handleData(value);
    };

    handleData = (value) => {
        const { type } = this.props;

        if (!value || (value.length === 0)) {
            this.props.form.resetFields(['criteriavalueform', []]);
            if (type === 'membership') {
                this.componentMembershipSelect.handleResetOptions();
            } else if (type === 'tier') {
                this.componentTierSelect.handleResetOptions();
            } else if (type === 'country') {
                this.componentCountrySelect.handleResetOptions();
            } else if (type === 'nationality') {
                this.componentNationalitySelect.handleResetOptions();
            } else if (type === 'branch_office_enrollment' || type === 'branch_office_address') {
                this.componentBranchSelect.handleResetOptions();
            };
        }
    };

    handleFile = (e) => {
        if (Object.keys(e).length) {
            let fileObj = e.file;
            if (
                !(fileObj.type === 'text/csv' )
            ) {
                Alert.error('Unknown file format. Only (.csv) file will be uploaded.');
                return false;
            }

            if (fileObj) {
                ExcelRenderer(fileObj, (err, resp) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let newRows = [];
                        resp.rows.slice(1).map((row, index) => {
                            if (row && row !== 'undefined') {
                                newRows.push({
                                    key: index,
                                    corporatename : row[0],
                                    corporatecardnumber: row[1],
                                    membername: row[1],
                                    memberstatus: row[2],
                                    status: row[3],
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
        return false;
    };

    handleChange = (file) => {
        if (file.fileList.length === 0) this.setState({ rows: [] });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOpenModal = () => {
        this.setState({ visible: true });
    };

    handleCorporateSearch = (value) => {
        this.setState({ isLoading: true });

        if (value) {
            RetrieveRequest(api.url.corporate.list, { cardnumber: value }).then((response) => {
                const { status, result } = response;
                if ((status.responsecode === '0000') && result && (result.length !== 0)) {
                    const { corporatename, corporatecode, corporateemail } = result[0] || {};

                    this.props.form.setFieldsValue({ corporatename, corporatecode, corporateemail });
                    this.setState({ isLoading: false });
                } else {
                    Alert.error((status.responsemessage) ? status.responsemessage : 'No corporate match found');
                    this.props.form.resetFields(['corporatename', 'corporatecode', 'corporateemail', []]);
                    this.setState({ isLoading: false });
                };
            });
        } else {
            Alert.information(`Please input corporate cardnumber first`);
            this.props.form.resetFields(['corporatename', 'corporatecode', 'corporateemail', []]);
            this.setState({ isLoading: false });
        };
    };

    render() {
        const { isLoading, rows, visible } = this.state;
        const { menucode, prefixmenuname, type, visibleupload } = this.props;
        const generalfielddisabled = false
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: (visibleupload) ? 24 : 14 } }
        };

        return (
            <React.Fragment>
                <Modal title='File Preview' visible={visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    {
                        (rows.length && type !== 'specific_member') ?
                            <TemplatePreview {...this.props} {...this.state} />
                            : (rows.length && type === 'specific_member') ? <PreviewSpecificMember {...this.props} {...this.state} />
                                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No data displayed</span>} />
                    }
                </Modal>
                <Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={(visibleupload) ? this.saveUploadAction : this.saveAction}>
                            <Row gutter={24} type='flex' justify={(visibleupload) ? 'center' : 'left'}>
                                {(type === 'membership') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext='Membership' datafield='criteriavalueform' disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'tier') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <TierSelect form={this.props.form} ref={(e) => { this.componentTierSelect = e }} labeltext='Tier' datafield='criteriavalueform' disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'country') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext='Country' datafield='criteriavalueform' form={this.props.form} disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'nationality') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <NationalitySelect ref={(e) => { this.componentNationalitySelect = e }} labeltext='Nationality' datafield='criteriavalueform' form={this.props.form} disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'branch_office_enrollment' || type === 'branch_office_address') ? <Col className='gutter-row' xs={24} sm={19}>
                                    <BranchSelect ref={(e) => { this.componentBranchSelect = e }} labeltext={`Branch Office ${(type === 'branch_office_enrollment') ? 'Enrollment' : 'Address'}`} datafield='criteriavalueform' form={this.props.form} disabled={generalfielddisabled} showArrow={false} onSearch={this.handleInput} onChange={this.handleData} />
                                </Col> : (type === 'specific_member' && !visibleupload) ? <Col className='gutter-row' xs={24} sm={19}>
                                    <InputText labeltext='Card Number' datafield='criteriavalueform' form={this.props.form} maxLength={9} disabled={generalfielddisabled} />
                                </Col> : (!visibleupload) ?
                                    <Col className='gutter-row' xs={24} sm={20}>
                                        <InputSearch labeltext='Corporate Cardnumber' datafield='criteriavalueform' placeholder={'Input by Cardnumber'} form={this.props.form} maxLength={9} disabled={generalfielddisabled} onSearch={this.handleCorporateSearch} />
                                        <InputText labeltext='Corporate Name' datafield='corporatename' form={this.props.form} disabled={true} />
                                        <InputText labeltext='Corporate Code' datafield='corporatecode' form={this.props.form} disabled={true} />
                                        <InputText labeltext='Corporate Email' datafield='corporateemail' form={this.props.form} disabled={true} />
                                    </Col> : null
                                }
                                {
                                    (visibleupload) ? <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 9, offset: 3 }} xl={{ span: 9, offset: 3 }}>
                                        <UploadCSV form={this.props.form} labeltext='File' datafield='specificcardnumber' getValueFromEvent={(e) => this.handleFile(e)} accept={'.csv'} onChange={this.handleChange} disabled={generalfielddisabled} onlyOne={true} />
                                        <Button htmlType='button' type='default' size='default' label='Preview' onClick={() => this.handleOpenModal()} disabled={!rows.length} />
                                    </Col> : null
                                }
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='ACCESS'></Button>
                                <Button htmlType='button' type='defaut' label='Close' onClick={this.props.onClose}></Button>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            </React.Fragment >
        );
    };
};

class TemplatePreview extends Component {
    render() {
        let { rows, fileName } = this.props;
        rows = rows.filter((obj) => { return obj.corporatename !== undefined }).map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Form.Item>
                <Text strong>File Name: {fileName}</Text>
                <Table rowKey={record => record.number} dataSource={rows} pagination={false} scroll={{ y: 260 }}>
                    <Column title='No' dataIndex='no' key='no' render={(value) => ((value) ? value : '-')} width={20} />
                    <Column title='Corporate Name' dataIndex='corporatename' key='corporatename' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Corporate Card Number' dataIndex='corporatecardnumber' key='cardnumber' render={(value) => ((value) ? value : '-')} width={50} />
                </Table>
            </Form.Item>
        )
    }
}
class PreviewSpecificMember extends Component {
    render() {
        let { rows, fileName } = this.props;
        rows = rows.filter((obj) => { return obj.corporatename !== undefined }).map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Form.Item>
                <Text strong>File Name: {fileName}</Text>
                <Table rowKey={record => record.number} dataSource={rows} pagination={false} scroll={{ y: 260 }}>
                    <Column title='No' dataIndex='no' key='no' render={(value) => ((value) ? value : '-')} width={20} />
                    <Column title='Card Number' dataIndex='corporatecardnumber' key='corporatecardnumber' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Member Name' dataIndex='membername' key='membername' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Member Status' dataIndex='memberstatus' key='memberstatus' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Status' dataIndex='status' key='status' render={(value) => ((value) ? value : '-')} width={50} />
                </Table>
            </Form.Item>
        )
    }
}

const FormAdd = Form.create()(Add);
const SetupFormIndex = Form.create()(App);
export default SetupFormIndex;