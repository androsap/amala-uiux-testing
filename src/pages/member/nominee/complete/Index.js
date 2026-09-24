
import React from 'react';
import { api } from '../../../../config/Services';
import { Form, Row, Col, Button, Spin, Typography, Icon } from 'antd';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { formatNumber, jsUcfirst } from '../../../../utilities/Helpers';

const { Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membercardOri: [],
            membercardDes: [],
            isLoading: false,
            isConfirmed: false,
            saveTransaction: false
        }
    };

    componentDidMount() {
        document.title = 'Member Redemption Nominee | Loyalty Management System';
    };

    handleMenuCallback = () => {
        this.props.handleMenuCallback({ choosen: 'deletion-charges', profile: 1 });
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
        this.setState({
            isConfirmed: e.target.checked
        });
    };

    deleteData() {
        const { form, id } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                let url = api.url.memberredemptionnominee.delete;
                let data = { redemptionnomineecode: id, remarks: values.remarks };
                var callback = (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring === '0000') {
                        let message = responsemessage || 'Selected data has been deleted';
                        Alert.success(message);
                        this.handleMenuCallback('next');
                    } else {
                        Alert.error(responsemessage);
                    }
                };
                DeleteRequest(url, data, callback);
            }
        });
    }

    handleSaveTransaction = () => {
        this.setState({ saveTransaction: true });
    };

    render() {
        const { isLoading } = this.state;
        const { changefee, selectedOption } = this.props;

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
                    <Col span={16} offset={4} style={{ textAlign: 'center', marginBottom: 10 }}>
                        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{ fontSize: '48px', marginBottom: 10 }} /><br />
                        <Text style={{ fontSize: "18px", fontWeight: 600 }}>Deletion Successful!</Text><br />
                        {selectedOption === "MILES" ?
                            <Text style={{ fontSize: "14px", fontWeight: 600 }}>{capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} has been deleted. Your miles has been successfully deducted.</Text>
                            :
                            <Text style={{ fontSize: "14px", fontWeight: 600 }}>{capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} has been deleted. Your miles remain intact.</Text>
                        }
                    </Col>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col span={16} offset={4}>
                                <div style={{ padding: "15px", background: "#FFFFFF", border: "1px solid rgba(97, 93, 93, 0.5)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)", borderRadius: "10px" }} >
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Nominee Deleted </div>
                                            <div style={{ fontSize: "14px", fontWeight: 600 }}> {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} </div>
                                        </div>
                                        <div className={this.props.selectedOption === "MILES" ? "" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Tier </div>
                                            <div style={{ fontWeight: 600 }}> {this.props.tiername} </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Payment Method </div>
                                            <div style={{ fontWeight: 600 }}> {this.props.selectedOption === "MILES" ? "Miles" : "Cash / External Transfer"} </div>
                                        </div>
                                        <div className={this.props.selectedOption === "CASH" ? "" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Transaction Code </div>
                                            <div style={{ fontWeight: 600, color: "#4C80CA" }}>{this.props.paymentreference}</div>
                                        </div>
                                        <div className={this.props.selectedOption === "CASH" ? "" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Total Paid </div>
                                            <div style={{ fontWeight: 600, color: "#EC5B56" }}> {this.props.selectedCurrency === "IDR" ? "Rp" : "$"}{changefee ? formatNumber(changefee) : 0}</div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                                            <div style={{ fontSize: "14px", fontWeight: 400 }}> Your Miles </div>
                                            <div style={{ fontWeight: 600, color: this.props.selectedOption === "MILES" ? "#EC5B56" : null }}>{this.props.selectedOption === "MILES" ? "Deducted" : "No Deduction"} </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 20 }}>
                            <Col span={16} offset={4}>
                                <Button type="default" style={{ width: "100%", fontWeight: 600 }} onClick={() => this.props.onOk()} > Completed </Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);