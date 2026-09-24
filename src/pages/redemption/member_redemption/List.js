import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { getProfile } from '../../../utilities/AuthService';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import ErrorGeneral from '../../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuname: this.props.menuname,
            cardnumber: this.props.cardnumber,
            responseCode: '0',
            responseMessage: '',
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {},
            sort: {
                awardcode: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    awardcode: 'desc',
                    name: '',
                    partnercode: '',
                    startdate: '',
                    enddate: '',
                    price: ''
                },
                icon: {
                    awardcode: 'mdi-arrow-up-bold',
                    name: '',
                    partnercode: '',
                    startdate: '',
                    enddate: '',
                    price: ''
                }
            },
            awardtypeid: null,
            channel: "BO",
            mileage: null,
            showall: false,
            eligibletier: null
        };
    }

    componentDidMount() {
        let awardtypecode = this.props.awardtypecode;
        let eligibletier = this.props.tierid;
        let mileage = this.props.awardmiles;
        let channel = this.state.channel;
        if (awardtypecode && (mileage !== undefined) && eligibletier) {
            this.setState({
                criteria: {
                    channel,
                    mileage,
                    showall: false,
                    eligibletier,
                    awardtypecode,
                    username: getProfile().username
                }
            }, () => this.getList());
        }
    }

    /*componentWillReceiveProps(props) {
        let awardtypecode = props.awardtypecode;
        let eligibletier = props.tierid;
        let mileage = props.awardmiles;
        let channel = this.state.channel;
        if (awardtypecode && (mileage !== undefined) && eligibletier) {
            this.setState({
                criteria: {
                    channel,
                    mileage,
                    showall: false,
                    eligibletier,
                    awardtypecode,
                    username: getProfile().username
                }
            }, () => this.getList());
        }
    }*/

    //handle pagination page
    handlePageChange(pageNumber) {
        const { paging } = this.state;
        this.setState(
            { paging: { page: pageNumber, limit: paging.limit }, isLoaded: false },
            () => this.getList()
        );
    }

    //handle sorting page
    handleSorting(e, target, type) {
        e.preventDefault();
        this.setState(prevState => ({
            sort: {
                [target]: (type === '') ? 'asc' : type
            },
            setSorting: {
                type: {
                    awardcode: target === 'awardcode' ? prevState.setSorting.type.awardcode === 'desc' ? 'asc' : 'desc' : '',
                    name: target === 'name' ? prevState.setSorting.type.name === 'desc' ? 'asc' : 'desc' : '',
                    partnercode: target === 'partnercode' ? prevState.setSorting.type.partnercode === 'desc' ? 'asc' : 'desc' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'asc' : 'desc' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'asc' : 'desc' : '',
                    price: target === 'price' ? prevState.setSorting.type.price === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    awardcode: target === 'awardcode' ? prevState.setSorting.type.awardcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    name: target === 'name' ? prevState.setSorting.type.name === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    partnercode: target === 'partnercode' ? prevState.setSorting.type.partnercode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    price: target === 'price' ? prevState.setSorting.type.price === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.awardlist.getawardredeemlist;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    dataList: response.result,
                    isLoaded: true,
                    totalrecord: response.paging.totalrecord
                });
            } else {
                toast.error(response.status.responsemessage);
            }
        });
    }

    handleShowAllChange = (event) => {
        let showall = event === null ? null : event.target.checked;
        this.setState(prevState => ({
            isLoaded: false,
            criteria: {
                ...prevState.criteria,
                showall
            }
        }), () => this.getList())
    }


    buy(redemptionType = 'NONAIR', awardid) {
        this.props.updateRedemptionStore({
            positionSection: 'BUY',
            redemptionType,
            awardid
        });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded, paging, totalrecord } = this.state;
            const { showall } = this.state.criteria;

            const { cardnumber } = this.state;

            var number = (paging.page - 1) * paging.limit;
            var body = '';
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
                                <td>{val.awardcode}</td>
                                <td>{val.name}</td>
                                <td>{(val.partnercode) ? val.partnercode : '-'}</td>
                                <td>{(val.startdate !== undefined && val.startdate !== null) ? moment(val.startdate).format("DD/MM/YYYY") : '-'}</td>
                                <td>{(val.enddate !== undefined && val.enddate !== null) ? moment(val.enddate).format("DD/MM/YYYY") : '-'}</td>
                                <td>{(val.price) ? val.price : val.pricingby}</td>
                                <td className="action-table inline one-btn">
                                    <Link to={'/redemption/' + cardnumber + ((val.categorycode === 'FREEFLIGHT') ? "/freeflight/" : (val.categorycode === 'UPGRADE') ? "/upgrade/" : "/non_air/") + val.awardcode} title="Buy" className="btn btn-outline-dark btn-sm"><i className="mdi mdi-shopping"></i> Buy</Link>
                                </td>
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
                <div className="profile-detail">
                    <div className="content-title flex-hr mb-0 title-description">
                        <div className="form-group row mui--text-right">
                            <label className="col-sm-9 col-form-label" htmlFor="showall-view">Show All Award </label>
                            <div className="col-sm-3">
                                <label className="custom-control border-switch row">
                                    <input id="showall-view" ref="showall" value="1" className="border-switch-control-input" type="checkbox" onClick={this.handleShowAllChange} defaultChecked={(showall) ? "checked" : null} />
                                    <span className="border-switch-control-indicator"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="tab-entry tab-content">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'awardcode', this.state.setSorting.type.awardcode); }}>Award Code <i className={"mdi " + this.state.setSorting.icon.awardcode} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'name', this.state.setSorting.type.name); }}>Name <i className={"mdi " + this.state.setSorting.icon.name} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'partnercode', this.state.setSorting.type.partnercode); }}>Partner Code <i className={"mdi " + this.state.setSorting.icon.partnercode} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'startdate', this.state.setSorting.type.startdate); }}>Start Date <i className={"mdi " + this.state.setSorting.icon.startdate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'enddate', this.state.setSorting.type.enddate); }}>End Date <i className={"mdi " + this.state.setSorting.icon.enddate} /> </a></th>
                                    {/* <th><a href="" onClick={e => { this.handleSorting(e, 'price', this.state.setSorting.type.price); }}>Price <i className={"mdi " + this.state.setSorting.icon.price} /> </a></th> */}
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {body}
                        </table>
                        <Pagination
                            activePage={paging.page}
                            itemsCountPerPage={paging.limit}
                            totalItemsCount={totalrecord}
                            onChange={this.handlePageChange.bind(this)}
                            pageRangeDisplayed={5}
                        />
                    </div>
                </div >
            )
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;