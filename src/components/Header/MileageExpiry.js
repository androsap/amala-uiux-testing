import React, { Component } from 'react';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import { formatNumber } from '../../utilities/Helpers';
import moment from 'moment';
import ErrorGeneral from './../../pages/error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            responseCode: '0',
            responseMessage: '',
            sort: {
                expireddate: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    awardmiles: '',
                    expireddate: 'desc'
                },
                icon: {
                    awardmiles: '',
                    expireddate: 'mdi-arrow-up-bold'
                }
            },
            criteria: {
                memberid: this.props.memberid
            },
            errors: {}
        };
    }

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
                    awardmiles: target === 'awardmiles' ? prevState.setSorting.type.awardmiles === 'desc' ? 'asc' : 'desc' : '',
                    expireddate: target === 'expireddate' ? prevState.setSorting.type.expireddate === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    awardmiles: target === 'awardmiles' ? prevState.setSorting.type.awardmiles === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    expireddate: target === 'expireddate' ? prevState.setSorting.type.expireddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.target.value;
        this.setState({ status });
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.mileageexpiry.list;
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
                this.setState({
                    responseCode: response.status.responsecode,
                    responseMessage: response.status.responsemessage
                });
            }
        });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded, paging, totalrecord } = this.state;
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
                                <td>{formatNumber(val.awardmiles)}</td>
                                <td>{moment(val.expireddate).format('DD/MM/YYYY')}</td>
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
                    <Loader value={this.state.loading} />
                    <div className="content-title flex-hr mb-0 title-description">
                        <h3 className="title-has-control mt-2">Mileage Expiry</h3>
                    </div>
                    <hr className="mt-0 mb-1" />
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label" htmlFor="membershipid-view">Current Balance</label>
                        <label className="col-sm-10 col-form-label" htmlFor="membershipidvalue-view">{formatNumber(this.props.currentbalance)}</label>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'awardmiles', this.state.setSorting.type.awardmiles); }}>Award Miles <i className={"mdi " + this.state.setSorting.icon.awardmiles} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'expireddate', this.state.setSorting.type.expireddate); }}>Expired Date <i className={"mdi " + this.state.setSorting.icon.expireddate} /> </a></th>
                                </tr>
                            </thead>
                            {body}
                        </table>
                    </div>
                    <Pagination
                        activePage={paging.page}
                        itemsCountPerPage={paging.limit}
                        totalItemsCount={totalrecord}
                        onChange={this.handlePageChange.bind(this)}
                        pageRangeDisplayed={5}
                    />
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;