import React from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Pagination from '../../../../components/Pagination';
import Datepicker from '../../../../components/Datepicker';
import moment from 'moment';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberid: props.getStore().memberid,
            activityid: null,
            showModal: false,
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                memberidchild: props.getStore().memberid,
                active: true
            },
            sort: {
                relationtype: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    relationtype: 'desc',
                    cardnumber: '',
                    startdate: '',
                    enddate: ''
                },
                icon: {
                    relationtype: 'mdi-arrow-up-bold',
                    cardnumber: '',
                    startdate: '',
                    enddate: ''
                }
            },
            startdate: null,
            enddate: null
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
                    relationtype: target === 'relationtype' ? prevState.setSorting.type.relationtype === 'desc' ? 'asc' : 'desc' : '',
                    cardnumber: target === 'cardnumber' ? prevState.setSorting.type.cardnumber === 'desc' ? 'asc' : 'desc' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'asc' : 'desc' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    relationtype: target === 'relationtype' ? prevState.setSorting.type.relationtype === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    cardnumber: target === 'cardnumber' ? prevState.setSorting.type.cardnumber === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
    }

    searchAction = (e) => {
        e.preventDefault();
        let { memberid, startdate, enddate } = this.state;
        let relationtype = '%' + this.refs.relationtype.value + '%';
        let cardnumber = '%' + this.refs.cardnumber.value + '%';
        startdate = startdate ? moment(startdate).format('YYYY-MM-DD') : null;
        enddate = enddate ? moment(enddate).format('YYYY-MM-DD') : null;

        this.setState(
            {
                criteria: {
                    memberidchild: memberid,
                    active: true,
                    relationtype,
                    cardnumber,
                    startdate,
                    enddate
                },
                paging: {
                    page: 1,
                    limit: 10
                },
                totalrecord: 0,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.memberrelation.list;
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
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleAddClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage,
            activityid: null
        });
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        this.setState({ startdate });
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        this.setState({ enddate });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord } = this.state;
        const { startdate, enddate } = this.state;
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
                            <td>{val.relationtype}</td>
                            <td>{val.cardnumber}</td>
                            <td>{moment(val.startdate).format("DD/MM/YYYY")}</td>
                            <td>{moment(val.enddate).format("DD/MM/YYYY")}</td>
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
            <div>
                <div className="member-section">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-0">Manage Member Relation - Active</h1>
                    </div>
                    <form className="top-filter d-block p-3">
                        <div className="row">
                            <div className="col-md-2 pt-1 pb-1">
                                <input type="text" ref="relationtype" className="form-control" placeholder="Relation Type" title="Relation Type" maxLength="50" />
                            </div>
                            <div className="col-md-2 pt-1 pb-1">
                                <input type="text" ref="cardnumber" className="form-control" placeholder="Member Card" title="Member Card" maxLength="50" />
                            </div>
                            <div className="col-md-2 pt-1 pb-1">
                                <Datepicker className="form-control" selected={startdate} onChange={this.handleStartDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Start Date" />
                            </div>
                            <div className="col-md-2 pt-1 pb-1">
                                <Datepicker className="form-control" selected={enddate} onChange={this.handleEndDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="End Date" />
                            </div>
                            <div className="col-md-2 pt-1 pb-1">
                                <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                            </div>
                        </div>
                    </form>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'relationtype', this.state.setSorting.type.relationtype); }}>Relation Type <i className={"mdi " + this.state.setSorting.icon.relationtype} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'cardnumber', this.state.setSorting.type.cardnumber); }}>Member Card <i className={"mdi " + this.state.setSorting.icon.cardnumber} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'startdate', this.state.setSorting.type.startdate); }}>Start Date <i className={"mdi " + this.state.setSorting.icon.startdate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'enddate', this.state.setSorting.type.enddate); }}>End Date <i className={"mdi " + this.state.setSorting.icon.enddate} /> </a></th>
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
            </div>
        );
    }
}

export default Layout;