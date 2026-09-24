import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Row, Col, Divider, Typography, Form, Layout, Skeleton, Affix, Tooltip, Modal } from 'antd';
import { DetailRequest } from '../../../utilities/RequestService';
import { MailingProductSider, Button, Alert } from '../../../components/Base/BaseComponent';
import ErrorGeneral from '../../error/ErrorGeneral';

import BasicInfo from './basic_info/Form';
import CancelUpdateFee from './cancel_update_fee/Form';
import Price from './price/Index';
import Vendor from './vendor/Index';

import PriceForm from './price/Form';
import VendorForm from './vendor/Form';
import moment from 'moment';

const { Content } = Layout;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            dataproduct: {},
            variants: [],
            formrender: false,
            fieldvalue: {
                mailingproductcode: null,
                mailingproductname: null,
                period: null,
            },
            visible: {
                showpriceform: false,
                showvendorform: false
            },
            titleModalPage: {
                titlePricePage: 'Create',
                titleVendorPage: 'Create'
            },
            modalID: {
                mailingproductpriceid: null,
                mailingproductvendorid: null
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    checkPermission = async () => {
        let mailingproductcode = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname, location } = this.props;
        const { usermenu } = permission;
        if (mailingproductcode) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            if (location.pathname.split('/')[4] === 'basic-info' && !usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
            }

            await this.setState({ titlepage, actionspage, fieldvalue: { ...this.state.fieldvalue, mailingproductcode } });
            await this.getDetail(mailingproductcode, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
    };

    getDetail(mailingproductcode) {
        DetailRequest(api.url.mailingproduct.detail, { mailingproductcode }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                const { mailingproductcode, mailingproductname, startdate, enddate, producttype, inventorycode } = result || {};
                const period = [moment(startdate), moment(enddate)];

                DetailRequest(api.url.inventorysys.detail, { inventorycode }).then((response) => {
                    const { status, result } = response;
                    const { responsecode, responsemessage } = status;
                    if (responsecode === '0000' && result) {
                        this.setState({ variants: result.variants });
                    } else Alert.error(responsemessage);
                });

                this.setState({
                    dataproduct: result,
                    formrender: true,
                    fieldvalue: { ...this.state.fieldvalue, mailingproductcode, mailingproductname, period, producttype }
                });
            } else this.setState({ responsemessage, formrender: false, });
        });
    };

    handleVisible = (value, type) => {
        this.setState({ ...this.state, visible: { ...this.state.visible, [type]: value } });
    };

    handleRefreshTable = () => {
        this.handleVisible(false, 'showvendorform');
        this.componentVendor.handleRefreshTable();
    };

    render() {
        const { titlepage, dataproduct, formrender, responsemessage, visible, titleModalPage, modalID, actionspage, fieldvalue, variants } = this.state;
        const { mailingproductcode, mailingproductname, period, producttype } = fieldvalue
        const { showpriceform, showvendorform } = visible;
        const { titlePricePage, titleVendorPage } = titleModalPage;
        const { mailingproductpriceid, mailingproductvendorid } = modalID;
        const { location, menucode, prefixmenuname } = this.props;

        const menu = (location && location.pathname.split('/')[4]) ? location.pathname.split('/')[4] : 'basic-info';
        const additionalTitle = [
            { menu: 'basic-info', title: 'Basic Info Setup' },
            { menu: 'price', title: 'Price' },
            { menu: 'vendor', title: 'Vendor' },
            { menu: 'cancel-update-fee', title: 'Cancel / Update Fee' },
            { menu: 'status', title: 'Status' },
        ];

        const title = (mailingproductname && additionalTitle && titlepage) ? `${titlepage} Product ${mailingproductname} - ${additionalTitle.find(val => val.menu === menu).title}` : '';
        const titleModal = (showpriceform) ? `${titlePricePage} Price` : (showvendorform) ? `${titleVendorPage} Vendor` : null;
        const titlecount = title.length;
        const windowWidth = window.innerWidth;

        if (formrender && mailingproductname) {
            return (
                <Row>
                    <Row>
                        <Col xs={24} sm={((menu === 'price') || (menu === 'vendor')) ? 18 : 24} md={((menu === 'price') || (menu === 'vendor')) ? 19 : 24} lg={21}>
                            <Title level={3}>
                                <Button htmlType={'html'} url={`/mailing-product`} shape='circle' icon='left' style={{ marginRight: 15 }} />
                                {
                                    (title && ((menu === 'price') || (menu === 'vendor'))) ?
                                        <Tooltip title={title}>
                                            {
                                                (windowWidth > 950) ? title : ((windowWidth < 950 && windowWidth > 850) && titlecount <= 48) ? title : ((windowWidth < 950 && windowWidth > 850) && titlecount > 48) ? `${title.substring(0, 48)} ...` :
                                                    ((windowWidth < 850 && windowWidth > 730) && (titlecount <= 33 && titlecount > 25)) ? title : ((windowWidth < 850 && windowWidth > 730) && (titlecount > 33 && titlecount <= 48)) ? `${title.substring(0, 33)} ...` :
                                                        ((windowWidth < 730 && windowWidth > 480) && (titlecount <= 25 && titlecount > 17)) ? title : ((windowWidth < 730 && windowWidth > 480) && (titlecount > 25 && titlecount <= 33)) ? `${title.substring(0, 25)} ...` :
                                                            `${title.substring(0, 18)} ...`
                                            }
                                        </Tooltip> : title
                                }
                            </Title>
                        </Col>
                        {
                            (menu === 'price') ? <Col xs={24} sm={6} md={5} lg={3} style={{ marginBottom: 10 }}>
                                <Button htmlType='button' type='primary' size='default' label='Add New Price' onClick={(e) => this.handleVisible(true, 'showpriceform')} />
                            </Col> : (menu === 'vendor') ? <Col xs={24} sm={6} md={5} lg={3} style={{ marginBottom: 10 }}>
                                <Button htmlType='button' type='primary' size='default' label='Add New Vendor' onClick={(e) => this.handleVisible(true, 'showvendorform')} />
                            </Col> : null
                        }
                        <Divider />
                    </Row>

                    <Modal visible={showpriceform || showvendorform} title={titleModal} onCancel={(e) => this.handleVisible(false, (showpriceform) ? 'showpriceform' : 'showvendorform')} footer={null} destroyOnClose={true} width={680}>
                        {(showpriceform) ? <PriceForm menucode={menucode} prefixmenuname={prefixmenuname} mailingproductpriceid={mailingproductpriceid} actionspage={actionspage} handleClose={(e) => this.handleVisible(false, 'showpriceform')}
                            mailingproductcode={this.props.match.params.ID} handleSavePrice={(e) => this.handleVisible(false, 'showpriceform')} handleRefreshTable={() => { this.componentPrice.handleRefreshTable() }} period={period} variants={variants} /> :
                            (showvendorform) ? <VendorForm menucode={menucode} prefixmenuname={prefixmenuname} mailingproductvendorid={mailingproductvendorid} actionspage={actionspage} handleClose={(e) => this.handleVisible(false, 'showvendorform')}
                                mailingproductcode={this.props.match.params.ID} handleSavePrice={(e) => this.handleVisible(false, 'showvendorform')} handleRefreshTable={() => { this.componentVendor.handleRefreshTable() }} producttype={producttype} period={period} /> : null
                        }
                    </Modal>

                    <Layout style={{ background: '#fff' }}>
                        <Affix offsetTop={40}>
                            <MailingProductSider onRef={(e) => (this.componentPromoManagementSider = e)} mailingproductcode={mailingproductcode} {...this.props} />
                        </Affix>
                        <Content style={{ padding: '0 24px', overflow: 'hidden' }}>
                            {(Object.keys(dataproduct).length !== 0) ? (menu === 'basic-info') ?
                                <BasicInfo {...this.props} dataproduct={dataproduct} /> : (menu === 'price') ?
                                    <Price ref={(e) => (this.componentPrice = e)} {...this.props} dataproduct={dataproduct} variants={variants} period={period} /> : (menu === 'vendor') ?
                                        <Vendor ref={(e) => (this.componentVendor = e)} {...this.props} dataproduct={dataproduct} period={period} producttype={producttype} /> :
                                        <CancelUpdateFee {...this.props} dataproduct={dataproduct} /> :
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