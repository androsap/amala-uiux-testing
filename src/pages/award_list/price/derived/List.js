import React from 'react';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Alert, Button, SearchForm, TableBase } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Layout } from 'antd';
import { YesNoOptions } from '../../../../data';
import moment from 'moment';

import CityPair from '../../../distance_range/CityPair';

const { Title } = Typography;
const { Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            distancerangename: null,
            route: null,
            bottomrange: null,
            upperrange: null,
            airlinecode: null
        };
    }

    componentDidMount() {
        document.title = "Manage Award Price | Loyalty Management System";
    }

    deleteData(pricederivedcode) {
        let url = api.url.awardprice3.delete;
        let data = { pricederivedcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    handleChangePage = (displayformpage, pricederivedcode) => {
        this.props.changePage({ displayformpage, pricederivedcode })
    }

    handleOpenModal = (distancerangename, route, bottomrange, upperrange, airlinecode) => {
        this.setState({ visible: true, distancerangename, route, bottomrange, upperrange, airlinecode });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { menucode, prefixmenuname, permission, awardtypecode } = this.props;
        const { visible, distancerangename, route, bottomrange, upperrange, airlinecode } = this.state;
        const { usermenu } = permission;

        let configurationTable = {
            url: api.url.awardprice3.list,
            sort: { createddate: 'desc' },
            criteria: { awardcode: this.props.awardcode },
            columns: [
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true },
                {
                    type: 'html', title: 'Booking Class - Compartment', dataIndex: 'bookingclasscode', sorter: true,
                    render: (value, row, index) => { return row.bookingclasscode + "-" + row.compartmentcode }
                },
                {
                    type: 'html', title: 'Distance Range / City Pair', dataIndex: 'pricecalc', sorter: true,
                    render: (value, row, index) => { return (row.pricecalc === 'DISTANCERANGE') ? (row.distancerangename !== undefined) ? row.distancerangename : "" : (row.origin !== undefined && row.destination !== undefined) ? row.origin + "-" + row.destination : "" }
                },
                {
                    type: 'html', title: 'Paid Booking Class', dataIndex: 'paidbookingclasscode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Low Season Price', dataIndex: 'onewaypricelow', sorter: true },
                { type: 'field', title: 'Peak Season Price', dataIndex: 'onewaypricepeak', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    width: '15%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" onClick={() => this.handleChangePage('form', row.pricederivedcode)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                {/* {
                                    (row.pricecalc === 'DISTANCERANGE') ?
                                        <Button htmlType="button" type="primary" size="small" label="City Pair" onClick={() => this.handleOpenModal(row.distancerangename, row.route, row.bottomrange, row.upperrange, row.airlinecode)} /> : null
                                } */}
                                {
                                    (usermenu[menucode][prefixmenuname + '_UPDATE']) ?
                                        <Button htmlType="button" size="small" label="Delete" type="danger" onClick={() => this.deleteData(row.pricederivedcode)} /> : null
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        let configurationSearchForm = [
            { labeltext: "Airline Code", datafield: "airlinecode", type: 'text', placeholder: 'Airline Code', showDefaultSearch: true },
            { labeltext: "Date", datafield: "currentdate", type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true },
            { labeltext: "Booking Class", datafield: "bookingclasscode", type: 'text', placeholder: 'Booking Class', showDefaultSearch: true },
            { labeltext: "Compartment", datafield: "compartmentcode", type: 'text', placeholder: 'Compartment', showDefaultSearch: false },
            { labeltext: "Distance Range", datafield: "distancerangename", type: 'text', placeholder: 'Distance Range', showDefaultSearch: false },
            { labeltext: "Origin Airport", datafield: "origin", type: 'text', placeholder: 'Origin Airport', showDefaultSearch: false },
            { labeltext: "Destination Airport", datafield: "destination", type: 'text', placeholder: 'Destination Airport', showDefaultSearch: false },
            { labeltext: "Low Season Price", datafield: "onewaypricelow", type: 'text', placeholder: 'Low Season Price', showDefaultSearch: false },
            { labeltext: "Peak Season Price", datafield: "onewaypricepeak", type: 'text', placeholder: 'Peak Season Price', showDefaultSearch: false },
            { labeltext: "Paid Booking Class", datafield: "paidbookingclasscode", type: 'text', placeholder: 'Paid Booking Class', showDefaultSearch: false },
        ];

        if (awardtypecode !== 'UPGRADE') {
            configurationSearchForm = configurationSearchForm.filter(obj => obj.datafield !== 'paidbookingclasscode');
            configurationTable = { ...configurationTable, columns: configurationTable.columns.filter(obj => obj.dataIndex !== 'paidbookingclasscode') }
        };

        return (
            <React.Fragment>
                <Modal visible={visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                    <CityPair distancerangename={distancerangename} route={route} bottomrange={bottomrange} upperrange={upperrange} airlinecode={airlinecode} closeModalRefresh={this.handleCloseModalRefresh} />
                </Modal>
                <Content style={{ margin: '16px 0', padding: '24px', background: '#fff', }}>
                    <Row>
                        <Col xs={24} xl={21}>
                            <Title level={4}>Manage Price</Title>
                        </Col>
                        <Col xs={24} xl={3} >
                            {(usermenu[menucode][prefixmenuname + '_UPDATE']) ? <Button htmlType="button" type="primary" size="default" label="Add New" onClick={() => this.handleChangePage('form')} /> : null}
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Content>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));