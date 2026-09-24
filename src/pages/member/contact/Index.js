import React from 'react';
import ContactForm from './Form';
import { DetailRequest, DeleteRequest, SaveRequest } from '../../../utilities/RequestService';
import { Form, Button as AntdButton, Row, Col, Divider, Typography, Collapse, Spin, Table, Icon, Modal, Checkbox } from 'antd';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { api } from '../../../config/Services';
import { getProfile } from '../../../utilities/AuthService';
import { Link } from 'react-router-dom';

const { Column } = Table;
const { Title } = Typography;
const { Panel } = Collapse;

const isBOD = getProfile().rolename === 'BOD';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: ['MOBILE', 'PRIVATEPHONE', 'BUSINESSPHONE', 'PRIVATEFAX', 'BUSINESSFAX'],
            isLoading: false,
            visible: false,
            masked: true
        }
        this.componentTableSelect = [];
    }

    onClickCollapse = (key) => {
        this.setState({ activeKey: key });
    }

    handleOpenModal = (type) => {
        this.componentTableSelect[type].handleOpenModal();
    }

    handleOpenModalSetup = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

     handleMasking = () => {
        this.setState({ masked: !this.state.masked });
    };


    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 4 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { menucode, prefixmenuname } = this.props;
        const { activeKey, visible, isLoading, masked } = this.state;
        const phone = [
            { label: 'Mobile', value: 'MOBILE' },
            { label: 'Private Phone', value: 'PRIVATEPHONE' },
            { label: 'Business Phone', value: 'BUSINESSPHONE' },
            { label: 'Private Fax', value: 'PRIVATEFAX' },
            { label: 'Business Fax', value: 'BUSINESSFAX' }
        ];

        return (
            <Row>
                <Row>
                    <Col xs={12} xl={18}>
                        <Title level={4}>Contact</Title>
                    </Col>
                    <Col xs={12} sm={6} align="right" style={{ textAlign: "right" }}>
                        <Link to="#" onClick={this.handleMasking} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#717171',
                            textDecoration: 'none',
                            marginRight: '16px',
                            marginTop: '6px',
                        }}>{(masked) ? 'Show information' : 'Hide information'} <Icon type={(masked) ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                    </Col>
                    <Divider style={{ marginBottom: '5px' }} />
                </Row>
                <Modal visible={visible} title="Preferred Number" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <PrefferedContact {...this.props} refreshList={this.handleCancel} />
                </Modal>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} labelAlign='left' onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" style={{ marginTop: 10 }} xs={24} sm={24} md={24} lg={{ span: 22, offset: 1 }} hidden={isBOD}>
                                <Form.Item label="Preferred Number">
                                    <AntdButton type="primary" size="default" htmlType="button" onClick={() => this.handleOpenModalSetup()} >Setup</AntdButton>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 22, offset: 1 }} style={{ padding: (window.innerWidth < 768) ? 0 : '' }}>
                                <Collapse bordered={false} defaultActiveKey={activeKey} activeKey={activeKey} onChange={this.onClickCollapse}>
                                    {
                                        phone.map((obj) => {
                                            return (<Panel header={
                                                <Row>
                                                    <Col xs={24} sm={24} md={24} lg={22} xl={22}>
                                                        {obj.label}
                                                    </Col>
                                                    <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                                                        <Button htmlType="button" type="primary" size="small" label="Create" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal(obj.value)} />
                                                    </Col>
                                                </Row>
                                            } key={obj.value} destroyInactivePanel={true} forceRender={true}>
                                                <ContactTable ref={(e) => { this.componentTableSelect[obj.value] = e }} {...this.props} phonetype={obj.value} masked={masked} />
                                            </Panel>)
                                        })
                                    }
                                </Collapse>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

class PrefferedContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            selectPreffered: null
        }
    }

    componentDidMount() {
        let memberid = this.props.match.params.ID;
        this.getDetail(memberid)
    }

    getDetail = (memberid) => {
        let url = api.url.membercontact.list;
        let data = { memberid, active: true };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                /* sorting asc by preffered number */
                let dataList = result.sort((a, b) => { return a.preferrednumber < b.preferrednumber });
                /* show data phone active and valid */
                dataList = dataList.filter((obj) => obj.active && obj.valid).map((obj, key) => { return ({ number: key + 1, ...obj }) });

                let selectPreffered = dataList.filter((obj) => obj.preferrednumber === true);
                selectPreffered = (selectPreffered && selectPreffered[0]) ? selectPreffered[0]['memberphoneid'] : null;
                this.setState({ dataList, selectPreffered, isLoading: false });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    handlePrefferedAddress = (e, memberphoneid) => {
        this.setState({ selectPreffered: memberphoneid });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { selectPreffered } = this.state;
        let url = api.url.membercontact.setpreferred;
        let data = { memberphoneid: selectPreffered };
        this.setState({ isLoading: true });
        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            let message = 'New data has been updated';
            if (responsecode.substring(0, 1) === '0') {
                message = (responsemessage) ? responsemessage : message;
                Alert.success(message);

                this.props.refreshList();
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            this.setState({ isLoading: false });
        })

    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { dataList, isLoading, selectPreffered } = this.state;

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    <Row style={{ marginBottom: 30 }}>
                        <Table rowKey={record => record.number} dataSource={dataList} size="middle" pagination={false}>
                            <Column title="No" dataIndex="number" key="number" width="10%" />
                            <Column title="Phone Type" dataIndex="phonetype" key="phonetype"
                                render={(value) =>
                                    (value === 'PRIVATEFAX') ? 'Private Fax' :
                                        (value === 'BUSINESSFAX') ? 'Business Fax' :
                                            (value === 'MOBILE') ? 'Mobile' :
                                                (value === 'BUSINESSPHONE') ? 'Business Phone' :
                                                    (value === 'PRIVATEPHONE') ? 'Private Phone' : value
                                }
                            />
                            <Column title="Country Code" dataIndex="countryphonecode" key="countryphonecode" render={(value) => (value) ? value : '-'} />
                            <Column title="Region Code" dataIndex="regioncode" key="regioncode" render={(value) => (value) ? value : '-'} />
                            <Column title="Phone Number" dataIndex="phonenumber" key="phonenumber" />
                            <Column title="Action" dataIndex="action" key="action"
                                render={(_value, row) =>
                                    <span>
                                        <Checkbox checked={selectPreffered === row.memberphoneid} onChange={(e) => this.handlePrefferedAddress(e, row.memberphoneid)} />
                                    </span>
                                }
                            />
                        </Table>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="primary" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={(e) => this.saveAction(e)} />
                    </Row>
                </Spin>
            </React.Fragment>
        )
    }
}

class ContactTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            visible: false,
            titlepage: 'Create',
            memberphoneid: null,
            dataDetail: {}
        }
    }

    componentDidMount() {
        let memberid = this.props.match.params.ID;
        this.getDetail(memberid);
    }

    getDetail = (memberid) => {
        let url = api.url.membercontact.list;
        let data = (isBOD) ? { memberid, preferrednumber: true } : { memberid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let phonetype = this.props.phonetype;
                let dataList = result.filter((obj) => obj.phonetype === phonetype).map((obj, key) => { return ({ number: key + 1, ...obj }) });

                this.setState({ dataList, isLoading: false });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    deleteData(memberphoneid) {
        let url = api.url.membercontact.delete;
        let data = { memberid: null, memberphones: [memberphoneid] };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                this.props.refreshHeader();
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }

            let memberid = this.props.match.params.ID;
            this.getDetail(memberid)
        };

        DeleteRequest(url, data, callback);
    }

    handleOpenModal = (memberphoneid, dataDetail) => {
        this.setState({ visible: true, memberphoneid, dataDetail });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleOk = () => {
        let memberid = this.props.match.params.ID;
        this.setState({ visible: false }, this.getDetail(memberid));
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { menucode, prefixmenuname, phonetype, masked } = this.props;
        const { dataList, isLoading, titlepage, visible, memberphoneid, dataDetail } = this.state;

        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Contact"} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <ContactForm {...this.props} phonetype={phonetype} memberphoneid={memberphoneid} dataDetail={dataDetail} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.number} dataSource={dataList} size="middle" pagination={false} loading={isLoading} scroll={{ y: 480 }}>
                        <Column title="No" dataIndex="number" key="number" width="10%" />
                        {
                            (phonetype !== 'MOBILE')
                                ? <Column title="Region Code" dataIndex="regioncode" key="regioncode" width="20%"
                                    render={(value, row) => row.countryphonecode + "" + value} />
                                : null
                        }
                        {
                            (phonetype !== 'MOBILE')
                                ? <Column title="Phone Number" dataIndex="phonenumber" key="phonenumber"
                                    render={(value, row) => {
                                        const visiblenumber = value.slice(-4);
                                        const maskednumber = '*'.repeat(value.length - 4);

                                        if (masked) {
                                            return maskednumber + visiblenumber;
                                        } else return value;
                                    }} />
                                : <Column title="Phone Number" dataIndex="phonenumber" key="phonenumber"
                                    render={(value, row) => {
                                        const phonenumber = `${row.countryphonecode}${value}`;
                                        const visiblenumber = phonenumber.slice(-4);
                                        const maskednumber = '*'.repeat(phonenumber.length - 4);

                                        if (masked) {
                                            return maskednumber + visiblenumber;
                                        } else return `${row.countryphonecode}${value}`;
                                    }} />
                        }
                        {
                            (phonetype !== 'MOBILE') ? <Column title="Extension" dataIndex="extension" key="extension" width="10%" render={(value) => (value) ? value : '-'} /> : null
                        }
                        <Column title="Valid" dataIndex="valid" key="valid" width="10%"
                            render={(value) => (value) ? <Icon type="check" /> : <Icon type="close" />}
                        />
                        <Column title="Active" dataIndex="active" key="active" width="10%"
                            render={(value) => (value) ? "Active" : 'Inactive'}
                        />
                        <Column title="Action" dataIndex="action" key="action" width="20%"
                            render={(_value, row) =>
                                <span>
                                    <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.memberphoneid, row)} />
                                    <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.memberphoneid)} />
                                </span>
                            }
                        />
                    </Table >
                </Row >
            </React.Fragment >
        )
    }
}

export default Layout;