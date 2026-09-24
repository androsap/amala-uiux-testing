import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import { api } from '../../../config/Services';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            awardcode: props.id,
            formrender: true,
            loading: false,
            errors: {},
            criteria: {
                awardcode: props.id
            },
            paging: {
                page: 1,
                limit: -1
            },
            titlepage: 'Award Eligible Countries',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            dataList: [],
            isLoaded: false,
            country: null,
            optionsCountry: [],
            eligibleCountry: [],
            allcountries: null,
            generalfielddisabled: false
        };

        this.handleSelected = this.handleSelected.bind(this);
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = this.props.id;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit Award Eligible Countries';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Award Eligible Countries';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled });
        }
    }

    componentWillReceiveProps(props) {
        let targetSection = props.getStore().targetSection;
        if (targetSection === 'eligiblecountries') {
            this.setState({
                optionsCountry: [],
                eligibleCountry: [],
                criteria: { awardcode: props.id }
            }, 
            this.getOptionCountry(),
            this.checkPermission());
        }
    }


    getEligibleCountry(options) {
        const { paging, criteria, sort } = this.state;
        let url = api.url.awardeligiblecountries.list;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { result, status } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let allcountries = this.props.getStore().allcountries;
                let eligibleCountry = [];

                if (allcountries) {
                    /* LIST OF COUNTRY */
                    for (const field in options) {
                        eligibleCountry["country_" + options[field].regioncode + "_" + options[field].countrycode] = true;
                    }
                } else {
                    /* LIST OF COUNTRY */
                    for (const field in options) {
                        /* LIST OF ELIGIBLE COUNTRY */
                        for (const fieldEligibleCountry in result) {
                            if (result[fieldEligibleCountry]['countrycode'] === options[field]['countrycode']) {
                                eligibleCountry["country_" + options[field].regioncode + "_" + options[field].countrycode] = true;
                            }
                        }
                    }
                }
                
                this.setState({ allcountries, eligibleCountry });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getOptionCountry() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            countryname: 'asc'
        };
        let criteria = {
            active: true
        }
        let url = api.url.country.list;
        let column = [];
        /*loading select2 get data*/
        this.setState({ isLoadingSelect2: { country: true } });
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const options = [];
                for (const field in result) {
                    if (options[response.result[field].regioncode] === undefined) { options[response.result[field].regioncode] = {}; }

                    options[response.result[field].regioncode].regionname = response.result[field].regionname;
                    options[response.result[field].regioncode].regioncode = response.result[field].regioncode;

                    if (options[response.result[field].regioncode].country === undefined) { options[response.result[field].regioncode].country = []; }

                    let country = {};
                    country.countrycode = response.result[field].countrycode;
                    country.countryname = response.result[field].countryname;
                    options[response.result[field].regioncode].country.push(country);
                }

                var key = 0;
                let optionsCountry = [];
                for (const field in options) {
                    optionsCountry[key] = options[field];
                    key++;
                }

                this.setState({
                    optionsCountry,
                    isLoadingSelect2: { country: false }
                }, this.getEligibleCountry(result));
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        for (const field in this.refs) {
            if (field.substring(0, 7) === "country") {
                formData[field] = this.refs[field].checked;
            } else {
                if (this.refs[field].value) {
                    formData[field] = this.refs[field].value.trim();
                }
            }
        }

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let countries = [];
            var temp = '';
            for (const field in formData) {
                if (field.substring(0, 7) === "country" && formData[field]) {
                    temp = field.split('_');
                    countries.push(temp[2]);
                }
            }

            let awardcode = this.props.id;
            let allcountries = (this.state.allcountries) ? 1 : 0;
            let data = { awardcode, countries, allcountries };

            let message = 'Data has been updated';
            let url = api.url.awardeligiblecountries.update;
            var requestData = SaveRequest(url, data);
            if (requestData) {
                requestData.then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        // this.getList();
                        this.props.refreshMainPage();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        }
    };

    sortCountry(datas) {
        var myData = {};
        if (datas.length > 0) {
            myData = [...datas];
            myData.sort((a, b) => a.regionname > b.regionname);
            myData.map((item, i) => {
                return item;
            }
            );
        }
        return myData;
    }

    checkallcountries(allcountries) {
        const { optionsCountry } = this.state;

        const sortedCountry = this.sortCountry(optionsCountry);

        let eligibleCountry = [];
        let regioncode = '';
        let countrycode = '';
        for (const field in sortedCountry) {
            for (const field2 in sortedCountry[field]["country"]) {
                regioncode = sortedCountry[field]["regioncode"];
                countrycode = sortedCountry[field]["country"][field2]["countrycode"];
                if (allcountries) {
                    document.getElementById("country_" + regioncode + "_" + countrycode).checked = true;
                    eligibleCountry["country_" + regioncode + "_" + countrycode] = true;
                } else {
                    document.getElementById("country_" + regioncode + "_" + countrycode).checked = false;
                    eligibleCountry["country_" + regioncode + "_" + countrycode] = false;
                }
                this.setState({ eligibleCountry })
            }
        }

        this.setState({ eligibleCountry })
    }

    handleAllCountries = (event) => {
        let allcountries = event === null ? null : event.target.checked;
        this.checkallcountries(allcountries);
        this.setState({ allcountries });
    }

    handleSelected = (event) => {
        let name = event === null ? null : event.target.name;
        let value = event === null ? null : event.target.checked;
        
        if (!value) {
            this.setState({ allcountries: false });
            document.getElementById("allcountries").checked = false;
        }
        var eligibleCountry = this.state.eligibleCountry;
        eligibleCountry[name] = value;
        this.setState({ eligibleCountry });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { titlepage, formrender, loading, actionspage, generalfielddisabled } = this.state;
            const { optionsCountry, eligibleCountry } = this.state;
            const { allcountries } = this.state;
            
            const sortedCountry = this.sortCountry(optionsCountry);
            var listcountry = '';
            if (sortedCountry.length) {
                listcountry = sortedCountry.map((val_1, key_1) =>
                    <div className="col-md-12 mt-3" key={key_1}>
                        <h4>{val_1.regionname}</h4>
                        <div className="row">
                            {
                                val_1.country.map((val_2, key_2) =>
                                    <div className="col-md-3 " key={key_2}>
                                        <label className="custom-control border-switch" key={key_2}>
                                            <input
                                                id={"country_" + val_1.regioncode + "_" + val_2.countrycode}
                                                name={"country_" + val_1.regioncode + "_" + val_2.countrycode}
                                                ref={"country_" + val_1.regioncode + "_" + val_2.countrycode}
                                                className="border-switch-control-input"
                                                type="checkbox"
                                                checked={(eligibleCountry["country_" + val_1.regioncode + "_" + val_2.countrycode] || allcountries) ? true : false}
                                                onChange={this.handleSelected}
                                                disabled={generalfielddisabled}
                                            />
                                            <span className="border-switch-control-indicator"></span>
                                            <span className="border-switch-control-description">{val_2.countryname}</span>
                                        </label>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                );
            } else {
                listcountry = <div className="mt-5 text-center">
                    <h4>Loading . . . </h4>
                </div>;
            }

            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            if (formrender) {
                //render form
                return (
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <div className="col-sm-8">
                                <h1 className="title-has-control mt-2">{titlepage}</h1>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group row">
                                    <label className="col-sm-5 offset-sm-2 col-form-label text-right" htmlFor="allcountries">All Countries</label>
                                    <div className="col-sm-5">
                                        <label className="custom-control border-switch">
                                            <input id="allcountries" ref="allcountries" value="1" className="border-switch-control-input" type="checkbox" checked={(allcountries) ? true : false} onChange={(e) => this.handleAllCountries(e)} disabled={generalfielddisabled}/>
                                            <span className="border-switch-control-description">No</span>
                                            <span className="border-switch-control-indicator"></span>
                                            <span className="border-switch-control-description">Yes</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-12">
                                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                    <Loader value={loading} />
                                    {listcountry}
                                    <div className="mt-5 box-footer text-center">
                                        {
                                            (actionspage !== 'view') ? <button type="submit" className="btn btn-default normal btn-sm">Save</button> : ""
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;