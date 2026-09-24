import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest, DeleteRequest, SaveRequest } from '../../../utilities/RequestService';
import { Button, Alert, SearchForm, TableBase, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin } from 'antd';
import { connect } from "react-redux";
import moment from 'moment';
import History from './History';
import PreviewDelete from './Delete';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleHistory: false,
            visibleDelete: false,
            visible: false,
            isLoading: false,
            fieldvalue: {
                memberid: props.match.params.ID
            }
        }
    }

    componentDidMount() {
        const { memberid } = this.state.fieldvalue;
        document.title = "Member Redemption Nominee | Loyalty Management System";
        this.getCountNominee(memberid);
    }

    getCountNominee(memberid) {
        const { fieldvalue } = this.state;
        let url = api.url.memberredemptionnominee.getcountnominee;
        let data = { memberid };
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                let maxcount = result.maxcount;
                this.setState({
                    fieldvalue: { ...fieldvalue, maxcount },
                    loading: false
                });
            } else this.setState({ responseCode: responsecode, responseMessage: responsemessage, formrender: false });
        });
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(redemptionnomineecode) {
        let url = api.url.memberredemptionnominee.delete;
        let data = { redemptionnomineecode };
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
    }

    handleOpenModal = (id, firstname, lastname, membersince, type, awardmiles) => {
        if (id) this.setState({ visibleDelete: true, fieldvalue: { ...this.state.fieldvalue, redemptionnomineecode: id, firstname, lastname, membersince, type, awardmiles } });
        else this.setState({ visibleHistory: true });
    };

    handleCancel = () => {
        this.setState({ visibleHistory: false, visibleDelete: false });
    };

    handleOk = () => {
        const { memberid } = this.state.fieldvalue;
        this.setState({ visibleHistory: false, visibleDelete: false },
            this.getCountNominee(memberid),
            this.componentTable.getList())
    };

    resendData = (redemptionnomineecode) => {
        const callback = () => {
            let url = api.url.memberredemptionnominee.resend;
            let data = { redemptionnomineecode };
            let message = 'Resending Email Verification...';
            DetailRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode === '0000') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
                this.componentTable.getList();
            });
        }
        confirm({
            title: 'Are you sure to resend email verification?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        const { menucode, prefixmenuname, form } = this.props;
        const tiername = this.props.profile.membertiers.tiername
        const { visibleHistory, visibleDelete, totalNominee } = this.state;
        const { memberid, redemptionnomineecode, firstname, lastname, membersince, type, maxcount } = this.state.fieldvalue;
        const awardmiles = this.props.profile.awardmiles;
        console.log(totalNominee)

        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Last Name", datafield: "lastname", type: 'text', placeholder: 'Last Name', showDefaultSearch: true },
            { labeltext: "Date of Birth", datafield: "dateofbirth", type: 'datepicker', placeholder: 'Date of Birth', showDefaultSearch: false },
            { labeltext: "Registered Since", datafield: "membersince", type: 'datepicker', placeholder: 'Registered Since', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.memberredemptionnominee.list,
            criteria: { memberid },
            criteriadata: {
                multiplestatus: [
                    {
                        active: true,
                        approvalstatus: 'APPROVED'
                    },
                    {
                        active: false,
                        approvalstatus: 'WAITING_VERIFICATION'
                    }
                ]
            },
            columns: [
                {
                    type: 'html', title: 'Nominee Type', dataIndex: 'nomineetype', sorter: true,
                    render: (value) => { return (value === 'MEMBER') ? "Member GarudaMiles" : value === 'NONMEMBER' ? "Non-Member GarudaMiles" : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Salutation', dataIndex: 'salutationcode', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                {
                    type: 'html', title: 'Last Name', dataIndex: 'lastname', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Date of Birth', dataIndex: 'dateofbirth', sorter: true,
                    render: (value) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Registered Since', dataIndex: 'membersince', sorter: true,
                    render: (value) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Approval Status', dataIndex: 'approvalstatus', sorter: true,
                    render: (value) => { return value ? value.replace(/_/g, ' ') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Button className={row.approvalstatus === 'APPROVED' && moment().diff(moment(row.membersince), 'months') >= 6 ? '' : 'hidden'} htmlType="button" size="small" label="Delete" style={{ fontSize: "14px" }} type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.handleOpenModal(row.redemptionnomineecode, row.firstname, row.lastname, row.membersince, 'delete', awardmiles)} />
                                <Button className={row.approvalstatus === 'APPROVED' && moment().diff(moment(row.membersince), 'months') <= 6 ? '' : 'hidden'} htmlType="button" size="small" label="Force Delete" style={{ fontSize: "11px", width: "60px", whiteSpace: 'normal', lineHeight: '1' }} type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="FRCDELETE" onClick={() => this.handleOpenModal(row.redemptionnomineecode, row.firstname, row.lastname, row.membersince, 'force', awardmiles)} />
                                <Button className={row.approvalstatus === 'WAITING_VERIFICATION' ? '' : 'hidden'} htmlType="button" size="small" label="Resend Verification" style={{ fontSize: "11px", width: "70px", whiteSpace: 'normal', lineHeight: '1' }} type="primary" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="RSNDMAIL" onClick={() => this.resendData(row.redemptionnomineecode)} />
                            </div>
                        );
                    }
                }

            ]
        };
        return (
            <React.Fragment>
                <Modal visible={visibleHistory} title="Deleted Nominee History" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    <History memberid={memberid} handleOk={this.handleOk} />
                </Modal>
                <Modal visible={visibleDelete} onCancel={this.handleCancel} footer={null} destroyOnClose={true} style={{ top: 20 }} width={1000} closable={false} maskClosable={false} keyboard={false}>
                    <PreviewDelete form={form} memberid={memberid} id={redemptionnomineecode} handleOk={this.handleOk} handleCancel={this.handleCancel} firstname={firstname} lastname={lastname} tiername={tiername} membersince={membersince} type={type} awardmiles={awardmiles} />
                </Modal>
                <Row>
                    <Col xs={24} xl={16}>
                        <Title level={4}>Manage Nominee</Title>
                    </Col>
                    <Col xs={24} xl={8} align="right">
                        <Button htmlType="button" size="default" className="btn-custom-dark-blue" label="Deleted Nominee History" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" onClick={() => this.handleOpenModal()} />
                        {
                            (totalNominee < maxcount) ?
                                <Button type="primary" url={this.props.match.url + '/form'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                                : ''
                        }
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} afterRequest={(response) => {
                    const total = response?.paging?.totalrecord || 0;
                    this.setState({ totalNominee: total });
                }} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));