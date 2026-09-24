
import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';
import { Button, SearchForm, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Card, Spin, Empty, Tag, Icon } from 'antd';
import moment from 'moment';
import PreviewMember from './Form';
import NewPreviewMember from './NewForm';

const { Title } = Typography;
const tagStatus = {
    ACTIVE: { value: 'ACTIVE', label: 'ACTIVE', color: '#13d416' },
    INACTIVE: { value: 'INACTIVE', label: 'INACTIVE', color: '#f1f514' },
    INACTIVEEMAIL: { value: 'INACTIVEEMAIL', label: 'INACTIVE EMAIL', color: '#c91010' },
    GRACEPERIOD: { value: 'GRACEPERIOD', label: 'GRACE PERIOD', color: '#c97010' },
    MERGED: { value: 'MERGED', label: 'MERGED', color: '#c91010' },
    DECEASED: { value: 'DECEASED', label: 'DECEASED', color: '#c91010' },
    TEST: { value: 'TEST', label: 'TEST', color: '#135ad4' },
    SUSPECTEDFRAUD: { value: 'SUSPECTEDFRAUD', label: 'SUSPECTED FRAUD', color: '#c91010' },
    FRAUD: { value: 'FRAUD', label: 'FRAUD', color: '#c91010' },
    TERMINATED: { value: 'TERMINATED', label: 'TERMINATED', color: '#c91010' },
    SUSPECTDUPLICATE: { value: 'SUSPECTDUPLICATE', label: 'SUSPECT DUPLICATE', color: '#0de0ba' },
    DUPLICATE: { value: 'DUPLICATE', label: 'DUPLICATE', color: '#0de0ba' }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            visible: false,
            searchingori: false,
            searchingdes: false,
            dataOri: [],
            dataDes: [],
            memberidOri: null,
            statusOri: null,
            statusDes: null,
            memberidDes: null,
            renderOri: false,
            renderDes: false,
            choosen: null,
            previewmemberdisabled: true,
            visibleNewModal: false
        }
    }

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
    };

    getData = (type, cardnumber, email) => {
        this.setState({ isLoading: true });
        DetailRequest(api.url.member.profile, { cardnumber, email, type: 'SUMMARY' }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                if (type === 'ori') {
                    if (response.result.status !== 'MERGED') {
                        let dataOri = [response.result];
                        let prefnumber = dataOri[0].membercontacts.find(obj => obj.preferrednumber === true)
                        let mobilenumber = dataOri[0].membercontacts.find(obj => obj.phonetype === 'MOBILE')
                        let privatenumber = dataOri[0].membercontacts.find(obj => obj.phonetype === 'PRIVATEPHONE')
                        let businessnumber = dataOri[0].membercontacts.find(obj => obj.phonetype === 'BUSINESSPHONE')
                        dataOri[0].memberOriContact =
                            (prefnumber !== undefined && prefnumber.active) ? prefnumber.phonetype === 'MOBILE' ? `${prefnumber.countryphonecode}${prefnumber.phonenumber}` : `${prefnumber.countryphonecode}${prefnumber.regioncode}-${prefnumber.phonenumber}` :
                                (mobilenumber !== undefined && mobilenumber.active) ? `${mobilenumber.countryphonecode}${mobilenumber.phonenumber}` :
                                    (privatenumber !== undefined && privatenumber.active) ? `${privatenumber.countryphonecode}${privatenumber.regioncode}-${privatenumber.phonenumber}` :
                                        (businessnumber !== undefined && businessnumber.active) ? `${businessnumber.countryphonecode}${businessnumber.regioncode}-${businessnumber.phonenumber}` : '-'

                        this.setState({ dataOri, memberidOri: dataOri[0].memberid, statusOri: dataOri[0].status, isLoading: false, renderOri: true });
                    } else {
                        Alert.error('This member origin already merged');
                        this.setState({ renderOri: false, isLoading: false, memberidOri: null });
                    }
                } else {
                    if (response.result.status !== 'MERGED') {
                        let dataDes = [response.result];
                        let prefnumber = dataDes[0].membercontacts.find(obj => obj.preferrednumber === true)
                        let mobilenumber = dataDes[0].membercontacts.find(obj => obj.phonetype === 'MOBILE')
                        let privatenumber = dataDes[0].membercontacts.find(obj => obj.phonetype === 'PRIVATEPHONE')
                        let businessnumber = dataDes[0].membercontacts.find(obj => obj.phonetype === 'BUSINESSPHONE')
                        dataDes[0].memberDesContact =
                            (prefnumber !== undefined && prefnumber.active) ? prefnumber.phonetype === 'MOBILE' ? `${prefnumber.countryphonecode}${prefnumber.phonenumber}` : `${prefnumber.countryphonecode}${prefnumber.regioncode}-${prefnumber.phonenumber}` :
                                (mobilenumber !== undefined && mobilenumber.active) ? `${mobilenumber.countryphonecode}${mobilenumber.phonenumber}` :
                                    (privatenumber !== undefined && privatenumber.active) ? `${privatenumber.countryphonecode}${privatenumber.regioncode}-${privatenumber.phonenumber}` :
                                        (businessnumber !== undefined && businessnumber.active) ? `${businessnumber.countryphonecode}${businessnumber.regioncode}-${businessnumber.phonenumber}` : '-'

                        this.setState({ dataDes, memberidDes: dataDes[0].memberid, statusDes: dataDes[0].status, isLoading: false, renderDes: true });
                    } else {
                        Alert.error('This member destination already merged');
                        this.setState({ renderDes: false, isLoading: false, memberidDes: null });
                    }
                }
            } else {
                if (type === 'ori') { this.setState({ formrender: false, isLoading: false, dataOri: [], memberidOri: null }) }
                else { this.setState({ formrender: false, isLoading: false, dataDes: [], memberidDes: null }) };
                Alert.error(response.status.responsemessage);
            }
        });
    };

    handleModal = (type) => {
        const { memberidOri, memberidDes, statusOri, statusDes } = this.state;
        DetailRequest(api.url.profileintegration.duplicate, { mastermember: memberidOri, mergewith: memberidDes }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                if (type === 'success') { this.setState({ memberidOri: null, memberidDes: null, dataOri: [], dataDes: [], previewmemberdisabled: true }) };
                if (memberidOri === memberidDes && memberidOri !== null && memberidDes !== null) {
                    Alert.error('Cardnumber origin cannot be same as cardnumber destination');
                } else if (statusOri === 'TERMINATED' || statusDes === 'TERMINATED') {
                    Alert.error('TERMINATED User Can Not Be Merged');
                } else {
                    this.setState({ visible: type === 'open' ? true : false });
                }
            } else {
                this.setState({ visible: false });
                this.setState({ memberidOri: null, memberidDes: null, dataOri: [], dataDes: [], previewmemberdisabled: true })
                Alert.error('Data has already Submitted');
            }
        })
    };

    handleSearchForm = (type, criteria, searching) => {
        let cardnumber = (criteria.oricardnumber === null || criteria.descardnumber === null) ? null : (type === 'ori') ? criteria.oricardnumber.split('%')[1] : criteria.descardnumber.split('%')[1];
        let email = (criteria.oriemail === null || criteria.desemail === null) ? null : (type === 'ori') ? criteria.oriemail.split('%')[1] : criteria.desemail.split('%')[1];
        this.setState({
            [searching]: (cardnumber === null && email === null && searching === 'searchingori') ? true : (cardnumber === null && email === null && searching === 'searchingdes') ? true : false,
            [type]: true, choosen: false
        })
        this.getData(type, cardnumber, email);
    };

    checkEligible = () => {
        let url = api.url.member.eligible;
        let origincardnumber = this.props.form.getFieldValue('oricardnumber')
        let destinationcardnumber = this.props.form.getFieldValue('descardnumber')
        let data = { origincardnumber, destinationcardnumber };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let mergeid;

                this.setState({ dataList, loading: false });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
            this.setState({ isLoading: false });
        });
    }

    handleNewModal = (type) => {
        this.setState({ visibleNewModal: type === 'open' ? true : false });
    };

    handleCancelNewModal = () => {
        this.setState({ visibleNewModal: false });
    };

    render() {
        const { previewmemberdisabled, isLoading, visible, visibleNewModal, searchingori, searchingdes, dataOri, dataDes, memberidOri, memberidDes, renderOri, renderDes, choosen } = this.state;
        const status = dataOri.length !== 0 ? dataOri[0].status : ''
        const status2 = dataDes.length !== 0 ? dataDes[0].status : ''
        const dateofbirthOri = dataOri.length !== 0 ? dataOri[0].dateofbirth : ''
        const dateofbirthDes = dataDes.length !== 0 ? dataDes[0].dateofbirth : ''
        const validate = dateofbirthOri === dateofbirthDes;
        const configurationOriSearchForm = [
            { labeltext: 'Card Number', datafield: 'oricardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: 'Email', datafield: 'oriemail', type: 'text', placeholder: 'Email', showDefaultSearch: true },
        ];
        const configurationDesSearchForm = [
            { labeltext: 'Card Number', datafield: 'descardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: 'Email', datafield: 'desemail', type: 'text', placeholder: 'Email', showDefaultSearch: true },
        ];
        const customOriClear = ['oricardnumber', 'oriemail', []];
        const customDesClear = ['descardnumber', 'desemail', []];

        let empty = <Col> <Title level={2} style={{ textAlign: 'center', marginTop: 70 }} className={''}>Let's Find a Member</Title>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ marginTop: 50 }} description='No Member Found' /> </Col>

        let originmember = dataOri.length === 0 ? empty : searchingori ? empty : !renderOri ? empty : dataOri.map((val, i) =>
            <Card key={i} bordered={true} className={(choosen === i) ? 'card-shadow' : ''} style={{ marginTop: 10 }}>
                <Col className='gutter-row' xs={24} xl={24}>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Cardnumber</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {(val.membercards === undefined || val.membercards === '' || val.membercards === null || val.membercards.length === 0) ? '-' : val.membercards[0].cardnumber}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Email</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px', color: val.emailverified ? '' : 'red' }}>: {(val.email === undefined || val.email === '' || val.email === null) ? '-' : <> {val.email} {val.emailverified ? <Icon type="check-circle" theme="twoTone" twoToneColor="#1890ff" /> : ''} </>} </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Name</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.firstname && val.lastname ? `${val.firstname} ${val.lastname}` : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Gender</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.gender ? val.gender : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Date of Birth</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.dateofbirth ? moment(val.dateofbirth).format('DD/MM/YYYY') : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Contact</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.memberOriContact ? val.memberOriContact : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Status</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {status ? <Tag color={tagStatus[status]['color']}>{tagStatus[status]['label']}</Tag> : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Tier Name</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {(val.membercards === undefined || val.membercards.length === 0) ? '-' : val.membercards[0].tiername ? val.membercards[0].tiername : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Membership</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {(val.memberaccount === undefined || val.memberaccount.length === 0 ? '-' : val.memberaccount[0].membertier.membershipname || val.memberaccount[0].membertier.membershiptypename ? <>{val.memberaccount[0].membertier.membershipname} - {val.memberaccount[0].membertier.membershiptypename}</> : '-')}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Current Miles</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px', color: val.currentmiles < 0 ? 'red' : '' }}>: {val.currentmiles ? val.currentmiles : 0}</Col>
                    </Row>
                </Col>
            </Card>
        )
        let destinationmember = dataDes.length === 0 ? empty : searchingdes ? empty : !renderDes ? empty : dataDes.map((val, i) =>
            <Card key={i} bordered={true} className={(choosen === i) ? 'card-shadow' : ''} style={{ backgroundColor: (choosen === i) ? '#1890FF' : '', color: (choosen === i) ? 'white' : '', marginTop: 10 }}>
                <Col className='gutter-row' xs={24} xl={24}>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Cardnumber</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {(val.membercards === undefined || val.membercards === '' || val.membercards === null || val.membercards.length === 0) ? '-' : val.membercards[0].cardnumber}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Email</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px', color: val.emailverified ? '' : 'red' }}>: {(val.email === undefined || val.email === '' || val.email === null) ? '-' : <> {val.email} {val.emailverified ? <Icon type="check-circle" theme="twoTone" twoToneColor="#1890ff" /> : ''} </>} </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Name</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.firstname && val.lastname ? `${val.firstname} ${val.lastname}` : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Gender</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.gender ? val.gender : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Date of Birth</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px', color: validate ? '' : 'red' }}>: {val.dateofbirth ? moment(val.dateofbirth).format('DD/MM/YYYY') : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Contact</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.memberDesContact ? val.memberDesContact : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Status</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: <Tag color={tagStatus[status2]['color']}>{tagStatus[status2]['label']}</Tag></Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Tier Name</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {val.membercards === undefined || val.membercards.length === 0 ? '-' : val.membercards[0].tiername ? val.membercards[0].tiername : '-'}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Membership</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px' }}>: {(val.memberaccount === undefined || val.memberaccount.length === 0 ? '-' : val.memberaccount[0].membertier.membershipname || val.memberaccount[0].membertier.membershiptypename ? <>{val.memberaccount[0].membertier.membershipname} - {val.memberaccount[0].membertier.membershiptypename}</> : '-')}</Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} xl={6} style={{ marginBottom: '10px' }}><label>Current Miles</label></Col>
                        <Col xs={24} xl={18} style={{ marginBottom: '10px', color: val.currentmiles < 0 ? 'red' : '' }}>: {val.currentmiles ? val.currentmiles : 0}</Col>
                    </Row>
                </Col>
            </Card>
        )

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Merging Account</Title>
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} loading={isLoading} onCancel={() => this.handleModal('close')} footer={null} destroyOnClose={true} style={{ top: 20 }} width={1200}>
                    <PreviewMember {...this.props} onClose={() => this.handleModal('success')} memberOrigin={memberidOri} memberDestination={memberidDes} />
                </Modal>
                <Modal visible={visibleNewModal} loading={isLoading} onCancel={() => this.handleNewModal('close')} footer={null} destroyOnClose={true} width={530}>
                    <NewPreviewMember {...this.props} dataOrigin={dataOri} dataDestination={dataDes} onCancelNewModal={this.handleCancelNewModal} />
                </Modal>

                <Row>
                    <Spin spinning={isLoading}>
                        <Col xs={24} sm={24} lg={12}>
                            <Divider orientation='left' style={{ margin: 10 }}>Member Origin</Divider>
                            <SearchForm form={this.props.form} optionsConfiguration={configurationOriSearchForm} onSubmit={value => this.handleSearchForm('ori', value, 'searchingori')}
                                showAdvanceSearch={false} allowCustomClear={true} customClear={customOriClear} />
                            <Row>
                                <div style={{ background: '#ffffff', padding: 10, overflow: 'auto' }} >
                                    {originmember}
                                </div>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} lg={12}>
                            <Divider orientation='left' style={{ margin: 10 }}>Member Destination</Divider>
                            <SearchForm form={this.props.form} optionsConfiguration={configurationDesSearchForm} onSubmit={value => this.handleSearchForm('des', value, 'searchingdes')}
                                showAdvanceSearch={false} allowCustomClear={true} customClear={customDesClear} />
                            <Row>
                                <div style={{ background: '#ffffff', padding: 10, overflow: 'auto' }} >
                                    {destinationmember}
                                </div>
                            </Row>
                        </Col>
                    </Spin>
                </Row>

                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                    <Button htmlType='button' type='primary' size='default' label='Preview Member' onClick={() => this.handleNewModal('open')} disabled={(memberidOri === null || memberidDes === null) ? previewmemberdisabled : false} />
                    <Button url="/merging-account" htmlType='link' type='default' label='Back' />
                </Row>

            </React.Fragment >
        );
    }
}
export default Form.create()(App);
