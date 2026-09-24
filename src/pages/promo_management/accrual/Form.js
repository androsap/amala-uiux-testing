import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Row, Col, Divider, Typography, Form, Layout, Skeleton, Affix } from 'antd';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { PromoManagementCatalogSider, Button } from '../../../components/Base/BaseComponent';
import ErrorGeneral from '../../error/ErrorGeneral';

import BasicInfo from './basic_info/Form';
import MemberCriteria from './member_criteria/Form';
import AirActivity from './air_activity/Form';
import NonAirActivity from './non_air_activity/Form';
import BonusActivityCodeSetup from './bonus_activity/Form';

const { Content } = Layout;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            promotype: null,
            datapromo: {},
            formrender: false,
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    checkPermission = async () => {
        let promocode = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname, location } = this.props;
        const { usermenu } = permission;
        if (promocode) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            if (location.pathname.split('/')[4] === 'basic-info' && !usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
            }

            await this.setState({ promocode, titlepage, actionspage });
            await this.getDetail(promocode, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
    };

    getDetail(promocode) {
        let url = api.url.promomanage.retrieve;
        RetrieveRequest(url, { promocode }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                const { promotype, name } = result[0] || {};
                this.setState({
                    promotype, name,
                    datapromo: result,
                    formrender: true
                });
            } else this.setState({
                responsemessage,
                formrender: false,
            });
        });
    };

    render() {
        const { titlepage, actionspage, promotype, datapromo, name, formrender, responsemessage } = this.state;
        const { match, location } = this.props;

        const promocode = match.params.ID;
        const menu = (location && location.pathname.split('/')[4]) ? location.pathname.split('/')[4] : 'basic-info';
        const additionalTitle = [
            { menu: 'basic-info', title: 'Basic Info Setup' },
            { menu: 'member-criteria', title: 'Member Criteria Setup' },
            { menu: 'air-criteria', title: 'Air Criteria Setup' },
            { menu: 'nonair-criteria', title: 'Non Air Criteria Setup' },
            { menu: 'bonus-activity', title: 'Bonus Activity Setup' },
        ];

        if (formrender && name) {
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>
                                <Button htmlType={'html'} url={`/promo-manage-catalog`} shape='circle' icon='left' style={{ marginRight: 15 }} />
                                {titlepage} {(actionspage === 'create') ? 'New Promo' : `Promo ${name} - ${additionalTitle.find(val => val.menu === menu).title}`}
                            </Title>
                        </Col>
                        <Divider />
                    </Row>

                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Affix offsetTop={40}>
                            <PromoManagementCatalogSider onRef={(e) => (this.componentPromoManagementSider = e)} promocode={promocode} promotype={promotype} {...this.props} />
                        </Affix>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            {(Object.keys(datapromo).length !== 0) ? (menu === 'basic-info') ?
                                <BasicInfo {...this.props} datapromo={datapromo} /> : (menu === 'member-criteria') ?
                                    <MemberCriteria {...this.props} datapromo={datapromo} /> : (menu === 'air-criteria') ?
                                        <AirActivity {...this.props} datapromo={datapromo} /> : (menu === 'nonair-criteria') ?
                                            <NonAirActivity {...this.props} datapromo={datapromo} /> : <BonusActivityCodeSetup {...this.props} datapromo={datapromo} /> :
                                <ErrorGeneral {...this.props} message={(responsemessage) ? responsemessage : 'No Data Found'} />
                            }
                        </Content>
                    </Layout>
                </Row>
            )
        } else return (<Skeleton active />);
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));