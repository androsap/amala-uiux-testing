import React from 'react';
import { api } from '../../../config/Services';
import { SaveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Checkbox, Modal, Icon } from 'antd';
import AddressForm from './Form';
import { getProfile } from '../../../utilities/AuthService';
import { Link } from 'react-router-dom';

const { confirm } = Modal;
const { Title, Text } = Typography;
const optionsAddressType = [
    { value: 'BUSINESS', label: 'BUSINESS' },
    { value: 'PRIVATE', label: 'PRIVATE' }
];

const isBOD = getProfile().rolename === 'BOD';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            memberaddressid: null,
            selectPreffered: null,
            titlepage: 'Create',
            masked: true
        }
    }

    componentDidMount() {
        document.title = "Member Address | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handlePreferred = (memberaddressid) => {
        const callback = () => {
            let data = { memberaddressid };
            let url = api.url.memberaddress.setpreferred;
            let message = 'New data has been updated';
            SaveRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);

                    this.componentTable.getList();
                    this.props.refreshHeader();
                } else {
                    Alert.error(responsemessage);
                }
                //hide loader
                this.setState({ isLoading: false });
            })
        }
        confirm({
            title: 'Are you sure you want to make this address your primary address? You can only choose one primary address.',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });

    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleOpenModal = (memberaddressid) => {
        this.setState({ visible: true, memberaddressid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    };

    deleteData(memberaddressid) {
        let url = api.url.memberaddress.delete;
        let data = { memberaddressid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    };

    handleMasking = () => {
        this.setState({ masked: !this.state.masked });
    };


    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, isLoading, memberaddressid, titlepage, masked } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.memberaddress.list,
            criteria: (isBOD) ? { memberid, active: true, ispreffered: true } : { memberid, active: true },
            sort: { ispreffered: 'desc' },
            columns: [
                { type: 'field', title: 'Type', dataIndex: 'addresstype', sorter: true },
                {
                    type: 'html', title: 'Address', dataIndex: 'address', sorter: true,
                    render: (_value, row) => {
                        return (
                            <span>
                                {(row.addresstype === 'BUSINESS' && row.companyname) ? <Text strong>{(masked) ? row.companyname.split(' ').map(word => word.slice(0, 2) + '*'.repeat(word.length - 2)).join(' ') : row.companyname}<br /></Text> : ''}
                                {(row.address) ? (masked) ? row.address.split(' ').map(word => word.slice(0, 2) + '*'.repeat(word.length - 2)).join(' ') : row.address : ''}
                            </span>
                        )
                    }
                },
                {
                    type: 'html', title: 'Area', dataIndex: 'area', sorter: false,
                    render: (_value, row) => {
                        return (row.countryname + ", " + row.statename + ", " + row.cityname)
                    }
                },
                {
                    type: 'html', title: 'Preferred Address', dataIndex: 'ispreffered', sorter: true, align: 'center',
                    render: (_value, row) => {
                        let selectPreffered = (this.state.selectPreffered !== null) ? this.state.selectPreffered : (row.ispreffered) ? row.memberaddressid : null;
                        return (
                            (isBOD) ? <Icon type="check" /> :
                                <Checkbox checked={selectPreffered === row.memberaddressid} onClick={() => this.handlePreferred(row.memberaddressid)} disabled={isBOD} />
                        )
                    }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', hidden: isBOD,
                    render: (_value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.memberaddressid)} />
                                {
                                    (!row.ispreffered) ?
                                        <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.memberaddressid)} /> : null
                                }
                            </span>
                        )
                    }
                },
            ].filter(item => !item.hidden)
        };

        const configurationSearchForm = [
            { labeltext: "Address Type", datafield: "addresstype", type: 'select', placeholder: 'Address Type', options: optionsAddressType, showDefaultSearch: true },
            { labeltext: "Address", datafield: "address", type: 'text', placeholder: 'Address', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Address"} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <AddressForm memberid={memberid} memberaddressid={memberaddressid} onClose={this.handleCancel} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={18}>
                        <Title level={4}>Manage Address</Title>
                    </Col>
                    <Col xs={24} sm={6} align="right" style={{ textAlign: "right" }}>
                        <Link to="#" onClick={this.handleMasking} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#717171',
                            textDecoration: 'none',
                            marginRight: '16px'
                        }}>{(masked) ? 'Show information' : 'Hide information'} <Icon type={(masked) ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                        <Button htmlType="button" type="primary" size="default" label="Create" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal()} />
                    </Col>

                    <Divider />
                </Row>
                {(!isBOD) ? <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} /> : null}
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);