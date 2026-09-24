import React, { Component } from 'react';
import ErrorGeneral from '../../error/ErrorGeneral';
import Pagination from "../../../components/Pagination";
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from "../../../components/Alert";
import moment from 'moment';
import Button from '../../../components/Button';

const prefixmenuname = 'MBRCBRN';
const menucode = 'MBRCBRN';

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: { memberid: props.memberid },
            sort: {
                cobrandcode: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    cobrandcode: 'desc',
                    applicationdate: '',
                    startdate: '',
                    enddate: '',
                    status: ''
                },
                icon: {
                    cobrandcode: 'mdi-arrow-up-bold',
                    applicationdate: '',
                    startdate: '',
                    enddate: '',
                    status: ''
                }
            },
            membercard: [],
            membertier: {}
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
                    cobrandcode: target === 'cobrandcode' ? prevState.setSorting.type.cobrandcode === 'desc' ? 'asc' : 'desc' : '',
                    applicationdate: target === 'applicationdate' ? prevState.setSorting.type.applicationdate === 'desc' ? 'asc' : 'desc' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'asc' : 'desc' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'asc' : 'desc' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    cobrandcode: target === 'cobrandcode' ? prevState.setSorting.type.cobrandcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    applicationdate: target === 'applicationdate' ? prevState.setSorting.type.applicationdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentWillReceiveProps(props) {
        if (props.transactionPage) { this.getList(); }
    }

    componentDidMount() {
        this.getList();
    }

    handleAddClick(targetPage, typepage, cobrandid, statuscobrand = '') {
        this.props.updatePage({
            displayactivitypage: targetPage,
            typepage,
            cobrandid,
            statuscobrand
        });
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.membercobran.list;
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

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded, paging, totalrecord } = this.state;
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
                                <td>{val.cobrandcode + " - " + val.cobrandname}</td>
                                <td>{(val.applicationdate) ? moment(val.applicationdate).format('DD/MM/YYYY') : ""}</td>
                                <td>{(val.startdate) ? moment(val.startdate).format('DD/MM/YYYY') : ""}</td>
                                <td>{(val.enddate) ? moment(val.enddate).format('DD/MM/YYYY') : ""}</td>
                                <td>{val.status}</td>
                                <td className="action-table inline three-btn">
                                    {(val.status === 'PENDING_APPROVAL') ? <Button onClick={() => (this.handleAddClick('FORM', 'approval', val.membercobrandid))} type="button" label="Approve" className="btn btn-outline-dark btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE"></Button> : ''}
                                    <Button onClick={() => (this.handleAddClick('FORM', 'update', val.membercobrandid, val.status))} type="button" label="Edit" icon="mdi mdi-lead-pencil" className="btn btn-outline-dark btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
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
                        <h1 className="mt-2">Manage Cobrand</h1>
                        <Button onClick={() => this.handleAddClick('FORM', 'enroll')} type="button" label="Create" className="btn btn-default normal btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Cobrand</th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'applicationdate', this.state.setSorting.type.applicationdate); }}>Application Date <i className={"mdi " + this.state.setSorting.icon.applicationdate} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'startdate', this.state.setSorting.type.startdate); }}>Start Date <i className={"mdi " + this.state.setSorting.icon.startdate} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'enddate', this.state.setSorting.type.enddate); }}>End Date <i className={"mdi " + this.state.setSorting.icon.enddate} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'status', this.state.setSorting.type.status); }}>Status <i className={"mdi " + this.state.setSorting.icon.status} /> </a></th>
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
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default TransactionList;