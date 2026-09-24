
import React from 'react';
import { Form, Row, Col, Button, Modal, Spin, Divider, Typography, Radio } from 'antd';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { formatNumber } from '../../../../utilities/Helpers';
import moment from 'moment';
import { Alert } from '../../../../components/Base/BaseComponent';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membercardOri: [],
            membercardDes: [],
            isLoading: false,
            selectedOption: "MILES",
            selectedCurrency: "IDR"
        }
    };

    componentDidMount() {
        document.title = 'Member Redemption Nominee | Loyalty Management System';
        this.getChangePrice()
    };

    getChangePrice() {
        const { selectedCurrency, selectedOption } = this.state;
        let url = api.url.memberredemptionnominee.getChangePrice;
        let data = { memberid: this.props.memberid, paymentmethod: selectedOption };
        if (selectedCurrency === "IDR" && selectedOption === "CASH") { data.currencycode = "IDR" }
        if (selectedCurrency === "USD" && selectedOption === "CASH") { data.currencycode = "USD" }
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                let changefee = result.changefee;
                this.setState({ changefee, isLoading: false });
            } else {
                Modal.warning({
                    title: 'Warning Message',
                    content: `Redemption nominee fee data for tier ${this.props.tiername} was not found or is inactive.`,
                    onOk: () => {
                        this.props.handleOk();
                    },
                    maskClosable: false,
                    keyboard: false
                });
                this.setState({ responseCode: responsecode, responseMessage: responsemessage, formrender: false });
            }
        });
    }

    getInitials = (name) => {
        return name
            .split(" ")
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase();
    };

    handleOptionChange = e => {
        this.setState(
            { selectedOption: e.target.value },
            this.getChangePrice
        );
    };

    handleCurrencyChange = e => {
        this.setState(
            { selectedCurrency: e.target.value },
            this.getChangePrice
        );
    };

    handleMenuCallback = (type) => {
        const { selectedOption, changefee, selectedCurrency } = this.state;
        const membersince = this.props.membersince;
        if (type === "next") this.props.handleMenuCallback({ choosen: 'confirmation', current: 2, selectedOption, changefee, selectedCurrency });
        if (type === "back") {
            return moment().diff(moment(membersince), 'months') <= 6
                ? this.props.onCancel()
                : this.props.handleMenuCallback({ choosen: 'validation', current: 0 });
        }
    };

    render() {
        const { isLoading, changefee } = this.state;
        const membersince = this.props.membersince;
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
                        <Title style={{ fontSize: "18px" }}>Deletion Charges</Title>
                    </Col>
                    <Spin spinning={isLoading}>
                        <Row gutter={24} style={{ marginBottom: 10 }}>
                            <Col span={24}>
                                <Radio.Group onChange={this.handleOptionChange} value={this.state.selectedOption} style={{ width: "100%", display: "flex" }} >
                                    <div
                                        onClick={() =>
                                            this.setState(
                                                { selectedOption: "MILES" },
                                                () => this.getChangePrice()
                                            )
                                        }
                                        style={{
                                            width: "50%",
                                            maxHeight: "80px",
                                            background:
                                                this.state.selectedOption === "MILES"
                                                    ? "rgba(232, 241, 250, 0.68)"
                                                    : "#FFFFFF",
                                            border:
                                                this.state.selectedOption === "MILES"
                                                    ? "3px solid #7090BA"
                                                    : "2px solid #E5E5E5",
                                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                            borderRadius: "10px",
                                            padding: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            marginBottom: "10px",
                                            marginRight: "10px"
                                        }}
                                    >
                                        <Radio value="MILES" />
                                        <div style={{ marginLeft: "16px" }}>
                                            <div style={{ fontWeight: 600, fontSize: "14px" }}>Pay with Miles</div>
                                            <div style={{ color: "#666", fontSize: "12px" }}>Deduct from your miles balance</div>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() =>
                                            this.setState(
                                                { selectedOption: "CASH" },
                                                () => this.getChangePrice()
                                            )
                                        }
                                        style={{
                                            width: "50%",
                                            maxHeight: "80px",
                                            background:
                                                this.state.selectedOption === "CASH"
                                                    ? "rgba(232, 241, 250, 0.68)"
                                                    : "#FFFFFF",
                                            border:
                                                this.state.selectedOption === "CASH"
                                                    ? "3px solid #7090BA"
                                                    : "2px solid #E5E5E5",
                                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                            borderRadius: "10px",
                                            padding: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Radio value="CASH" />
                                        <div style={{ marginLeft: "16px" }}>
                                            <div style={{ fontWeight: 600, fontSize: "14px" }}>Pay via Cash / Transfer</div>
                                            <div style={{ color: "#666", fontSize: "12px" }}>Pay outside the system, then enter the code</div>
                                        </div>
                                    </div>
                                </Radio.Group>
                            </Col>
                        </Row>
                        {this.state.selectedOption === "CASH" ?
                            <Row gutter={24} style={{ marginBottom: 10 }}>
                                <Col span={24}>
                                    <Radio.Group onChange={this.handleCurrencyChange} value={this.state.selectedCurrency} style={{ width: "100%", display: "flex" }} >
                                        <div
                                            onClick={() =>
                                                this.setState(
                                                    { selectedCurrency: "IDR" },
                                                    () => this.getChangePrice()
                                                )
                                            }
                                            style={{
                                                width: "50%",
                                                maxHeight: "80px",
                                                background:
                                                    this.state.selectedCurrency === "IDR"
                                                        ? "rgba(232, 241, 250, 0.68)"
                                                        : "#FFFFFF",
                                                border:
                                                    this.state.selectedCurrency === "IDR"
                                                        ? "3px solid #7090BA"
                                                        : "2px solid #E5E5E5",
                                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                                borderRadius: "10px",
                                                padding: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                marginBottom: "10px",
                                                marginRight: "10px"
                                            }}
                                        >
                                            <Radio value="IDR" />
                                            <div style={{ marginLeft: "16px" }}>
                                                <div style={{ fontWeight: 600, fontSize: "14px" }}>IDR (Rp)</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>Indonesian Rupiah</div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() =>
                                                this.setState(
                                                    { selectedCurrency: "USD" },
                                                    () => this.getChangePrice()
                                                )
                                            }
                                            style={{
                                                width: "50%",
                                                maxHeight: "80px",
                                                background:
                                                    this.state.selectedCurrency === "USD"
                                                        ? "rgba(232, 241, 250, 0.68)"
                                                        : "#FFFFFF",
                                                border:
                                                    this.state.selectedCurrency === "USD"
                                                        ? "3px solid #7090BA"
                                                        : "2px solid #E5E5E5",
                                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                                borderRadius: "10px",
                                                padding: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <Radio value="USD" />
                                            <div style={{ marginLeft: "16px" }}>
                                                <div style={{ fontWeight: 600, fontSize: "14px" }}>US Dollar ($)</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>United States Dollar</div>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                </Col>
                            </Row> : null
                        }
                        {this.state.selectedOption === "CASH" ?
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -10 }}>
                                                <div style={{ fontSize: "16px", fontWeight: 400 }}> Nominee Deletion Charges </div>
                                                {this.state.selectedCurrency === "IDR" ?
                                                    <div style={{ fontSize: "16px", fontWeight: 600 }}> Rp{changefee ? formatNumber(changefee) : 0} </div>
                                                    :
                                                    <div style={{ fontSize: "16px", fontWeight: 600 }}> ${changefee ? changefee : 0} </div>
                                                }
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                <div style={{ fontSize: "12px", fontWeight: 400 }}> Tier </div>
                                                <div style={{ fontSize: "12px", fontWeight: 600 }}> {this.props.tiername ? this.props.tiername : "-"} </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            :
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ fontSize: "16px", fontWeight: 400 }}> Nominee Deletion Charges </div>
                                                <div style={{ fontSize: "16px", fontWeight: 600 }}> {changefee ? formatNumber(changefee) : 0} Miles</div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                                <div style={{ fontSize: "12px", fontWeight: 400 }}> Tier </div>
                                                <div style={{ fontSize: "12px", fontWeight: 600 }}> {this.props.tiername ? this.props.tiername : "-"} </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        }
                        {this.state.selectedOption === "CASH" ?
                            <Row gutter={24} style={{ marginTop: 20 }}>
                                <Col span={24}>
                                    <div
                                        style={{
                                            width: "100%",
                                            maxHeight: "15px",
                                            background: "#F6FFE6",
                                            borderLeft: "10px solid #6F9838",
                                            borderRadius: "0px 10px 10px 0px",
                                            padding: "20px 24px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{ fontSize: "10px", fontWeight: 600, color: "#3f5f17" }}>
                                            Complete the payment of Rp{changefee ? formatNumber(changefee) : 0} via bank, e-wallet, or cash outlet. Then enter the transaction code provided into the system.
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            :
                            // <Row gutter={24} style={{ marginTop: 20 }}>
                            //     <Col span={24}>
                            //         <div
                            //             style={{
                            //                 width: "100%",
                            //                 maxHeight: "15px",
                            //                 background: "#448EF721",
                            //                 borderLeft: "10px solid #4C80CA",
                            //                 borderRadius: "0px 10px 10px 0px",
                            //                 padding: "20px 24px",
                            //                 display: "flex",
                            //                 alignItems: "center",
                            //             }}
                            //         >
                            //             <div style={{ fontSize: "10px", fontWeight: 600, color: "#181D55" }}>
                            //                 Your points will be automatically deducted by {changefee ? formatNumber(changefee) : 0} miles. Remaining points 4500 miles.
                            //             </div>
                            //         </div>
                            //     </Col>
                            // </Row>
                            null
                        }
                        <Row gutter={24} style={{ marginTop: 20 }}>
                            <Col span={24}>
                                <Button type="default" style={{ width: "100%" }} onClick={() => this.handleMenuCallback('next')} > Next </Button>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 5 }}>
                            <Col span={24}>
                                <Button type="default" style={{ width: "100%" }} onClick={() => this.handleMenuCallback('back')} > {moment().diff(moment(membersince), 'months') <= 6 ? "Cancel" : "Back"} </Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);