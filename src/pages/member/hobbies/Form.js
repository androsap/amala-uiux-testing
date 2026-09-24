import React, { Component } from 'react';
import { DetailRequest, DeleteRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Button, Alert, HobbiesCheckbox, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Collapse, Modal } from 'antd';
import FavoriteDestination from './FavoriteDestination';

const { Title } = Typography;
const { Panel } = Collapse;

class ListFavorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            visible: false,
            actioncode: null,
            memberdestinationid: null,
        }
    }

    componentDidMount() {
    }

    deleteData(memberdestinationid) {
        let url = api.url.favoritedestination.delete;
        let data = { memberdestinationid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
            this.props.refreshHeader();
        };

        DeleteRequest(url, data, callback);
    }

    handleOpenModalSetup = (value, actioncode) => {
        this.setState({ visible: true, actioncode: actioncode, memberdestinationid: value });
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.componentTable.getList();
        this.props.refreshHeader();
    };

    render() {
        const { visible, isLoading } = this.state;

        const configurationTable = {
            url: api.url.favoritedestination.list,
            criteria: { memberid: this.props.match.params.ID },
            columns: [
                { type: 'field', title: 'Airline', dataIndex: 'airlinecode' },
                {
                    type: 'html', title: 'Route', dataIndex: 'route',
                    render: (value, row, index) => {
                        let origin = row.origin;
                        let destination = row.destination;
                        let route = `${origin} - ${destination}`;

                        return route;
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'memberdestinationid',
                    render: (value, row, index) => {
                        let actioncode = "UPDATE";
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" onClick={() => this.handleOpenModalSetup(value, actioncode)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" onClick={() => this.deleteData(value)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="Favorite Destination" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <FavoriteDestination {...this.props} refreshList={this.handleCancel} actioncode={this.state.actioncode} memberdestinationid={this.state.memberdestinationid} />
                </Modal>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} pagination={false} />
            </React.Fragment>
        );

    }
}

class ListHobby extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
            }
            //change into update page
            this.setState({ titlepage, actionspage });
            this.getDetail(id, actionspage);
            this.componentHobbiesCheckbox.retrieveData();
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (memberid) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { memberid, type };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let hobbies = result.memberhobbies.map((value) => { return value.hobbiesid });

                let setValue = { hobbies };
                this.props.form.setFieldsValue(setValue);
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.match.params.ID;
                let hobbies = (input.hobbies) ? input.hobbies : [];

                let data = { memberid, hobbies };

                let message = 'New data has been created';
                let url = api.url.memberhobbies.update;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        return (
            <React.Fragment>
                <HobbiesCheckbox ref={(e) => { this.componentHobbiesCheckbox = e }} form={this.props.form} datafield="hobbies" />
            </React.Fragment>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: ['HOBBIES', 'DESTINATION'],
            isLoading: false,
            formrender: true,
            visible: false,
        }
    }

    componentDidMount() {
    }

    onClickCollapse = (key) => {
        this.setState({ activeKey: key });
    }

    handleSetHobby = (e) => {
        this.componentHobbies.saveAction(e);
    }

    handleOpenModalSetup = () => {
        this.componentListFavorite.handleOpenModalSetup();
    }

    handleCancel = () => {
        this.componentListFavorite.handleCancel();
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, activeKey, visible, isLoading } = this.state;
        const data = [
            { label: 'Hobbies', value: 'HOBBIES' },
            { label: 'Favorite Destination', value: 'DESTINATION' },
        ];

        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Preferences & Interest</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Modal visible={visible} title="Favorite Destination" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                        <FavoriteDestination {...this.props} refreshList={this.handleCancel} />
                    </Modal>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }}>
                                    <Collapse bordered={false} defaultActiveKey={activeKey} activeKey={activeKey} onChange={this.onClickCollapse}>
                                        {
                                            data.map((obj, key) => {
                                                return (
                                                    <Panel header={
                                                        <Row>
                                                            <Col xs={24} sm={24} md={24} lg={22} xl={22}>
                                                                {obj.label}
                                                            </Col>
                                                            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
                                                                {(obj.value === 'HOBBIES') ?
                                                                    <Button htmlType="submit" type="primary" size="small" label="Set" onClick={(e) => this.handleSetHobby(e)} />
                                                                    : (obj.value === 'DESTINATION') ?
                                                                        <Button htmlType="button" type="primary" size="small" label="Add" onClick={() => this.handleOpenModalSetup()} />
                                                                        : null
                                                                }
                                                            </Col>
                                                        </Row>
                                                    } key={obj.value} destroyInactivePanel={true} forceRender={true}>
                                                        {
                                                            (obj.value === 'HOBBIES') ?
                                                                <ListHobby ref={(e) => { this.componentHobbies = e }} {...this.props} />
                                                                : <ListFavorite ref={(e) => { this.componentListFavorite = e }} {...this.props} />
                                                        }
                                                    </Panel>
                                                )
                                            })
                                        }
                                    </Collapse>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));