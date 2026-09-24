
import React from 'react';
import { api } from '../../../../config/Services';
import { Form, Row, Col, Button, Spin, Divider, Typography, Checkbox, Modal } from 'antd';
import moment from 'moment';
import { InputText, Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { formatNumber, jsUcfirst } from '../../../../utilities/Helpers';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membercardOri: [],
            membercardDes: [],
            isLoading: false,
            isConfirmed: false,
            saveTransaction: false,
            paymentreference: ''
        }
    };

    componentDidMount() {
        document.title = 'Member Redemption Nominee | Loyalty Management System';
    };

    handleMenuCallback = (type) => {
        const { paymentreference } = this.state;

        if (type === "next") {
            this.props.handleMenuCallback({
                choosen: 'complete',
                current: 3,
                paymentreference
            });
        }

        if (type === "back") {
            this.props.handleMenuCallback({
                choosen: 'deletion-charges',
                current: 1
            });
        }
    };

    getInitials = (name) => {
        return name
            .split(" ")
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase();
    };

    handleCheckboxChange = e => {
        this.setState({ isConfirmed: e.target.checked });
    };

    deleteData = () => {
        const { form, id, type, selectedCurrency, selectedOption } = this.props;
        const { paymentreference } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                confirm({
                    title: 'Are you sure to delete this member?',
                    onOk: () => {
                        this.setState({ isLoading: true });
                        let url = type === "force" ? api.url.memberredemptionnominee.force : api.url.memberredemptionnominee.delete;
                        let data = {
                            redemptionnomineecode: id,
                            remarks: values.remarks || null,
                            currencycode: selectedCurrency && selectedOption === "CASH" ? selectedCurrency : null,
                            paymentmethod: selectedOption || null,
                            paymentreference: paymentreference || null
                        };
                        DetailRequest(url, data).then((response) => {
                            const { status = {} } = response;
                            const { responsecode, responsemessage } = status;

                            if (responsecode === '0000') {
                                Alert.success(responsemessage);
                                this.handleMenuCallback('next');
                            } else {
                                Alert.error(responsemessage);
                            }
                            this.setState({ isLoading: false });
                        });
                    },
                    onCancel() { }
                });
            }
        });
    };

    handleSaveTransaction = () => {
        const paymentreference = this.props.form.getFieldValue('paymentreference') || '';
        this.setState({
            saveTransaction: true, paymentreference
        });
    };

    render() {
        const { isLoading, saveTransaction } = this.state;
        const { changefee } = this.props;
        const paymentreference = this.props.form.getFieldValue('paymentreference') || "";
        const charCount = paymentreference.length;

        const capitalizeWords = (str) => {
            if (!str) {
                return "";
            }
        
            return str
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title style={{ fontSize: "18px" }}>Transaction Code Confirmation</Title>
                    </Col>
                    <Spin spinning={isLoading}>
                        {!saveTransaction ?
                            <>
                                {this.props.selectedOption === "MILES" ?
                                    <>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: -10 }}>
                                                        <div
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                borderRadius: "50%",
                                                                background: "#FFDDF7",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "16px",
                                                                fontWeight: "bold",
                                                                marginRight: "20px",
                                                            }}
                                                        >
                                                            {this.getInitials(this.props.firstname + " " + this.props.lastname)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: "16px", fontWeight: 600 }}> {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} </div>
                                                            <div style={{ color: "#666" }}> Nominee to be deleted </div>
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    <div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -10 }}>
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Tier </div>
                                                            <div style={{ fontWeight: 600 }}> {this.props.tiername} </div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Total Payment </div>
                                                            <div style={{ fontWeight: 600, color: "#EC5B56" }}> {changefee ? formatNumber(changefee) : 0} Miles</div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Payment Method </div>
                                                            <div style={{ fontWeight: 600 }}> Miles </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <InputText labeltext="Remarks" datafield="remarks" form={this.props.form} placeholder="Insert Remarks / Notes" />
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <div
                                                    style={{
                                                        boxSizing: "border-box",
                                                        width: "100%",
                                                        background: "#FFFFFF",
                                                        border: "1px solid #ADACAC",
                                                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                                        borderRadius: "10px",
                                                        padding: "10px 20px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={this.state.isConfirmed}
                                                        onChange={this.handleCheckboxChange}
                                                        style={{ fontSize: "12px" }}>
                                                        I understand that this deletion <b>cannot be undone</b> and the nominee will immediately lose access to the benefits.
                                                    </Checkbox>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={24} style={{ marginTop: 20 }}>
                                            <Col span={24}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "15px",
                                                        background: "#F9ECEB",
                                                        borderLeft: "10px solid #EC5B56",
                                                        borderRadius: "0px 10px 10px 0px",
                                                        padding: "20px 24px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#EC5B56" }}>
                                                        <b>Warning:</b> Once confirmed, your miles will be deducted immediately and {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} will be deleted from your nominee list.
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                    :
                                    <>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                                    <div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -20 }}>
                                                            <div style={{ fontSize: "14px", fontWeight: 400, marginTop: 10 }}> Nominee </div>
                                                            <div style={{ fontSize: "14px", fontWeight: 600 }}> {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} </div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Total Payment </div>
                                                            <div style={{ fontWeight: 600, color: "#EC5B56" }}> {this.props.selectedCurrency === "IDR" ? "Rp" : "$"}{changefee ? formatNumber(changefee) : 0} </div>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Payment Method </div>
                                                            <div style={{ fontWeight: 600 }}> Cash / External Transfer </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={24} style={{ marginTop: 20 }}>
                                            <Col span={24}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "15px",
                                                        background: "#E9F6FD",
                                                        borderLeft: "10px solid #4C80CA",
                                                        borderRadius: "0px 10px 10px 0px",
                                                        padding: "20px 24px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#4C80CA" }}>
                                                        Complete the payment of <b>{this.props.selectedCurrency === "IDR" ? "Rp" : "$"}{changefee ? formatNumber(changefee) : 0}</b> via bank, e-wallet, or the nearest cash outlet.
                                                        Once successful, enter the <b>transaction code</b> provided by the payment provider.
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <InputText labeltext="Transaction Code from Payment Provider" datafield="paymentreference" form={this.props.form} placeholder="EXAMPLE: TRF - XXXXX" maxLength={20} />
                                            </Col>
                                            <Col span={20}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', color: paymentreference ? 'green' : null, fontWeight: 600, fontSize: "12px" }} >
                                                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: paymentreference ? 'green' : '#595959', marginRight: 8 }} /> Enter Your Transaction Code
                                                </span>
                                            </Col>
                                            <Col span={4} style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: 14, fontWeight: 600, fontSize: "12px" }}> {charCount}/20 </span>
                                            </Col>
                                        </Row>
                                        <Row gutter={24} style={{ marginTop: 20 }}>
                                            <Col span={24}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "15px",
                                                        background: "#F8EEDC",
                                                        borderLeft: "10px solid #E3A344",
                                                        borderRadius: "0px 10px 10px 0px",
                                                        padding: "20px 24px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#E3A344" }}>
                                                        The transaction code is usually found on your <b>receipt, SMS/email notification,</b> or in your <b>payment app transaction</b> history.
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                }
                                <Row gutter={24} style={{ marginTop: 20 }}>
                                    <Col span={24}>
                                        {this.props.selectedOption === "CASH" ?
                                            <Button type="default" style={{ width: "100%" }} onClick={() => this.handleSaveTransaction()} disabled={!paymentreference}> Save Transaction Code </Button>
                                            :
                                            <Button type="default" style={{ width: "100%" }} onClick={() => this.deleteData()} disabled={!this.state.isConfirmed}> Confirm and Delete Now </Button>
                                        }
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 5 }}>
                                    <Col span={24}>
                                        <Button type="default" style={{ width: "100%" }} onClick={() => this.handleMenuCallback("back")} > Back </Button>
                                    </Col>
                                </Row>
                            </>

                            :
                            <>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: -10 }}>
                                                <div
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        background: "#FFDDF7",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        marginRight: "20px",
                                                    }}
                                                >
                                                    {this.getInitials(this.props.firstname + " " + this.props.lastname)}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "16px", fontWeight: 600 }}> {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} </div>
                                                    <div style={{ color: "#666" }}> Nominee to be deleted </div>
                                                </div>
                                            </div>
                                            <Divider />
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -20 }}>
                                                    <div style={{ fontSize: "14px", fontWeight: 600 }}> Tier </div>
                                                    <div style={{ fontWeight: 600 }}> {this.props.tiername} </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                    <div style={{ fontSize: "14px", fontWeight: 600 }}> Payment Method </div>
                                                    <div style={{ fontWeight: 600 }}> {jsUcfirst(this.props.selectedOption)} </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: -10 }} >
                                                    <div style={{ fontSize: "14px", fontWeight: 600 }}> Transaction Code </div>
                                                    <div style={{ fontWeight: 600, color: "#4C80CA" }}>{this.state.paymentreference}</div>
                                                </div>
                                                <Divider />
                                                <div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -15 }} >
                                                        <div style={{ fontSize: "14px", fontWeight: 600 }}> Total Paid </div>
                                                        <div style={{ fontWeight: 600, color: "#EC5B56" }}> {this.props.selectedCurrency === "IDR" ? "Rp" : "$"}{changefee ? formatNumber(changefee) : 0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 20 }}>
                                    <Col span={24}>
                                        <div
                                            style={{
                                                boxSizing: "border-box",
                                                width: "100%",
                                                background: "#FFFFFF",
                                                border: "1px solid #ADACAC",
                                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                                borderRadius: "10px",
                                                padding: "10px 20px",
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Checkbox
                                                checked={this.state.isConfirmed}
                                                onChange={this.handleCheckboxChange}
                                                style={{ fontSize: "12px" }}>
                                                I understand that this deletion <b>cannot be undone</b> and the nominee will immediately lose access to the benefits.
                                            </Checkbox>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 20 }}>
                                    <Col span={24}>
                                        <Button type="default" style={{ width: "100%" }} onClick={() => this.deleteData()} disabled={!this.state.isConfirmed}> Confirm and Delete Now </Button>
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 5 }}>
                                    <Col span={24}>
                                        <Button type="default" style={{ width: "100%" }} onClick={() => this.handleMenuCallback("back")} > Back </Button>
                                    </Col>
                                </Row>
                            </>
                        }
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);