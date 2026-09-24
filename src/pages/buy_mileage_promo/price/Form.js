/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-26 03:39:06
 * @modify date 2020-07-26 03:39:06
 * @desc Buy Mileage Promo Price Form
 */
import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputNumber, CurrencySelect, DateRangeBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

// const prefixmenuname = 'PRICEPR';
// const menucode = 'PRICEPR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promopriceid: (this.props && this.props.promopriceid) ? this.props.promopriceid : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                airportiatacode: null,
                active: true
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        const { promopriceid, permission, prefixmenuname, menucode } = this.props;
        const actionsmasterpage = (this.props && this.props.actionspage) ? this.props.actionspage : null;
        const { usermenu } = permission;
        if (promopriceid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + "_UPDATE"])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail();
        } else {
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { datasource, promopriceid } = this.props;
        const detailprice = datasource.filter(obj => obj.promopriceid === promopriceid);

        const currencycode = (detailprice && detailprice[0] && detailprice[0]['currencycode']) ? detailprice[0]['currencycode'] : undefined;
        const price = (detailprice && detailprice[0] && detailprice[0]['price'] && (detailprice[0]['price'] !== undefined || detailprice[0]['price'] !== null)) ? detailprice[0]['price'] : undefined;
        const startdate = (detailprice && detailprice[0] && detailprice[0]['startdate']) ? moment(detailprice[0]['startdate']) : undefined;
        const enddate = (detailprice && detailprice[0] && detailprice[0]['enddate']) ? moment(detailprice[0]['enddate']) : undefined;
        const date = [startdate, enddate];

        const fieldsvalue = { currencycode, price, date };
        await this.props.form.setFieldsValue(fieldsvalue);
        this.setState({ isLoading: false });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                /* show loading */
                this.setState({ isLoading: true });
                const { actionspage } = this.state;
                const actionsmasterpage = (this.props && this.props.actionspage) ? this.props.actionspage : null;

                const currencycode = (input.currencycode) ? input.currencycode : null;
                const price = (input.price !== null && input.price !== undefined) ? Number.parseFloat(input.price, 0) : null;
                const startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                const enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;

                const data = { currencycode, price, startdate, enddate };

                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        /* generate dummy promopriceid */
                        data.promopriceid = moment().format("YYYYMMDDHHmmss");
                    } else if (actionspage === 'update') {
                        data.promopriceid = this.props.promopriceid;
                    }

                    this.props.handleSavePrice(actionspage, data);
                    /* hide loading */
                    this.setState({ isLoading: false });
                } else if (actionsmasterpage === 'update') {
                    data.promoid = this.props.promoid;

                    let message = '';
                    let url = '';
                    if (actionspage === 'create') {
                        message = 'New data has been created';
                        url = api.url.buymileagepromoprice.create;
                    } else {
                        data.promopriceid = this.props.promopriceid;
                        message = 'Data has been updated';
                        url = api.url.buymileagepromoprice.update;
                    }

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);

                            this.props.onCloseModal();
                            this.props.handleRefreshData();
                        } else {
                            Alert.error(responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    }

    render() {
        const { prefixmenuname, menucode } = this.props;
        const { actionspage, fielddisabled } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        const actionsmasterpage = (this.props && this.props.actionspage) ? this.props.actionspage : null;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const actioncode = (actionsmasterpage === 'create') ? "CREATE" : "UPDATE";
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <CurrencySelect ref={(e) => { this.componentCurrencySelect = e }} form={this.props.form} labeltext="Currency" datafield="currencycode" validationrules={['required']} disabled={specialfielddisabled} />
                                <InputNumber form={this.props.form} labeltext="Price" datafield="price" validationrules={['required']} step={0.1} disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment().add(1, 'days')} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> :
                                    (actionspage === 'update' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));