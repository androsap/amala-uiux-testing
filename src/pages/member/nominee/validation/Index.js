
import React from 'react';
import { Form, Row, Col, Button, Icon, Spin, Tag, List } from 'antd';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membercardOri: [],
            membercardDes: [],
            isLoading: false
        }
    };

    componentDidMount() {
        document.title = 'Member Redemption Nominee | Loyalty Management System';
    };

    handleMenuCallback = () => {
        this.props.handleMenuCallback({
            choosen: 'deletion-charges',
            current: 1,
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

    render() {
        const { isLoading } = this.state;
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
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "15px",
                                        background: "#FFFFFF",
                                        border: "1px solid rgba(97, 93, 93, 0.5)",
                                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
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
                                            <div style={{ color: "#666", fontSize: "12px" }}> Registered since {moment(this.props.membersince).format("DD/MM/YYYY")} </div>
                                        </div>
                                    </div>
                                    {/* <div>
                                        <Tag color='#B2B2B2B0' style={{ color: 'grey', fontWeight: "bold", borderRadius: "20px", fontSize: "14px", padding: "4px 14px 6px" }}>{this.props.tiername ? this.props.tiername : null}</Tag>
                                        {moment().diff(moment(this.props.membersince), 'months') >= 6 ?
                                            <Tag color="#87d068" style={{ color: 'green', fontWeight: "bold", borderRadius: "20px", fontSize: "14px", padding: "4px 14px 6px" }}>Eligible</Tag>
                                            : null}
                                    </div> */}
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 20 }}>
                            <Col span={24}>
                                <div
                                    style={{
                                        width: "100%",
                                        maxHeight: "100px",
                                        background: "#F6FFE6",
                                        borderLeft: "10px solid #6F9838",
                                        borderRadius: "0px 10px 10px 0px",
                                        padding: "10px 24px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#3f5f17" }}>
                                            Nominee Eligible for Deletion
                                        </div>
                                        <div style={{ color: "#5d6f49", fontSize: "12px" }}>
                                            {capitalizeWords(this.props.firstname) + " " + capitalizeWords(this.props.lastname)} has been registered for more than 6 months and is eligible to be removed from your nominee list.
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
                                        maxHeight: "100px",
                                        background: "#F8EEDC",
                                        borderLeft: "10px solid #E3A344",
                                        borderRadius: "0 10px 10px 0",
                                        padding: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#9B6A22" }} > Warning </div>
                                        <List
                                            dataSource={[
                                                "Once removed, the nominee will no longer be able to use your point benefits",
                                                <span> <b>Charges</b> will apply for deletion </span>,
                                                "This action cannot be undone"
                                            ]}
                                            renderItem={item => (
                                                <List.Item style={{
                                                    padding: "4px 0",
                                                    fontSize: "12px",
                                                    borderBottom: "none",
                                                    minHeight: "unset"
                                                }}
                                                >
                                                    • {item}
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 20 }}>
                            <Col span={24}>
                                <Button
                                    type="default"
                                    style={{ width: "100%" }}
                                    onClick={() => this.handleMenuCallback('next')}
                                >
                                    View Deletion Charges <Icon type="right" />
                                </Button>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{ marginTop: 5 }}>
                            <Col span={24}>
                                <Button
                                    type="default"
                                    style={{ width: "100%" }}
                                    onClick={() => this.props.handleCancel()}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);
