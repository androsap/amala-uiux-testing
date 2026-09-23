import React from 'react';
import { Layout, Menu, Row, Col, Tabs, Typography, Tag, Icon} from 'antd';
import MemberManagementSider from '../Sider/MemberManagementSider';

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;

class App extends React.Component {

    render() {
        return (
            <Content style={{ margin: '16px 0', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                <Layout style={{ background: '#fff', padding: '24px', borderBottom: '2px solid rgb(233, 233, 233)' }}>
                    <Row gutter={8} style={{ width: '100%' }}>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3} xl={3} style={{ textAlign: 'center', }}>
                            <div className="member-card">
                                <img ref="image" src="http://172.25.230.122/uploads/cards/gold.jpg" alt="CardImage" width="130" />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={9} lg={9} xl={9} xl={9}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                                    MUHAMAD HUMAM
                                </Col>
                            </Row>
                            <Row className="member-profile">
                                <Col xs={24} sm={24} md={6} lg={6} xl={6} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>STATUS</p>
                                    <Tag color="#00d949" style={{ marginRight: 0, color: 'white' }}>Active</Tag>
                                </Col>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>MEMBERSHIP</p>
                                    <span>REGULAR - BLUE</span>
                                </Col>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>CARD NUMBER</p>
                                    <span><Icon type="credit-card"/> 356862645</span>
                                </Col>
                                <Col xs={24} sm={24} md={6} lg={6} xl={6} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>BRANCH OFFICE</p>
                                    <span><Icon type="environment" /> JKTA</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xl={8} style={{ borderRight: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9', padding: '12px' }}>
                            <Row className="member-balance">
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Current Balance</p>
                                    <span> 200</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Mileage</p>
                                    <span>0</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Frequency</p>
                                    <span>0</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={4} xl={4} xl={4} className="member-date" style={{paddingLeft: '15px', paddingTop: '10px'}}>
                            <Row>
                                <Col span={12} className="date-label">Member Since</Col>
                                <Col span={12} className="date-value"> 28/12/2018</Col>
                            </Row>
                            <Row>
                                <Col span={12} className="date-label">Effective date</Col>
                                <Col span={12} className="date-value"> 28/12/2018</Col>
                            </Row>
                            <Row>
                                <Col span={12} className="date-label">Expiry date</Col>
                                <Col span={12} className="date-value"> 28/12/2018</Col>
                            </Row>
                            <Row>
                                <Col span={12} className="date-label">Date of birth </Col>
                                <Col span={12} className="date-value"> 28/12/2018</Col>
                            </Row>
                        </Col>
                    </Row>
                </Layout>
                <MemberManagementSider {...this.props} />
            </Content>
        );
    }
}

export default App;
