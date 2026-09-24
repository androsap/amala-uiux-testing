import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { Alert, MultiInputSelect, RadioButton, DateRangeBase, RegionSelect, AirportSelect, CountrySelect, Button, InputNumber, CheckboxBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Select, Spin } from 'antd';
import moment from 'moment';
import { Route, Type } from '../../../../data';

const { Option } = Select;

class Air extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 'create',
            isLoading: false,
            route: '',
            type: '',
            ori: '',
            des: '',
            data: [],
            orides: [],
            airline: [],
            subclass: [],
            compartment: [],
            dataairline: [],
            datasubclass: [],
            datacompartment: [],
            desfielddisabled: true,
            typefielddisabled: true,
            airlinefielddisabled: false,
            compartmentfielddisabled: true,
            subclassfielddisabled: true,
            allairlinefielddisabled: false,
        }
    }

    componentDidMount() {
        document.title = ' Add New Redemption Promo | Loyalty Management System ';
        this.getDetail();
    };

    async getDetail() {
        const { promocatalogcode } = this.props;
        this.setState({ isLoading: true, airline: [], compartment: [], subclass: [], orides: [] });
        this.retrieveAirline();
        await DetailRequest(api.url.redemptionpromo.criteriacategory.getcriteriacategory, { promocatalogcode }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {

                let data = result.find(o => o.criteriatypecode === 'AIR');
                let passenger = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Passenger').data;
                let flightnumber = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Flight Number').data;
                let date = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Date Period Flown Date').data;
                let dateperiodflowndate = (date === undefined) ? undefined : (date.length < 1) ? undefined : [moment((date[0]).split(',')[0]), moment((date[0]).split(',')[1])];
                let compartment = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Compartment').data;
                let airlinecode = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Airline Code').data;
                let subclass = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Booking Class').data;
                let oairport = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Airport').data;
                let oregion = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Region').data;
                let ocountry = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Country').data;
                let dairport = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Destination Airport').data;
                let dregion = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Destination Region').data;
                let dcountry = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Destination Country').data;
                let odairport = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Destination Airport').data;
                let odregion = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Destination Region').data;
                let odcountry = (data === undefined) ? undefined : data.promocategory.find(o => o.category === 'Origin Destination Country').data;

                let route, type;
                if (oairport !== undefined || oregion !== undefined || ocountry !== undefined || dairport !== undefined || dregion !== undefined || dcountry !== undefined || odairport !== undefined || odregion !== undefined || odcountry !== undefined) {
                    route = (oairport.length !== 0 || dairport.length !== 0 || odairport.length !== 0) ? 'Airport' : ((oregion.length !== 0 || dregion.length !== 0 || odregion.length !== 0) ? 'Region' : ((ocountry.length !== 0 || dcountry.length !== 0 || odcountry.length !== 0) ? 'Country' : undefined));
                    type = (oairport.length !== 0 || oregion.length !== 0 || ocountry.length !== 0) ? 'Origin' : ((dairport.length !== 0 || dregion.length !== 0 || dcountry.length !== 0) ? 'Destination' : ((odairport.length !== 0 || odregion.length !== 0 || odcountry.length !== 0) ? 'Origin-Destination' : undefined));
                };
                let routedata = (data === undefined) ? undefined : (odairport.length !== 0) ? this.state.orides.concat(odairport) : ((odregion.length !== 0) ? this.state.orides.concat(odregion) : ((odcountry.length !== 0) ? this.state.orides.concat(odcountry) : undefined));
                let datafield = { airlinecode, compartment, subclass, flightnumber, dateperiodflowndate, passenger, route, type, routedata, oairport, oregion, ocountry, dairport, dregion, dcountry };
                this.props.form.setFieldsValue(datafield);

                let typefielddisabled = (type === null) ? true : (route !== undefined ? false : true);
                let action = (data === undefined) ? 'create' : 'update';
                if (airlinecode !== undefined) { this.retrieveCompartment(airlinecode) };
                if (compartment !== undefined) { this.retrieveSubclass(compartment) };
                setTimeout(() => {
                    let allairline = (data === undefined) ? false : (this.state.airline.flat().length === airlinecode.length && airlinecode.length > 0) ? true : false;
                    let allcompartment = (data === undefined) ? false : (this.state.compartment.flat(2).length === compartment.length && compartment.length > 0) ? true : false;
                    let allsubclass = (data === undefined) ? false : (this.state.subclass.flat(2).length === subclass.length && subclass.length > 0) ? true : false;
                    let compartmentfielddisabled = (airlinecode === undefined || airlinecode.length === 0) ? true : false;
                    let subclassfielddisabled = (compartment === undefined || compartment.length === 0 || airlinecode === undefined || airlinecode.length === 0) ? true : false;
                    let allcompartmentfielddisabled = (data === undefined) ? false : airlinecode.length === 0 ? true : compartment.length === 0 ? false : this.state.compartment.flat(2).length !== compartment.length ? false : !allcompartment;
                    let allsubclassfielddisabled = (data === undefined) ? false : airlinecode.length === 0 ? true : compartment.length === 0 ? true : subclass.length === 0 ? false : this.state.subclass.flat(2).length !== subclass.length ? false : !allsubclass;

                    this.setState({
                        data: result, dataairline: airlinecode === undefined ? [] : airlinecode, datacompartment: compartment === undefined ? [] : compartment, datasubclass: subclass === undefined ? [] : subclass, route, type, allairline,
                        allcompartment, allsubclass, compartmentfielddisabled, subclassfielddisabled, allcompartmentfielddisabled, allsubclassfielddisabled, action, orides: routedata === undefined ? [] : routedata, typefielddisabled,
                    });
                    this.criteriaTypeDisabledField(compartmentfielddisabled, subclassfielddisabled, allcompartmentfielddisabled, allsubclassfielddisabled);
                }, 1000);
            } else {
                this.setState({ typefielddisabled: false, compartmentfielddisabled: true, subclassfielddisabled: true, allcompartmentfielddisabled: true, allsubclassfielddisabled: true });
            }
        });
        this.componentOriAirportSelect.retrieveData();
        this.componentDesAirportSelect.retrieveData();
        this.componentOriCountrySelect.retrieveData();
        this.componentDesCountrySelect.retrieveData();
        this.componentOriRegionSelect.retrieveData();
        this.componentDesRegionSelect.retrieveData();
        setTimeout(() => { this.setState({ isLoading: false }) }, 1500);
    };

    criteriaTypeDisabledField = (compartmentfield, subclassfield, allcompartmentfield, allsubclassfield) => {
        let airlinecategory = this.props.dataCategory.find(o => o.categorytypecode === 'airlinecode').active;
        let compartmentcategory = this.props.dataCategory.find(o => o.categorytypecode === 'compartment').active;
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let airlinefielddisabled = this.props.airdisabled ? true : (airlinecategory) ? this.state.airlinefielddisabled : true;
        let compartmentfielddisabled = this.props.airdisabled ? true : !(airlinecategory) ? true : (compartmentcategory) ? compartmentfield : true;
        let subclassfielddisabled = this.props.airdisabled ? true : !(airlinecategory) ? true : !(compartmentcategory) ? true : (subclasscategory) ? subclassfield : true;
        let allairlinefielddisabled = this.props.airdisabled ? true : (airlinecategory) ? this.state.allairlinefielddisabled : true;
        let allcompartmentfielddisabled = this.props.airdisabled ? true : !(airlinecategory) ? true : (compartmentcategory) ? allcompartmentfield : true;
        let allsubclassfielddisabled = this.props.airdisabled ? true : !(airlinecategory) ? true : !(compartmentcategory) ? true : (subclasscategory) ? allsubclassfield : true;
        let flightnumberdisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'flightnumber').active === true) ? false : true;
        let oairportdisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'oairport').active === true) ? false : true;
        let dairportdisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'dairport').active === true) ? false : true;
        let ocountrydisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'ocountry').active === true) ? false : true;
        let dcountrydisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'dcountry').active === true) ? false : true;
        let oregiondisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'oregion').active === true) ? false : true;
        let dregiondisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'dregion').active === true) ? false : true;
        let odairportdisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'odairport').active === true) ? false : true;
        let odcountrydisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'odcountry').active === true) ? false : true;
        let odregiondisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'odregion').active === true) ? false : true;
        let flowndatedisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'flowndate').active === true) ? false : true;
        let passengerdisabled = this.props.airdisabled ? true : (this.props.dataCategory.find(o => o.categorytypecode === 'passenger').active === true) ? false : true;

        this.setState({
            airlinefielddisabled, compartmentfielddisabled, subclassfielddisabled, allairlinefielddisabled, allcompartmentfielddisabled, allsubclassfielddisabled, flightnumberdisabled, oairportdisabled,
            dairportdisabled, ocountrydisabled, dcountrydisabled, oregiondisabled, dregiondisabled, odairportdisabled, odcountrydisabled, odregiondisabled, flowndatedisabled, passengerdisabled
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        const { action, type, route } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let dataList = {};
                let dataair = [];
                let data = (action === 'update') ? this.state.data.find(o => o.criteriatypecode === 'AIR') : undefined;

                let airlinecode = {}, compartment = {}, subclass = {}, passenger = {}, flightnumber = {}, dateperiodflowndate = {},
                    origindestinationairport = {}, originairport = {}, destinationairport = {}, origindestinationcountry = {}, origincountry = {},
                    destinationcountry = {}, origindestinationregion = {}, originregion = {}, destinationregion = {};

                if (action === 'update') {
                    airlinecode['promocategorycode'] = (data.promocategory.find(o => o.category === 'Airline Code').promocategorycode);
                    airlinecode['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Airline Code').promocriteriacode);
                    compartment['promocategorycode'] = (data.promocategory.find(o => o.category === 'Compartment').promocategorycode);
                    compartment['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Compartment').promocriteriacode);
                    subclass['promocategorycode'] = (data.promocategory.find(o => o.category === 'Booking Class').promocategorycode);
                    subclass['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Booking Class').promocriteriacode);
                    passenger['promocategorycode'] = (data.promocategory.find(o => o.category === 'Passenger').promocategorycode);
                    passenger['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Passenger').promocriteriacode);
                    flightnumber['promocategorycode'] = (data.promocategory.find(o => o.category === 'Flight Number').promocategorycode);
                    flightnumber['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Flight Number').promocriteriacode);
                    dateperiodflowndate['promocategorycode'] = (data.promocategory.find(o => o.category === 'Date Period Flown Date').promocategorycode);
                    dateperiodflowndate['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Date Period Flown Date').promocriteriacode);
                    origindestinationairport['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Destination Airport').promocategorycode);
                    origindestinationairport['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Destination Airport').promocriteriacode);
                    originairport['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Airport').promocategorycode);
                    originairport['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Airport').promocriteriacode);
                    destinationairport['promocategorycode'] = (data.promocategory.find(o => o.category === 'Destination Airport').promocategorycode);
                    destinationairport['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Destination Airport').promocriteriacode);
                    origindestinationcountry['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Destination Country').promocategorycode);
                    origindestinationcountry['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Destination Country').promocriteriacode);
                    origincountry['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Country').promocategorycode);
                    origincountry['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Country').promocriteriacode);
                    destinationcountry['promocategorycode'] = (data.promocategory.find(o => o.category === 'Destination Country').promocategorycode);
                    destinationcountry['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Destination Country').promocriteriacode);
                    origindestinationregion['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Destination Region').promocategorycode);
                    origindestinationregion['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Destination Region').promocriteriacode);
                    originregion['promocategorycode'] = (data.promocategory.find(o => o.category === 'Origin Region').promocategorycode);
                    originregion['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Origin Region').promocriteriacode);
                    destinationregion['promocategorycode'] = (data.promocategory.find(o => o.category === 'Destination Region').promocategorycode);
                    destinationregion['promocriteriacode'] = (data.promocategory.find(o => o.category === 'Destination Region').promocriteriacode);
                };
                airlinecode['categorytypecode'] = 'airlinecode';
                airlinecode['data'] = (values.airlinecode === undefined) ? [undefined] : (values.airlinecode.length === 0) ? [undefined] : values.airlinecode;
                compartment['categorytypecode'] = 'compartment';
                compartment['data'] = (values.compartment === undefined) ? [undefined] : (values.compartment.length === 0) ? [undefined] : values.compartment;
                subclass['categorytypecode'] = 'bookingclass';
                subclass['data'] = (values.subclass === undefined) ? [undefined] : (values.subclass.length === 0) ? [undefined] : values.subclass;
                passenger['categorytypecode'] = 'passenger';
                passenger['data'] = (values.passenger === undefined || values.passenger === null) ? [undefined] : (values.passenger.length === 0) ? [undefined] : (typeof values.passenger === 'number') ? [values.passenger] : values.passenger;
                flightnumber['categorytypecode'] = 'flightnumber';
                flightnumber['data'] = (values.flightnumber === undefined) ? [undefined] : (values.flightnumber.length === 0) ? [undefined] : values.flightnumber;
                dateperiodflowndate['categorytypecode'] = 'flowndate';
                dateperiodflowndate['data'] = ((values.dateperiodflowndate === undefined) ? [undefined] : values.dateperiodflowndate.length === 0) ? [undefined] : [`${moment(values.dateperiodflowndate[0]).format('YYYY-MM-DD')},${moment(values.dateperiodflowndate[1]).format('YYYY-MM-DD')}`];
                origindestinationairport['categorytypecode'] = 'odairport';
                origindestinationairport['data'] = values.routedata === undefined ? [undefined] : (values.routedata.length === 0) ? [undefined] : (type === 'Origin-Destination' && route === 'Airport') ? ((typeof values.routedata === 'string') ? [values.routedata] : values.routedata) : [undefined];
                originairport['categorytypecode'] = 'oairport';
                originairport['data'] = values.oairport === undefined ? [undefined] : (values.oairport.length === 0) ? [undefined] : type === 'Origin' ? values.oairport : [undefined];
                destinationairport['categorytypecode'] = 'dairport';
                destinationairport['data'] = values.dairport === undefined ? [undefined] : (values.dairport.length === 0) ? [undefined] : type === 'Destination' ? values.dairport : [undefined];
                origindestinationcountry['categorytypecode'] = 'odcountry';
                origindestinationcountry['data'] = values.routedata === undefined ? [undefined] : (values.routedata.length === 0) ? [undefined] : (type === 'Origin-Destination' && route === 'Country') ? ((typeof values.routedata === 'string') ? [values.routedata] : values.routedata) : [undefined];
                origincountry['categorytypecode'] = 'ocountry';
                origincountry['data'] = values.ocountry === undefined ? [undefined] : (values.ocountry.length === 0) ? [undefined] : type === 'Origin' ? values.ocountry : [undefined];
                destinationcountry['categorytypecode'] = 'dcountry';
                destinationcountry['data'] = values.dcountry === undefined ? [undefined] : (values.dcountry.length === 0) ? [undefined] : type === 'Destination' ? values.dcountry : [undefined];
                origindestinationregion['categorytypecode'] = 'odregion';
                origindestinationregion['data'] = values.routedata === undefined ? [undefined] : (values.routedata.length === 0) ? [undefined] : (type === 'Origin-Destination' && route === 'Region') ? ((typeof values.routedata === 'string') ? [values.routedata] : values.routedata) : [undefined];
                originregion['categorytypecode'] = 'oregion';
                originregion['data'] = values.oregion === undefined ? [undefined] : (values.oregion.length === 0) ? [undefined] : type === 'Origin' ? values.oregion : [undefined];
                destinationregion['categorytypecode'] = 'dregion';
                destinationregion['data'] = values.dregion === undefined ? [undefined] : (values.dregion.length === 0) ? [undefined] : type === 'Destination' ? values.dregion : [undefined];

                dataair.push(destinationcountry, origincountry, origindestinationcountry, destinationairport, originairport, origindestinationairport,
                    dateperiodflowndate, flightnumber, passenger, subclass, compartment, airlinecode, origindestinationregion, originregion, destinationregion);
                let promocriteria = Object.assign({ criteriatypecode: 'AIR', promocategory: dataair });
                if (action === 'create') {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteria: [promocriteria] });
                } else {
                    dataList = Object.assign({ promocatalogcode: this.props.promocatalogcode, promocriteriacode: data.promocriteriacode, criteriatypecode: 'AIR', promocategory: dataair });
                }

                let message = '';
                let url = '';
                if (action === 'create') {
                    message = 'New data has been created';
                    url = api.url.redemptionpromo.criteriacategory.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.redemptionpromo.criteriacategory.update;
                }
                var fileRequest = new FormData();
                var file = null;
                fileRequest.append('file', file);
                SaveRequest(url, dataList, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        Alert.success((responsemessage) ? responsemessage : message);
                    } else {
                        Alert.error(responsemessage);
                    }
                });
                setTimeout(() => {
                    this.getDetail();
                    this.setState({ action: 'update', isLoading: false });
                }, 1000);
            }
        });
    };

    //function component
    onChangeAirline = (value) => {
        const { datacompartment, datasubclass, allcompartment, allsubclass, airline } = this.state;
        let compartmentcategory = this.props.dataCategory.find(o => o.categorytypecode === 'compartment').active;
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let allcompartmentfielddisabled = (value.length === 0) ? true : compartmentcategory ? false : true;
        let resetform = (compartmentcategory && subclasscategory) ? ['compartment', 'subclass', 'allcompartment', 'allsubclass', []] :
            (!compartmentcategory && subclasscategory) ? ['subclass', 'allsubclass', []] : (compartmentcategory && !subclasscategory) ? ['compartment', 'allcompartment', []] : ['', []];
        this.props.form.resetFields(resetform);
        let allairline = (airline.flat().length === value.length && value.length > 0) ? true : false;
        this.props.form.setFieldsValue({ allairline });

        this.setState({
            dataairline: value, isLoading: true, allcompartment: compartmentcategory ? false : allcompartment, allsubclass: subclasscategory ? false : allsubclass, subclassfielddisabled: true,
            allcompartmentfielddisabled, allsubclassfielddisabled: true, datacompartment: compartmentcategory ? [] : datacompartment, datasubclass: subclasscategory ? [] : datasubclass,
        });
        this.retrieveCompartment(value);
        setTimeout(() => { this.setState({ isLoading: false }) }, 500);
    };

    onChangeCompartment = (value) => {
        const { allsubclass, datasubclass, compartment } = this.state;
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let allsubclassfielddisabled = (value.length === 0) ? true : subclasscategory ? false : true;
        let allcompartment = (compartment.flat().length === value.length && value.length > 0) ? true : false;
        this.props.form.setFieldsValue({ allcompartment });
        if (subclasscategory) { this.props.form.resetFields(['subclass', 'allsubclass', []]) } else { this.props.form.resetFields(['', []]) };
        this.setState({ datacompartment: value, isLoading: true, allsubclass: subclasscategory ? false : allsubclass, allsubclassfielddisabled, datasubclass: subclasscategory ? [] : datasubclass });
        this.retrieveSubclass(value);
        setTimeout(() => { this.setState({ isLoading: false }) }, 500);
    };

    onChangeSubClass = (value) => {
        let allsubclass = (this.state.subclass.flat().length === value.length && value.length > 0) ? true : false;
        this.props.form.setFieldsValue({ allsubclass });

        this.setState({ isLoading: true, datasubclass: value });
        setTimeout(() => { this.setState({ isLoading: false }) }, 500);
    };

    onChangeRoute = (value) => {
        let orides = this.state.orides;
        if (orides !== undefined) { orides = undefined };
        this.setState({ orides, route: value.target.value, typefielddisabled: false });
        this.props.form.resetFields(['routedata', 'oairport', 'oregion', 'ocountry', 'dairport', 'dregion', 'dcountry', []]);
    };

    onChangeType = (value) => {
        let orides = this.state.orides;
        if (orides !== undefined) { orides = undefined };
        this.setState({ orides, type: value.target.value });
        this.props.form.resetFields(['routedata', 'oairport', 'oregion', 'ocountry', 'dairport', 'dregion', 'dcountry', []]);
    };

    onChangeOrigin = (value) => {
        if (value === undefined) {
            this.props.form.resetFields(['dairport', 'dregion', 'dcountry', []]);
        } else {
            this.setState({ desfielddisabled: false, ori: value });
        }
    };

    onChangeDestination = (value) => {
        const { orides, ori, type } = this.state;
        if (value !== undefined && type === 'Origin-Destination') {
            if (orides !== undefined) {
                this.setState({ orides: [`${ori},${value}`].concat(orides), desfielddisabled: true });
                this.props.form.setFieldsValue({ routedata: [`${ori},${value}`].concat(orides) });
                this.props.getDetail();
            } else {
                this.setState({ orides: `${ori},${value}`, desfielddisabled: true });
                this.props.form.setFieldsValue({ routedata: `${ori},${value}` });
            }
        };
    };

    onChangeRouteData = (value) => {
        this.setState({ orides: value });
    };

    retrieveAirline = () => {
        let airline = this.state.airline;
        RetrieveRequest(api.url.airline.list, { active: true }, { limit: -1, page: 1 }, [], { airlinename: 'asc' }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                var options = response.result.map(({ airlinename, airlinecode }) => {
                    return {
                        label: airlinename,
                        value: airlinecode
                    };
                });
                airline.push(options);
                this.setState({ airline });
            }
        });
    };

    retrieveCompartment = (value) => {
        let compartmentcategory = this.props.dataCategory.find(o => o.categorytypecode === 'compartment').active;
        let compartment = [];
        for (let i = 0; i < value.length; i++) {
            RetrieveRequest(api.url.compartment.list, { airlinecode: value[i] }, { limit: -1, page: 1 }, [], { compartmentcode: 'asc' }).then((response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    var options = response.result.map(({ airlinecode, airlinename, compartmentcode, compartmentname }) => {
                        return {
                            label: `(${airlinename}) ${compartmentname}`,
                            value: `${airlinecode},${compartmentcode}`
                        };
                    });
                    compartment.push(options);
                    this.setState({ compartment, compartmentfielddisabled: compartmentcategory ? false : true });
                }
            });
        };
    };

    retrieveSubclass = (value) => {
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let subclass = [];
        for (let i = 0; i < value.length; i++) {
            RetrieveRequest(api.url.subclass.list, { airlinecode: value[i].split(',')[0], compartmentcode: value[i].split(',')[1], spendmiles: true }, { limit: -1, page: 1 }, [], { subclasscode: 'asc' }).then((response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    var options = response.result.map(({ subclasscode, compartmentname, compartmentcode, airlinename, airlinecode }) => {
                        return {
                            label: `(${airlinename}-${compartmentname}) ${subclasscode}`,
                            value: `${airlinecode},${compartmentcode},${subclasscode}`,
                        };
                    });
                    subclass.push(options);
                    this.setState({ subclass, subclassfielddisabled: subclasscategory ? false : true });
                }
            });
        };
    };

    handleAllAirline = (event) => {
        this.setState({ isLoading: true, allairline: event.target.checked });
        const { airline, datacompartment, datasubclass, allcompartment, allsubclass } = this.state;
        let compartmentcategory = this.props.dataCategory.find(o => o.categorytypecode === 'compartment').active;
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let allairline = [];
        for (let i = 0; i < airline.length; i++) {
            for (let j = 0; j < airline[i].length; j++) {
                allairline.push(airline[i][j].value);
            }
        }
        if (event.target.checked) {
            this.props.form.setFieldsValue({ airlinecode: allairline });
            this.onChangeAirline(allairline);
            this.setState({ compartmentfielddisabled: compartmentcategory ? false : true, allcompartmentfielddisabled: compartmentcategory ? false : true });
        } else {
            let resetform = (compartmentcategory && subclasscategory) ? ['airlinecode', 'compartment', 'subclass', 'allcompartment', 'allsubclass', []] :
                (!compartmentcategory && subclasscategory) ? ['airlinecode', 'subclass', 'allsubclass', []] : (compartmentcategory && !subclasscategory) ? ['airlinecode', 'compartment', 'allcompartment', []] : ['airlinecode', []];
            this.props.form.resetFields(resetform)
            this.setState({
                airlinefielddisabled: false, subclassfielddisabled: true, compartmentfielddisabled: true, allcompartment: compartmentcategory ? false : allcompartment, allsubclass: subclasscategory ? false : allsubclass,
                allcompartmentfielddisabled: true, allsubclassfielddisabled: true, dataairline: [], datacompartment: compartmentcategory ? [] : datacompartment, datasubclass: subclasscategory ? [] : datasubclass
            });
        }
        setTimeout(() => { this.setState({ isLoading: false }) }, 1700);
    };

    handleAllCompartment = (event) => {
        this.setState({ isLoading: true, allcompartment: event.target.checked });
        const { compartment, allsubclass, datasubclass, datacompartment } = this.state;
        let compartmentcategory = this.props.dataCategory.find(o => o.categorytypecode === 'compartment').active;
        let subclasscategory = this.props.dataCategory.find(o => o.categorytypecode === 'bookingclass').active;
        let allcompartment = [];
        for (let i = 0; i < compartment.length; i++) {
            for (let j = 0; j < compartment[i].length; j++) {
                allcompartment.push(compartment[i][j].value);
            }
        }
        if (event.target.checked) {
            this.props.form.setFieldsValue({ compartment: allcompartment });
            this.onChangeCompartment(allcompartment);
            this.setState({ subclassfielddisabled: subclasscategory ? false : true, allsubclassfielddisabled: subclasscategory ? false : true })
        } else {
            if (subclasscategory) { this.props.form.resetFields(['compartment', 'subclass', 'allsubclass', []]) } else { this.props.form.resetFields(['compartment', []]) }
            this.setState({ compartmentfielddisabled: false, subclassfielddisabled: true, allsubclassfielddisabled: true, allsubclass: subclasscategory ? false : allsubclass, datasubclass: subclasscategory ? [] : datasubclass, datacompartment: compartmentcategory ? [] : datacompartment });
        };
        setTimeout(() => { this.setState({ isLoading: false }) }, 1700);
    };

    handleAllSubclass = (event) => {
        this.setState({ isLoading: true, allsubclass: event.target.checked });
        const { subclass } = this.state;
        let allsubclass = [];
        for (let i = 0; i < subclass.length; i++) {
            for (let j = 0; j < subclass[i].length; j++) {
                allsubclass.push(subclass[i][j].value);
            }
        }
        if (event.target.checked) {
            this.props.form.setFieldsValue({ subclass: allsubclass });
            this.setState({ datasubclass: allsubclass });
        } else {
            this.props.form.resetFields(['subclass', 'allsubclass', []]);
            this.setState({ subclassfielddisabled: false, datasubclass: [] });
        }
        setTimeout(() => { this.setState({ isLoading: false }) }, 1700);
    };

    onBlurAirline = () => {
        let allairline = (this.state.airline.flat().length === this.state.dataairline.length && this.state.dataairline.length > 0) ? true : false;
        this.props.form.setFieldsValue({ allairline });
        this.setState({ allairline });
    };

    onBlurCompartment = () => {
        let allcompartment = (this.state.compartment.flat().length === this.state.datacompartment.length && this.state.datacompartment.length > 0) ? true : false
        this.props.form.setFieldsValue({ allcompartment });
        this.setState({ allcompartment });
    };

    onBlurSubclass = () => {
        let allsubclass = (this.state.subclass.flat().length === this.state.datasubclass.length && this.state.datasubclass.length > 0) ? true : false;
        this.props.form.setFieldsValue({ allsubclass });
        this.setState({ allsubclass });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { route, type, subclass, action, allairline, allcompartment, allsubclass, airline, compartment, dataairline, datacompartment, datasubclass, desfielddisabled, typefielddisabled, isLoading,
            airlinefielddisabled, compartmentfielddisabled, subclassfielddisabled, allairlinefielddisabled, allcompartmentfielddisabled, allsubclassfielddisabled, flightnumberdisabled, oairportdisabled,
            dairportdisabled, ocountrydisabled, dcountrydisabled, oregiondisabled, dregiondisabled, odairportdisabled, odcountrydisabled, odregiondisabled, flowndatedisabled, passengerdisabled } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        //options on compartment and subclass
        let airlineoptions = [];
        if (airline.length > 0) { airlineoptions = airline.flat(2) };
        let compartmentoptions = [];
        if (compartment.length > 0) { compartmentoptions = compartment.flat(2) };
        let subclassoptions = [];
        if (subclass.length > 0) { subclassoptions = subclass.flat(2) };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 24, offset: 1 }} xl={{ span: 24, offset: 1 }}>
                                <Col xs={16} sm={16} md={19} push={3}>
                                    <Form.Item label='Airline Code' labelCol={{ span: 6, pull: 1 }} wrapperCol={{ span: 18, pull: 1 }}>
                                        <div style={{ background: '#ffffff', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse', paddingRight: 10, paddingBottom: 1, height: dataairline.length > 4 ? '7em' : dataairline.length > 3 ? '5em' : '3em' }} >
                                            {getFieldDecorator('airlinecode')(
                                                <Select mode='multiple' placeholder={'Choose Airlinecode'} onChange={this.onChangeAirline} disabled={airlinefielddisabled} onBlur={this.onBlurAirline}>
                                                    {airlineoptions.map((obj, key) => (
                                                        <Option key={key} value={obj.value}>{obj.label}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col xs={8} sm={8} md={5} push={3}>
                                    <CheckboxBase form={this.props.form} initialvalue={allairline} datafield='allairline' onChange={this.handleAllAirline} disabled={allairlinefielddisabled} > Select All</CheckboxBase>
                                </Col>
                                <Col xs={16} sm={16} md={19} push={3}>
                                    <Form.Item label='Compartment' labelCol={{ span: 6, pull: 1 }} wrapperCol={{ span: 18, pull: 1 }}>
                                        <div style={{ background: '#ffffff', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse', paddingRight: 10, paddingBottom: 1, height: datacompartment.length > 4 ? '11em' : datacompartment.length > 3 ? '9em' : datacompartment.length > 2 ? '7em' : datacompartment.length > 1 ? '5em' : '3em' }}>
                                            {getFieldDecorator('compartment')(
                                                <Select mode='multiple' placeholder={'Choose Compartment'} onChange={this.onChangeCompartment} disabled={compartmentfielddisabled} onBlur={this.onBlurCompartment}>
                                                    {compartmentoptions.map((obj, key) => (
                                                        <Option key={key} value={obj.value}>{obj.label}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col xs={8} sm={8} md={5} push={3}>
                                    <CheckboxBase labelCol={{ span: 16 }} initialvalue={allcompartment} wrapperCol={{ span: 8 }} form={this.props.form} datafield='allcompartment' onChange={this.handleAllCompartment} disabled={allcompartmentfielddisabled}> Select All</CheckboxBase>
                                </Col>
                                <Col xs={16} sm={16} md={19} push={3}>
                                    <Form.Item label='Sub Class' labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                                        <div style={{ background: '#ffffff', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse', paddingRight: 10, paddingBottom: 1, height: datasubclass.length > 4 ? '11em' : datasubclass.length > 3 ? '9em' : datasubclass.length > 2 ? '7em' : datasubclass.length > 1 ? '5em' : '3em' }}>
                                            {getFieldDecorator('subclass')(
                                                <Select mode='multiple' placeholder={'Choose Sub Class'} onChange={this.onChangeSubClass} disabled={subclassfielddisabled} onBlur={this.onBlurSubclass}>
                                                    {subclassoptions.map((obj, key) => (
                                                        <Option key={key} value={obj.value}>{obj.label}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Col>
                                <Col xs={8} sm={8} md={5} push={3}>
                                    <CheckboxBase form={this.props.form} initialvalue={allsubclass} datafield='allsubclass' onChange={this.handleAllSubclass} disabled={allsubclassfielddisabled}> Select All</CheckboxBase>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 24 }} xl={{ span: 24 }}>
                                <MultiInputSelect form={this.props.form} mode={'tags'} labeltext='Flight Number' datafield='flightnumber' disabled={flightnumberdisabled} />
                                <RadioButton form={this.props.form} labeltext='Route' datafield='route' options={Route} onChange={this.onChangeRoute} />
                                <Row style={{ display: (typefielddisabled) ? 'none' : ((type !== '') ? 'block' : ((route !== '') ? 'block' : 'none')) }}>
                                    <RadioButton labelCol={{ span: 6, push: 2 }} wrapperCol={{ span: 18, push: 2 }} form={this.props.form} labeltext='Type' datafield='type' options={Type} onChange={this.onChangeType} />
                                </Row>
                                <Row style={{ display: (type === '') ? 'none' : 'block' }} disabled>
                                    <Row style={{ display: (type === 'Destination') ? 'none' : 'block' }}>
                                        <Row style={{ display: (route === 'Airport') ? 'block' : 'none' }}>
                                            <AirportSelect ref={(e) => { this.componentOriAirportSelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'} labeltext='Origin Airport'
                                                datafield={'oairport'} onChange={this.onChangeOrigin} disabled={type === 'Origin-Destination' ? odairportdisabled : oairportdisabled} />
                                        </Row>
                                        <Row style={{ display: (route === 'Country') ? 'block' : 'none' }}>
                                            <CountrySelect ref={(e) => { this.componentOriCountrySelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'}
                                                labeltext='Origin Country' datafield={'ocountry'} onChange={this.onChangeOrigin} disabled={type === 'Origin-Destination' ? odcountrydisabled : ocountrydisabled} />
                                        </Row>
                                        <Row style={{ display: (route === 'Region') ? 'block' : 'none' }}>
                                            <RegionSelect ref={(e) => { this.componentOriRegionSelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'}
                                                labeltext='Origin Region' datafield={'oregion'} onChange={this.onChangeOrigin} disabled={type === 'Origin-Destination' ? odregiondisabled : oregiondisabled} />
                                        </Row>
                                    </Row>
                                    <Row style={{ display: (type === 'Origin') ? 'none' : 'block' }}>
                                        <Row style={{ display: (route === 'Airport') ? 'block' : 'none' }}>
                                            <AirportSelect ref={(e) => { this.componentDesAirportSelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'}
                                                labeltext='Destination Airport' datafield={'dairport'} onChange={this.onChangeDestination} disabled={(type === 'Origin-Destination') ? desfielddisabled : dairportdisabled} />
                                        </Row>
                                        <Row style={{ display: (route === 'Country') ? 'block' : 'none' }}>
                                            <CountrySelect ref={(e) => { this.componentDesCountrySelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'}
                                                labeltext='Destination Country' datafield={'dcountry'} onChange={this.onChangeDestination} disabled={(type === 'Origin-Destination') ? desfielddisabled : dcountrydisabled} />
                                        </Row>
                                        <Row style={{ display: (route === 'Region') ? 'block' : 'none' }}>
                                            <RegionSelect ref={(e) => { this.componentDesRegionSelect = e }} form={this.props.form} mode={(type !== 'Origin-Destination') ? 'multiple' : 'default'}
                                                labeltext='Destination Region' datafield={'dregion'} onChange={this.onChangeDestination} disabled={(type === 'Origin-Destination') ? desfielddisabled : dregiondisabled} />
                                        </Row>
                                    </Row>
                                    <Col push={8}>
                                        <MultiInputSelect style={{ display: (type !== 'Origin-Destination') ? 'none' : 'block' }} form={this.props.form} mode={'tags'} datafield={'routedata'} handleChange={this.onChangeRouteData}
                                            disabled={(route === 'Airport' && type === 'Origin-Destination') ? odairportdisabled : (route === 'Country' && type === 'Origin-Destination') ? odcountrydisabled : odregiondisabled} />
                                    </Col>
                                </Row>
                                <DateRangeBase form={this.props.form} labeltext='Flown Date' datafield='dateperiodflowndate' placeholder={['Start Date', 'End Date']} minDate={moment()} disabled={flowndatedisabled} />
                                <InputNumber form={this.props.form} labeltext='No. of Passenger' datafield='passenger' min={1} max={5} disabled={passengerdisabled} />
                                <Row gutter={24} type='flex' justify='center' style={{ margin: 30 }}>
                                    <Button htmlType='submit' type='primary' label={(action === 'create' ? 'Save' : 'Submit')} onClick={this.saveAction} />
                                    <Button url='/promo-catalog' htmlType='link' type='default' label='Back' />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Row >
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(Air));