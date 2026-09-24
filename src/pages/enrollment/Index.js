import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorGeneral from '../error/ErrorGeneral';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button, Alert } from '../../components/Base/BaseComponent';
import { connect } from "react-redux";
import { Form, Row, Col, Divider, Typography, Icon, Card, Skeleton } from 'antd';

const { Title } = Typography;
const { Meta } = Card;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formrender: true,
            optionsMembership: []
        }
    }

    componentDidMount() {
        document.title = "Member Enrollment | Loyalty Management System";
        let { enrollmentaccess } = this.props.permission;
        this.getOptionsMembership(enrollmentaccess);
    }

    getOptionsMembership(enrollmentaccess) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            membershipname: 'asc'
        };
        let criteria = {};
        let url = api.url.membership.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ loading: true });
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsMembership = result.map(obj => {
                    var result2 = {};
                    result2['membershipname'] = obj.membershipname;
                    result2['membershipid'] = obj.membershipid;
                    result2['show'] = (enrollmentaccess["MEMBERSHIP_" + obj.membershipid]) ? true : false;
                    result2['firstnum'] = obj.firstnum;
                    return result2;
                })

                this.setState({
                    optionsMembership,
                    loading: false
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    render() {
        const { formrender, loading } = this.state;
        if (formrender) {
            //title bar on browser
            document.title = " Member Enrollment | Loyalty Management System ";

            let membershipList = '';
            if (!loading) {
                membershipList = this.state.optionsMembership.map((value, key) =>
                    <Col className={(value.show) ? 'gutter-row' : 'gutter-row hidden'} style={{ padding: '15px 15px' }} xs={24} sm={24} md={24} lg={6} xl={6} key={key}>
                        <Link to={'/enrollment/create/' + value.membershipid}>
                            <Card hoverable bordered={false} className="card-shadow"
                                cover={<div style={{ backgroundColor: '#1890ff', height: 150, borderRadius: '5px 5px 0 0' }}>
                                    <Icon type="idcard" style={{ fontSize: 55, color: '#fff', height: 150, margin: '45px' }} />
                                </div>}>
                                <Meta
                                    title={<Title style={{ fontSize: 17, height: 50, margin: 0, color: '#153d7a', fontWeight: 'bold', whiteSpace: 'normal' }}>{value.membershipname}</Title>}
                                    description={<Button url={'/enrollment/create/' + value.membershipid} label="Enroll Now" />}>
                                </Meta>
                            </Card>
                        </Link>
                    </Col>
                );
            } else {
                let amount = [{}, {}, {}, {}, {}, {}, {}, {}];
                membershipList = amount.map((value, key) =>
                    <Col className="gutter-row" style={{ padding: '15px 15px' }} xs={24} sm={24} md={24} lg={6} xl={6}>
                        <Card hoverable bordered={false} className="card-shadow" key={key}
                            cover={<div style={{ backgroundColor: '#1890ff', height: 150, borderRadius: '5px 5px 0 0' }}>
                                <Icon type="idcard" style={{ fontSize: 55, color: '#fff', height: 150, margin: '45px' }} />
                            </div>}>
                            <Skeleton loading={loading} active>
                                <Meta
                                    title={<Title style={{ fontSize: 17, height: 50, margin: 0, color: '#153d7a', fontWeight: 'bold', whiteSpace: 'normal' }}>Title</Title>}
                                    description={<Button htmlType="button" label="Enroll Now" />}>
                                </Meta>
                            </Skeleton>
                        </Card>
                    </Col>
                );
            }


            //render form
            return (
                <React.Fragment>
                    <Divider style={{ marginBottom: 20 }}>
                        <Title level={3}>Member Enrollment</Title>
                    </Divider>
                    <Row type="flex" className="enrollment-grid">
                        {membershipList}
                    </Row>
                </React.Fragment>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));