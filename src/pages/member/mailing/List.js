import React, { Component } from 'react';
import ErrorGeneral from '../../error/ErrorGeneral';
import Pagination from "../../../components/Pagination";
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from "../../../components/Alert";
import EditForm from './Form/Edit';
import View from './Form/View';
import moment from 'moment';
import ReactModal from 'react-responsive-modal';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'membermailing';

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            showModal: false,
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: { memberid: props.memberid },
            sort: {
                id: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    id: 'desc',
                    reordernumber: '',
                    mailingsetname: '',
                    statusdate: '',
                    mailing_status: ''
                },
                icon: {
                    id: 'mdi-arrow-up-bold',
                    reordernumber: '',
                    mailingsetname: '',
                    statusdate: '',
                    mailing_status: ''
                }
            },
            membermailingid: null,
            mailingsetid: null,
            memberid: props.memberid,
            typepage: null
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
                    reordernumber: target === 'reordernumber' ? prevState.setSorting.type.reordernumber === 'desc' ? 'asc' : 'desc' : '',
                    id: target === 'id' ? prevState.setSorting.type.id === 'desc' ? 'asc' : 'desc' : '',
                    mailingsetname: target === 'mailingsetname' ? prevState.setSorting.type.mailingsetname === 'desc' ? 'asc' : 'desc' : '',
                    statusdate: target === 'statusdate' ? prevState.setSorting.type.statusdate === 'desc' ? 'asc' : 'desc' : '',
                    mailing_status: target === 'mailing_status' ? prevState.setSorting.type.mailing_status === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    reordernumber: target === 'reordernumber' ? prevState.setSorting.type.reordernumber === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    id: target === 'id' ? prevState.setSorting.type.id === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    mailingsetname: target === 'mailingsetname' ? prevState.setSorting.type.mailingsetname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    statusdate: target === 'statusdate' ? prevState.setSorting.type.statusdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    mailing_status: target === 'mailing_status' ? prevState.setSorting.type.mailing_status === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
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

    handleAddClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage
        });
    }

    //handle open modal
    handleOpenModal = (id, mailingid, mailingsetid, typepage) => {
        this.setState({ showModal: true, membermailingid: id, mailingid, mailingsetid, typepage });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.membermailing.list;
        let column = ["id", "mailingsetid", "mailingsetname", "status", "reordernumber", "statusdate", "mailingid"];
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

    searchAction = (e) => {
        e.preventDefault();
        let memberid = this.props.memberid;
        let id = this.refs.id.value;
        let mailingsetname = this.refs.mailingsetname.value;
        let mailingstatus = this.refs.mailingstatus.value;

        this.setState(
            {
                criteria: {
                    memberid,
                    id,
                    mailingsetname,
                    mailingstatus
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

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded, paging, totalrecord } = this.state;
            const { showModal, membermailingid, mailingid, memberid, mailingsetid, typepage } = this.state;
            var body = '';
            if (!isLoaded) {
                body = <tbody>
                    <tr>
                        <td colSpan="99" className="text-center">Loading . . .</td>
                    </tr>
                </tbody>;
            } else {
                if (dataList.length) {
                    var statusUpdate = _checkPermission(permissionList, menuname, 'update');

                    body = <tbody>
                        {dataList.map((val, i) =>
                            <tr key={i}>
                                <td>{val.id}</td>
                                <td>{val.mailingsetname}</td>
                                <td>{(val.reordernumber) ? val.reordernumber : "0"}</td>
                                <td>{(val.mailing_status) ? val.mailing_status : "-"}</td>
                                <td>{(val.statusdate) ? moment(val.statusdate).format('DD/MM/YYYY') : "-"}</td>
                                <td className="action-table inline three-btn">
                                    <button onClick={() => this.handleOpenModal(val.id, val.mailingid, val.mailingsetid, 'view')} title="View" className={"btn btn-outline-dark btn-sm " + statusUpdate}> View</button>
                                    <button onClick={() => this.handleOpenModal(val.id, val.mailingid, val.mailingsetid, 'edit')} title="Edit" className={"btn btn-outline-dark btn-sm " + statusUpdate}><i className="mdi mdi-lead-pencil"></i> Edit</button>
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
                    <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                        <div className="modal-lg">
                            {(typepage === 'edit') ?
                                <EditForm membermailingid={membermailingid} mailingid={mailingid} mailingsetid={mailingsetid} memberid={memberid} closeModalRefresh={this.handleCloseModalRefresh} /> :
                                <View membermailingid={membermailingid} mailingid={mailingid} mailingsetid={mailingsetid} memberid={memberid} closeModalRefresh={this.handleCloseModalRefresh} />}
                        </div>
                    </ReactModal>
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="mt-2">Manage Mailing</h1>
                        {/* <button onClick={() => (this.handleAddClick('FORM'))} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>Create</button> */}
                    </div>
                    <div className="top-filter">
                        <form className="container-fluid form-filter inline">
                            <div className="row">
                                <div className="col-md-3">
                                    <input type="text" ref="id" className="form-control" placeholder="Mailing ID" title="Mailing ID" maxLength="50" />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" ref="mailingsetname" className="form-control" placeholder="Mailing Set" title="Mailing Set" maxLength="50" />
                                </div>
                                <div className="col-md-3">
                                    <input type="text" ref="mailingstatus" className="form-control" placeholder="Status" title="Status" maxLength="50" />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'id', this.state.setSorting.type.id); }}>Mailing ID <i className={"mdi " + this.state.setSorting.icon.id} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'mailingsetname', this.state.setSorting.type.mailingsetname); }}>Mailing Set <i className={"mdi " + this.state.setSorting.icon.mailingsetname} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'reordernumber', this.state.setSorting.type.reordernumber); }}>Reorder No <i className={"mdi " + this.state.setSorting.icon.reordernumber} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'mailing_status', this.state.setSorting.type.mailing_status); }}>Status <i className={"mdi " + this.state.setSorting.icon.mailing_status} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'statusdate', this.state.setSorting.type.statusdate); }}>Status Date <i className={"mdi " + this.state.setSorting.icon.statusdate} /> </a></th>
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