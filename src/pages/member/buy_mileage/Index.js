/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-26 21:17:21
 * @modify date 2020-08-11 11:09:08
 * @desc Member Buy Mileage Transaction List
 */
import React from 'react';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, Alert, CurrencySelect } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin, Alert as AntAlert, Menu, Dropdown, Icon, Button as AntButton } from 'antd';
import { jsUcfirst, formatNumber } from '../../../utilities/Helpers';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { MemberLockAlert } from '../../../components/Partials';
import { MileageType, PaymentType, StatusBuyMileage, AllPaymentMethod } from '../../../data';
import { Link } from 'react-router-dom';
import moment from 'moment';

import ConfirmationForm from './Confirmation';
import BuyMileageHistory from './History';
import ConfirmationExpiredForm from './expired/Confirmation';

const { Title } = Typography;
const { confirm } = Modal;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseMessage: '',
            showconfirmation: false,
            memberbuymileageid: null,
            buymileagedetail: {},
            showmemberbuylimit: false,
            fieldvalue: {
                mileagetype: null,
                buymileagelimicheck: {
                    startdate: null,
                    enddate: null,
                    allowedmileage: null,
                    totalmileage: null,
                }
            }
        }

        this.handleOpenConfirmationModal = this.handleOpenConfirmationModal.bind(this);
        this.handleOpenBuyMileageLimitModal = this.handleOpenBuyMileageLimitModal.bind(this);
    };

    componentDidMount() {
        document.title = 'Member Buy Mileage | Loyalty Management System';
        this.getMemberBuyLimit();
    };

    getMemberBuyLimit = () => {
        const memberid = this.props.match.params.ID;
        const url = api.url.memberbuymileagelimit.check;
        const data = { memberid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode } = status;
            if (responsecode.substring(0, 1) === '0' && result) {
                const startdate = (result.startdate) ? result.startdate : null;
                const enddate = (result.enddate) ? result.enddate : null;
                const totalmileage = (result.totalmileage !== undefined && result.totalmileage !== null) ? result.totalmileage : null;
                const allowedmileage = (result.allowedmileage !== undefined && result.allowedmileage !== null) ? result.allowedmileage : null;

                const buymileagelimicheck = { ...this.state.fieldvalue.buymileagelimicheck, startdate, enddate, totalmileage, allowedmileage };
                const fieldvalue = { ...this.state.fieldvalue, buymileagelimicheck };
                this.setState({ fieldvalue });
            }
        });
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.props.form.validateFieldsAndScroll((err) => {
            if (!err) {
                this.componentTable.handleSearchForm(criteria, criteriadata);
            }
        })
    };

    handleOpenConfirmationModal = (memberbuymileageid, buymileagedetail, mileagetype) => {
        this.setState({ showconfirmation: true, memberbuymileageid, buymileagedetail, fieldvalue: { ...this.state.fieldvalue, mileagetype } });
    };

    handleCloseModal = async () => {
        await this.setState({ showconfirmation: false, showmemberbuylimit: false });
        await this.componentTable.getList();
    };

    handleOpenBuyMileageLimitModal = () => {
        this.setState({ showmemberbuylimit: true });
    };

    handleCancelBuy = (memberbuymileageid) => {
        const callback = () => {
            this.setState({ isLoading: true });
            SaveRequest(api.url.memberbuymileage.cancel, { memberbuymileageid }).then(async (response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode === '0000') {
                    Alert.success((responsemessage) ? responsemessage : 'This buy mileage has beeen cancel');
                    await this.componentTable.getList();
                    await this.getMemberBuyLimit();
                } else Alert.error(responsemessage);
                await this.setState({ isLoading: false });
            });
        };

        confirm({
            title: 'Are you sure cancel this Buy Mileage ?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    handleChangeDate = (val, type) => {
        if (type === 'minStartBuy') {
            this.props.form.resetFields(['buydateto', []]);
        } else this.props.form.resetFields(['cancelleddateto', []]);

        this.setState({ [type]: moment(val) });
    }

    render() {
        const { showconfirmation, memberbuymileageid, isLoading, buymileagedetail, showmemberbuylimit, fieldvalue, minStartBuy, minStartCancel } = this.state;
        const { buymileagelimicheck, mileagetype } = fieldvalue;
        const { profile, permission, memberlock } = this.props;
        const { blockaccrual } = memberlock || {};

        const memberid = this.props.match.params.ID;
        const primaryemail = (profile && profile.email) ? profile.email : null;
        const buydatefielddisabled = this.props.form.getFieldValue('buydatefrom') ? false : true;
        const cancelfielddisabled = this.props.form.getFieldValue('cancelleddatefrom') ? false : true;
        const configurationTable = {
            url: api.url.memberbuymileage.list,
            criteria: { memberid },
            sort: { buydate: 'desc' },
            columnClassName: 'nowrap',
            columns: [
                {
                    type: 'field', title: 'Buy Date', dataIndex: 'buydate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Buy Mileage Type', dataIndex: 'mileagetype', sorter: true,
                    render: (value, row, index) => { return (value) ? ((value === 'EXPIRED') ? 'Buy to Extend Mileage' : 'Buy Mileage') : '-' }
                },
                {
                    type: 'field', title: 'Payment Type', dataIndex: 'paymenttype', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Payment Method', dataIndex: 'paymentmethod', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Currency Code', dataIndex: 'currencycode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },

                {
                    type: 'field', title: 'Total Mileage', dataIndex: 'totalmileage', sorter: true,
                    render: (value, row, index) => { return (value !== undefined && value !== null) ? formatNumber(value) : '-' }
                },
                {
                    type: 'field', title: 'Package Mileage', dataIndex: 'packagemileage', sorter: true,
                    render: (value, row, index) => { return (value !== undefined && value !== null) ? formatNumber(value) : '-' }
                },
                {
                    type: 'field', title: 'Total Amount', dataIndex: 'totalamount', sorter: true,
                    render: (value, row, index) => {
                        return (value !== undefined && value !== null) ? ((row.mileagetype === 'AWARDMILES') ? `${row.currencycode}  ${formatNumber(value)}` :
                            ((row.paymenttype === 'CASH') ? `${row.currencycode}  ${formatNumber(value)}` : ((row.paymenttype === 'MILEAGE') ? `${formatNumber(value)} Miles` : formatNumber(value)))) : '-'
                    }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
                {
                    type: 'field', title: 'Approval By', dataIndex: 'approvalby', sorter: false,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Request ID', dataIndex: 'requestid', sorter: false,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Request By', dataIndex: 'requestedby', sorter: false,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cancelled By', dataIndex: 'cancelledby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cancelled Date', dataIndex: 'cancelleddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {
                                    (row.status === 'WAITING_FOR_PAYMENT' && !blockaccrual) ? <Button size="small" type='primary' title="Confirm" htmlType="button" icon='check' onClick={() => this.handleOpenConfirmationModal(row.memberbuymileageid, row, row.mileagetype)} /> : null
                                }
                                <Button size="small" title="View" icon='eye' url={(row.buymileagecatalog.mileagetype === 'EXPIRED') ? `${this.props.match.url}/form-expired-buy/${row.memberbuymileageid}` : `${this.props.match.url}/form/${row.memberbuymileageid}`} />
                                {
                                    ((row.status === 'SUCCESS' || row.status === 'WAITING_FOR_PAYMENT' || row.status === 'REQUESTED') && row.mileagetype === 'AWARDMILES' && (permission && permission.usermenu !== undefined && permission.usermenu["MBBUYMIL"]["MBBUYMIL_CNC"])) ?
                                        <Button htmlType="button" size="small" title="Cancel" type="danger" icon='close-circle' onClick={() => this.handleCancelBuy(row.memberbuymileageid)} /> : null
                                }
                            </span>
                        )
                    }
                }
            ]
        };
        const configurationSearchForm = [
            { labeltext: 'Buy Mileage Type', datafield: 'mileagetype', type: 'select', placeholder: 'Buy Mileage Type', options: MileageType, showDefaultSearch: true },
            { labeltext: 'Payment Type', datafield: 'paymenttype', type: 'select', placeholder: 'Payment Type', options: PaymentType, showDefaultSearch: true },
            { labeltext: 'Start Buy Date', datafield: 'buydatefrom', type: 'datepicker', placeholder: 'Start Buy Date', showDefaultSearch: false, onChange: (val) => this.handleChangeDate(val, 'minStartBuy'), specialSearch: true },
            { labeltext: 'End Buy Date', datafield: 'buydateto', type: 'datepicker', placeholder: 'End Buy Date', showDefaultSearch: false, disabled: buydatefielddisabled, minDate: minStartBuy, validationrules: ((buydatefielddisabled) ? [] : ['required']), specialSearch: true },
            { labeltext: 'Start Cancel Date', datafield: 'cancelleddatefrom', type: 'datepicker', placeholder: 'End Cancel Date', showDefaultSearch: false, onChange: (val) => this.handleChangeDate(val, 'minStartCancel'), specialSearch: true },
            { labeltext: 'End Cancel Date', datafield: 'cancelleddateto', type: 'datepicker', placeholder: 'End Cancel Date', showDefaultSearch: false, disabled: cancelfielddisabled, minDate: minStartCancel, validationrules: ((cancelfielddisabled) ? [] : ['required']), specialSearch: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', options: StatusBuyMileage, showDefaultSearch: true },
            { labeltext: 'Payment Method', datafield: 'paymentmethod', type: 'select', placeholder: 'Payment Method', options: AllPaymentMethod, showDefaultSearch: false },
            { labeltext: 'Currency Code', datafield: 'currencycode', type: 'component', placeholder: 'Currency Code', showDefaultSearch: false, component: CurrencySelect },
            { labeltext: 'Approval By', datafield: 'approvalby', type: 'text', placeholder: 'Approval By', showDefaultSearch: true },
            { labeltext: 'Request By', datafield: 'requestedby', type: 'text', placeholder: 'Request By', showDefaultSearch: false },
            { labeltext: 'Created By', datafield: 'createdBy', type: 'text', placeholder: 'Created By', showDefaultSearch: false },
            { labeltext: 'Cancelled By', datafield: 'cancelledby', type: 'text', placeholder: 'Cancelled By', showDefaultSearch: false },
        ];

        const totalmileage = (buymileagelimicheck.totalmileage !== null && buymileagelimicheck.totalmileage !== undefined) ? buymileagelimicheck.totalmileage : null;
        const allowedmileage = (buymileagelimicheck.allowedmileage !== null && buymileagelimicheck.allowedmileage !== undefined) ? buymileagelimicheck.allowedmileage : null;
        const remainingmileage = ((totalmileage !== null && totalmileage !== undefined) && (allowedmileage !== undefined && allowedmileage !== null)) ? allowedmileage - totalmileage : null;
        const menu = (
            <Menu>
                {(permission && permission.usermenu !== undefined && permission.usermenu['MBBUYMIL']['MBBUYMIL_BUY']) ?
                    <Menu.Item key='/form'>
                        <Link to={this.props.match.url + '/form'}> Buy Mileage </Link>
                    </Menu.Item> : null}
                {(permission && permission.usermenu !== undefined && permission.usermenu['MBBUYMIL']['MBBUYMILE_BUYEM']) ?
                    <Menu.Item key='/form-expired'>
                        <Link to={this.props.match.url + '/form-expired'}> Buy to Extend Mileage </Link>
                    </Menu.Item> : null}
            </Menu>
        );

        return (
            <React.Fragment>
                <Modal visible={showconfirmation} title='Confirmation' loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={700}>
                    {mileagetype === 'AWARDMILES' ? <ConfirmationForm {...this.props} memberid={memberid} memberbuymileageid={memberbuymileageid} primaryemail={primaryemail} buymileagedetail={buymileagedetail} actionsconfirmationpage='confirmation' onClose={this.handleCloseModal} /> :
                        <ConfirmationExpiredForm {...this.props} actionsconfirmationpage={'confirmTable'} memberid={memberid} memberbuymileageid={memberbuymileageid} memberbuymileagedetail={buymileagedetail} onClose={this.handleCloseModal} primaryemail={primaryemail} actionspage={'view'} />}
                </Modal>
                <Modal visible={showmemberbuylimit} title='Member Buy Limit' loading={isLoading} onCancel={this.handleCloseModal} footer={null} destroyOnClose={true} width={700}>
                    <BuyMileageHistory {...this.props} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Member Buy Mileage</Title>
                    </Col>
                    <Col xs={24} sm={4} align='right'>
                        {(permission && permission.usermenu !== undefined && (permission.usermenu['MBBUYMIL']['MBBUYMIL_BUY'] || permission.usermenu['MBBUYMIL']['MBBUYMILE_BUYEM'])) ?
                            <Dropdown overlay={menu}>
                                <AntButton type='primary'>
                                    Buy <Icon type='down' />
                                </AntButton >
                            </Dropdown> : null}
                    </Col>
                    <Divider />
                    {
                        (buymileagelimicheck.startdate && buymileagelimicheck.enddate) ?
                            <AntAlert
                                message={(allowedmileage !== null || allowedmileage !== undefined) ? `Buy Mileage Limit information ( Maximum ${formatNumber(allowedmileage)} miles per year )` : `Buy Mileage Limit information`}
                                description={
                                    <span>
                                        This member had purchased <b>{(totalmileage !== undefined && totalmileage !== null) ? formatNumber(totalmileage) : '-'} </b>miles.
                                        Remaining mileage allowed to purchase from&nbsp;
                                        {(buymileagelimicheck.startdate !== undefined && buymileagelimicheck.startdate !== null) ? moment(buymileagelimicheck.startdate).format('DD/MM/YYYY') : '-'}
                                        &nbsp;to&nbsp;
                                        {(buymileagelimicheck.enddate !== undefined && buymileagelimicheck.enddate !== null) ? moment(buymileagelimicheck.enddate).format('DD/MM/YYYY') : '-'}
                                        &nbsp;is <b>{(remainingmileage !== undefined && remainingmileage !== null) ? formatNumber(remainingmileage) : '-'}</b> miles.
                                        <br /><a onClick={this.handleOpenBuyMileageLimitModal}>Click here to view limit history</a>
                                    </span>
                                }
                                type="info"
                                icon={<Icon type="info-circle" style={{ marginTop: 5 }} />}
                                showIcon
                                style={{ marginBottom: '10px' }}
                            /> : null
                    }
                    {(blockaccrual) ? <MemberLockAlert memberlock={memberlock} /> : ''}
                </Row>
                <Spin spinning={isLoading}>
                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
