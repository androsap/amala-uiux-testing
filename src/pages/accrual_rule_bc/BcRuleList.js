import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import Alert from '../../components/Alert';
import moment from 'moment';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false
        };
    }

    componentDidMount() {
        let tierid = this.props.retrievedetail.tierid;
        let partnercode = this.props.retrievedetail.partnercode;
        let airlinecode = this.props.retrievedetail.airlinecode;

        this.getBookingClassRule(tierid, partnercode, airlinecode);
    }

    getBookingClassRule(tierid, partnercode, airlinecode, bcrulename = null, subclasscode = null) {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            subclasscode: 'asc'
        };
        let criteria = { tierid, partnercode, airlinecode }

        if (bcrulename) { criteria.bcrulename = bcrulename; }
        if (subclasscode) { criteria.subclasscode = subclasscode; }

        let url = api.url.accrualrulebc.retrievebcrule;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                let dataList = (result.bcrule) ? result.bcrule : [];
                dataList = dataList.filter(val => val.active === true);

                this.setState({ dataList, isLoaded: true, });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    searchAction = (e) => {
        e.preventDefault();
        let tierid = this.props.retrievedetail.tierid;
        let partnercode = this.props.retrievedetail.partnercode;
        let airlinecode = this.props.retrievedetail.airlinecode;

        let bcrulename = (this.refs.bcrulename.value) ? "%" + this.refs.bcrulename.value + "%" : null;
        let subclasscode = (this.refs.subclasscode.value) ? this.refs.subclasscode.value : null;

        this.setState({ isLoaded: false }, this.getBookingClassRule(tierid, partnercode, airlinecode, bcrulename, subclasscode));
    }

    render() {
        const { dataList, isLoaded } = this.state;
        const { tiername, airlinename } = this.props.retrievedetail;
        var body = '';
        var number = 0;
        if (!isLoaded) {
            body = <tbody>
                <tr>
                    <td colSpan="99" className="text-center">Loading . . .</td>
                </tr>
            </tbody>;
        } else {
            if (dataList.length) {
                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.subclasscode}</td>
                            <td>{val.bcrulename}</td>
                            <td>{val.awardmilesfactor}</td>
                            <td>{val.tiermilesfactor}</td>
                            <td>{val.minawardmiles}</td>
                            <td>{val.mintiermiles}</td>
                            <td>{val.frequency}</td>
                            <td>{val.classofservicebonus}</td>
                            <td>{(val.startdate !== undefined) ? moment(val.startdate).format("DD-MM-YYYY") : '-'}</td>
                            <td>{(val.enddate !== undefined) ? moment(val.enddate).format("DD-MM-YYYY") : '-'}</td>
                        </tr>
                    )}
                </tbody>;
            } else {
                body = <tbody>
                    <tr>
                        <td colSpan="99" className="text-center">No data to display</td>
                    </tr>
                </tbody>;
            }
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="content-title flex-hr mb-0  title-description">
                            <h3 className="title-has-control mt-2">View Rule</h3>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
                                    <label className="col-sm-3 col-form-label" htmlFor="tierid-view">Tier </label>
                                    <div className="col-sm-8 col-form-label">: {tiername}</div>
                                </div>
                                <div className="row">
                                    <label className="col-sm-3 col-form-label" htmlFor="airline-view">Airline </label>
                                    <div className="col-sm-8 col-form-label">: {airlinename}</div>
                                </div>
                            </div>
                        </div>
                        <div className="top-filter d-block p-1">
                            <form className="clearfix position-relative" autoComplete="off">
                                <div className="row pt-1 pl-2">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-2 pt-1 pb-1">
                                                <input type="text" ref="bcrulename" className="form-control" placeholder="Rule Name" title="Rule Name" maxLength="50" />
                                            </div>
                                            <div className="col-md-2 pt-1 pb-1">
                                                <input type="text" ref="subclasscode" className="form-control" placeholder="Subclass" title="Subclass" maxLength="50" />
                                            </div>
                                            <div className="col-sm-2 pt-1 pb-1">
                                                <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Subclass</th>
                                    <th>Name</th>
                                    <th>Award<br /> Miles Factor</th>
                                    <th>Tier<br /> Miles Factor</th>
                                    <th>Min<br /> Award Miles</th>
                                    <th>Min<br /> Tier Miles</th>
                                    <th>Frequency</th>
                                    <th>Class Of Service Bonus</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            {body}
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;