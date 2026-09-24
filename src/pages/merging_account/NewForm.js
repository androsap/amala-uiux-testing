import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Typography, Row, Col, Divider, Modal, Tooltip } from 'antd';
import { Button, RadioButton } from '../../components/Base/BaseComponent';
import Approval from './Approval';

const { Title, Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            visibleApproval: false,
        }
        this.closeAndRefresh = React.createRef();
    }

    handleModal = () => {
        this.setState({ visibleApproval: true });
    };

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    handleCancel = () => {
        this.setState({ visibleApproval: false });
    };

    render() {
        const { visibleApproval, isLoading } = this.state;
        const { dataOrigin, dataDestination } = this.props;
        const emailOri = dataOrigin.length !== 0 && dataOrigin[0].email ? dataOrigin[0].email : '';
        const emailDes = dataDestination.length !== 0 && dataDestination[0].email ? dataDestination[0].email : '';

        const contactOri = dataOrigin.length !== 0 && dataOrigin[0].membercontacts.length !== 0 && dataOrigin[0].membercontacts[0].memberphoneid ? dataOrigin[0].membercontacts[0].memberphoneid : '';
        const contactDes = dataDestination.length !== 0 && dataDestination[0].membercontacts.length !== 0 && dataDestination[0].membercontacts[0].memberphoneid ? dataDestination[0].membercontacts[0].memberphoneid : '';
        const labelContactOri = dataOrigin.length !== 0 && dataOrigin[0].membercontacts.length !== 0 && dataOrigin[0].membercontacts[0].memberphoneid ? dataOrigin[0].membercontacts[0].countryphonecode + dataOrigin[0].membercontacts[0].phonenumber : '';
        const labelContactDes = dataDestination.length !== 0 && dataDestination[0].membercontacts.length !== 0 && dataDestination[0].membercontacts[0].memberphoneid ? dataDestination[0].membercontacts[0].countryphonecode + dataDestination[0].membercontacts[0].phonenumber : '';

        const addressOri = dataOrigin.length !== 0 && dataOrigin[0].memberaddress.length !== 0 && dataOrigin[0].memberaddress[0].memberaddressid ? dataOrigin[0].memberaddress[0].memberaddressid : '';
        const addressDes = dataDestination.length !== 0 && dataDestination[0].memberaddress.length !== 0 && dataDestination[0].memberaddress[0].memberaddressid ? dataDestination[0].memberaddress[0].memberaddressid : '';
        const labelAddressOri = dataOrigin.length !== 0 && dataOrigin[0].memberaddress.length !== 0 && dataOrigin[0].memberaddress[0].memberaddressid ? dataOrigin[0].memberaddress[0].address : '';
        const labelAddressDes = dataDestination.length !== 0 && dataDestination[0].memberaddress.length !== 0 && dataDestination[0].memberaddress[0].memberaddressid ? dataDestination[0].memberaddress[0].address : '';

        const nameOri = dataOrigin[0].firstname || dataOrigin[0].lastname ? dataOrigin[0].firstname + ' ' + dataOrigin[0].lastname : '-';
        const cardnumberOri = dataOrigin[0].membercards.length !== 0 ? dataOrigin[0].membercards[0].cardnumber : '-';
        const nameDes = dataDestination[0].firstname || dataDestination[0].lastname ? dataDestination[0].firstname + ' ' + dataDestination[0].lastname : '-';
        const cardnumberDes = dataDestination[0].membercards.length !== 0 ? dataDestination[0].membercards[0].cardnumber : '-';

        const memberOri = dataOrigin.length !== 0 && dataOrigin[0].memberid ? dataOrigin[0].memberid : '';
        const memberDes = dataDestination.length !== 0 && dataDestination[0].memberid ? dataDestination[0].memberid : '';

        const optionsEmail = [
            { label: emailOri, value: emailOri },
            { label: emailDes, value: emailDes }
        ]

        const optionsPhone = [
            { label: labelContactOri, value: contactOri },
            { label: labelContactDes, value: contactDes }
        ]

        const optionsAddress = [
            { label: labelAddressOri, value: addressOri },
            { label: labelAddressDes, value: addressDes }
        ]

        const fields = [
            { key: "email", label: "Email", options: optionsEmail },
            { key: "phone", label: "Phone", options: optionsPhone },
            { key: "address", label: "Address", options: optionsAddress },
        ];

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        const email = this.props.form.getFieldValue("email")
        const phone = this.props.form.getFieldValue("phone")
        const address = this.props.form.getFieldValue("address")

        return (
            <Form {...formItemLayout}>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title style={{ fontSize: 18, fontWeight: 600, color: 'black' }}>Select Data to Retain for Merging</Title>
                    </Col>
                    <Divider />
                </Row>
                <Row>
                    <Col xs={24} xl={10}>
                        <Text form={this.props.form} style={{ fontSize: nameOri.length > 25 ? 10 : 12 }} >{nameOri}</Text><br />
                        <Text form={this.props.form} >{cardnumberOri}</Text>
                    </Col>
                    <Col xs={24} xl={4}>
                        <div style={{ textAlign: 'center' }}><Text form={this.props.form} style={{ fontWeight: '600' }}>Name</Text></div>
                        <div style={{ textAlign: 'center' }}><Text form={this.props.form} style={{ fontWeight: '600' }}>Cardnumber</Text></div>
                    </Col>
                    <Col xs={24} xl={10}>
                        <div style={{ textAlign: 'right', fontSize: nameDes.length > 25 ? 10 : 12 }}><Text form={this.props.form}>{nameDes}</Text></div>
                        <div style={{ textAlign: 'right' }}><Text form={this.props.form}>{cardnumberDes}</Text></div>
                    </Col>
                </Row>
                <Divider />

                {/* Radio Button Options */}
                {fields.map(({ key, label, options }) => (
                    <Row key={key} align="middle" justify="center" gutter={16}>
                        {/* Kolom kiri: value 0 */}
                        <Col span={10}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr auto",
                                    alignItems: "center",
                                    textAlign: "left",
                                    gap: 6,
                                    marginRight: -20
                                }}
                            >
                                {/* Label kiri (rata kiri) */}
                                <Tooltip title={options[0]?.label?.length > 25 ? options[0].label : null}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "normal",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {options[0]?.label?.length > 25
                                            ? `${options[0].label.slice(0, 25)}...`
                                            : options[0]?.label}
                                    </span>
                                </Tooltip>

                                {/* Radio di kanan */}
                                <div style={{ justifySelf: "end" }}>
                                    <RadioButton
                                        form={this.props.form}
                                        datafield={key}
                                        options={[{ value: options[0].value, label: "" }]}
                                    />
                                </div>
                            </div>
                        </Col>

                        {/* Tengah: Label utama (dibuat bold) */}
                        <Col
                            span={4}
                            style={{
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text strong style={{ fontSize: 14, marginTop: 10 }}>{label}</Text>
                            {/* atau bisa pakai  */}
                        </Col>

                        {/* Kolom kanan: value 1 */}
                        <Col span={10}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr",
                                    alignItems: "center",
                                    textAlign: "right",
                                    gap: 6,
                                }}
                            >
                                {/* Radio di kiri */}
                                <div style={{ justifySelf: "start" }}>
                                    <RadioButton
                                        form={this.props.form}
                                        datafield={key}
                                        options={[{ value: options[1].value, label: "" }]}
                                    />
                                </div>

                                {/* Label kanan (rata kanan) */}
                                <Tooltip title={options[1]?.label?.length > 25 ? options[1].label : null}>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "normal",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {options[1]?.label?.length > 25
                                            ? `${options[1].label.slice(0, 25)}...`
                                            : options[1]?.label}
                                    </span>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                ))}
                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                    <Button htmlType='button' type='primary' size='default' label='Merging Account' onClick={() => this.handleModal()} />
                    <Button htmlType='button' type='default' size='default' label='Cancel Merging' onClick={this.props.onCancelNewModal} />
                </Row>
                <Modal visible={visibleApproval} title="Merge Account Approval" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={550}>
                    <Approval handleCancel={this.handleCancel} email={email} address={address} phone={phone} memberOri={memberOri} memberDes={memberDes} cardnumberOri={cardnumberOri} cardnumberDes={cardnumberDes} />
                </Modal>
            </Form>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));