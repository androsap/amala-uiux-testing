import React from 'react';
import { Link } from 'react-router-dom';
import { RetrieveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Alert from '../../components/Alert';
import Breadcrumb from '../../components/Breadcrumb';
import Datepicker from '../../components/Datepicker';
import Pagination from '../../components/Pagination';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import ErrorGeneral from '../error/ErrorGeneral';
import moment from 'moment';

var permissionList = _getUserPermission();
var menuname = 'mailingset';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {},
            sort: {
                mailingsetname: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    mailingsetname: 'desc',
                    maxreorder: '',
                    validfrom: '',
                    validuntil: ''
                },
                icon: {
                    mailingsetname: 'mdi-arrow-up-bold',
                    maxreorder: '',
                    validfrom: '',
                    validuntil: ''
                }
            },
            mailingsetdate: null,
            validfrom: null,
            validuntil: null
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
                    mailingsetname: target === 'mailingsetname' ? prevState.setSorting.type.mailingsetname === 'desc' ? 'asc' : 'desc' : '',
                    maxreorder: target === 'maxreorder' ? prevState.setSorting.type.maxreorder === 'desc' ? 'asc' : 'desc' : '',
                    validfrom: target === 'validfrom' ? prevState.setSorting.type.validfrom === 'desc' ? 'asc' : 'desc' : '',
                    validuntil: target === 'validuntil' ? prevState.setSorting.type.validuntil === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    mailingsetname: target === 'mailingsetname' ? prevState.setSorting.type.mailingsetname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    maxreorder: target === 'maxreorder' ? prevState.setSorting.type.maxreorder === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    validfrom: target === 'validfrom' ? prevState.setSorting.type.validfrom === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    validuntil: target === 'validuntil' ? prevState.setSorting.type.validuntil === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        document.title = "Manage Mailing Set | Loyalty Management System";
        if (!_checkPermission(permissionList, menuname, 'access')) this.getList();
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.mailingset.list;
        let column = ['id', 'mailingsettype','mailingsetname', 'maxreorder', 'validfrom', 'validuntil'];
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
        let mailingsetname = "%"+this.refs.mailingsetname.value+"%";
        // let mailingsetdate = this.state.mailingsetdate ? moment(this.state.mailingsetdate).format('YYYY-MM-DD') : null;
        let validfrom = this.state.validfrom ? moment(this.state.validfrom).format('YYYY-MM-DD') : this.state.validuntil ? moment(this.state.validuntil).format('YYYY-MM-DD') : null;
        let validuntil = this.state.validuntil ? moment(this.state.validuntil).format('YYYY-MM-DD') : this.state.validuntil ? moment(this.state.validuntil).format('YYYY-MM-DD') : null;

        this.setState(
            {
                criteria: {
                    mailingsetname,
                    // mailingsetdate,
                    validfrom,
                    validuntil
                },
                totalrecord: 0,
                page: 1,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    deleteData(id) {
        let url = api.url.mailingset.delete;
        let data = { id };
        var deleteData = DeleteRequest(url, data);
        if (deleteData) {
            deleteData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let message = 'Selected data has been deleted';
                    if (response.status.responsemessage) {
                        message = response.status.responsemessage;
                    }
                    Alert.success(message);
                } else {
                    Alert.error(response.status.responsemessage);
                }
                this.getList();
            })
        }
    }

    /*handleMailingSetDateChange = (event) => {
        let mailingsetdate = event === null ? null : event;
        this.setState({ mailingsetdate });
    }*/

    handleValidFormChange = (event) => {
        let validfrom = event === null ? null : event;
        this.setState({ validfrom });
    }

    handleValidUntilChange = (event) => {
        let validuntil = event === null ? null : event;
        this.setState({ validuntil });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord, validfrom, validuntil } = this.state;
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
                var editLabel = !_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View";
                var editIcon = !_checkPermission(permissionList, menuname, 'update') ? "mdi-lead-pencil" : "mdi-file";
                var statusDelete = _checkPermission(permissionList, menuname, 'delete');

                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.mailingsetname}</td>
                            <td>{val.maxreorder}</td>
                            <td>{moment(val.validfrom).format("DD-MM-YYYY")}</td>
                            <td>{moment(val.validuntil).format("DD-MM-YYYY")}</td>
                            <td className="action-table inline two-btn">
                                <Link to={'/mailing-set/form/' + val.id} title="Edit" className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</Link>
                                <button type="button" title="Delete" className={"btn btn-outline-dark btn-sm " + statusDelete} onClick={() => this.deleteData(val.id)}><i className="mdi mdi-delete"></i> Delete</button>
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

        if (!_checkPermission(permissionList, menuname, 'access')) {
            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Member Configuration / Mailing Set" />
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">Manage Mailing Set</h1>
                            <Link to={'/mailing-set/form/'} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>Add New</Link>
                        </div>
                        <div className="top-filter">
                            <form className="container-fluid form-filter">
                                <div className="row">
                                    <div className="col">
                                        <input type="text" ref="mailingsetname" className="form-control" placeholder="Mailing Set Name" title="Mailing Set Name" maxLength="50" />
                                    </div>
                                    {/* <div className="col-md-4">
                                        <Datepicker className="form-control" selected={mailingsetdate} onChange={this.handleMailingSetDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Mailing Set Date" />
                                    </div> */}
                                    <div className="col">
                                        <Datepicker className="form-control" selected={validfrom} onChange={this.handleValidFormChange} dateFormat={"DD/MM/YYYY"} placeholderText="Valid Form" />
                                    </div>
                                    <div className="col">
                                        <Datepicker className="form-control" selected={validuntil} onChange={this.handleValidUntilChange} dateFormat={"DD/MM/YYYY"} placeholderText="Valid Until" />
                                    </div>
                                    <div className="col">
                                        <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'mailingsetname', this.state.setSorting.type.mailingsetname); }}>Mailing Set Name <i className={"mdi " + this.state.setSorting.icon.mailingsetname} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'maxreorder', this.state.setSorting.type.maxreorder); }}>Max Re-order <i className={"mdi " + this.state.setSorting.icon.maxreorder} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'validfrom', this.state.setSorting.type.validfrom); }}>Valid From <i className={"mdi " + this.state.setSorting.icon.validfrom} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'validuntil', this.state.setSorting.type.validuntil); }}>Valid Until <i className={"mdi " + this.state.setSorting.icon.validuntil} /> </a></th>
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
                </div>
            );
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;