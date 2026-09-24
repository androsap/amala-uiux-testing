import React, { Component } from 'react';
import { DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Row, Col, Spin, Collapse } from 'antd';

import Air from './air/Form'
import NonAir from './non_air/Form'
import MemberCriteria from './member/Form'

const { Panel } = Collapse;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataCriteria: [],
            dataCategory: [],
            dataMemberCategory: []
        }
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        const { promocatalogcode, promotype } = this.props;
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(api.url.redemptionpromo.criteriacategory.getcriteriacategory, { promocatalogcode }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                this.setState({ data: result });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });

        RetrieveRequest(api.url.redemptionpromo.criteriatype.list, {}, {}).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                this.setState({ dataCriteria: result });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });

        RetrieveRequest(api.url.redemptionpromo.categorytype.list, { criteriatypecode: promotype }, { limit: 30 }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                this.setState({ dataCategory: result });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });

        RetrieveRequest(api.url.redemptionpromo.categorytype.list, { criteriatypecode: 'MEMBER' }, { limit: 30 }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                this.setState({ dataMemberCategory: result });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });

        this.setState({ isLoading: false });
    };

    render() {
        const { data, dataCriteria, dataCategory, dataMemberCategory, isLoading } = this.state;
        const { promotype } = this.props;

        //Set disabled field from Promo Criteria Type
        let airdisabled = dataCriteria.length === 0 ? false : (dataCriteria.find(o => o.criteria === 'AIR').active === true) ? false : true;
        let nonairdisabled = dataCriteria.length === 0 ? false : (dataCriteria.find(o => o.criteria === 'NONAIR').active === true) ? false : true;
        let memberdisabled = dataCriteria.length === 0 ? false : (dataCriteria.find(o => o.criteria === 'MEMBER').active === true) ? false : true;

        //title bar on browser
        document.title = ' Add New Redemption Promo | Loyalty Management System ';
        //render form
        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Row gutter={24}>
                        <Collapse bordered={false} >
                            <Panel header={(promotype === 'AIR') ? 'Air' : 'Non Air'} key='1' >
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    {(promotype === 'AIR') ? <Air {...this.props} data={data} getDetail={this.getDetail} dataCategory={dataCategory} airdisabled={airdisabled} /> :
                                        <NonAir {...this.props} data={data} getDetail={this.getDetail} dataCategory={dataCategory} nonairdisabled={nonairdisabled} />}
                                </Col>
                            </Panel>
                            <Panel header='Member Criteria' key='2' >
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <MemberCriteria {...this.props} data={data} dataMemberCategory={dataMemberCategory} getDetail={this.getDetail} memberdisabled={memberdisabled} />
                                </Col>
                            </Panel>
                        </Collapse>
                    </Row>
                </Spin>
            </Row>
        )
    }
}

export default App;