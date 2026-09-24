import React from 'react';
import { Link } from 'react-router-dom';
import { RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from '../../../components/Alert';
import Pagination from '../../../components/Pagination';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
import ErrorGeneral from '../../error/ErrorGeneral';

var permissionList = _getUserPermission();
var menuname = 'mailing';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                mailingsetid: ''
            },
            sort: {
                mailingname: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    mailingname: 'desc',
                    langname: ''
                },
                icon: {
                    mailingname: 'mdi-arrow-up-bold',
                    langname: ''
                }
            },
            validfrom: null,
            validuntil: null,
            mailingsetid: null
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
                    mailingname: target === 'mailingname' ? prevState.setSorting.type.mailingname === 'desc' ? 'asc' : 'desc' : '',
                    langname: target === 'langname' ? prevState.setSorting.type.langname === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    mailingname: target === 'mailingname' ? prevState.setSorting.type.mailingname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    langname: target === 'langname' ? prevState.setSorting.type.langname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        document.title = "Manage Mailing Set | Loyalty Management System";
    }

    componentWillReceiveProps(props) {
        if (!_checkPermission(permissionList, menuname, 'access')) {
            this.setState({
                criteria: {
                    mailingsetid: (props.mailingsetid) ? props.mailingsetid : ''
                }
            }, () => this.getList());
        }
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.mailing.list;
        let column = ['id', 'mailingname', 'langcode', 'langname'];
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
        let mailingname = "%"+this.refs.mailingname.value+"%";
        let mailingsetid = Number.parseInt(this.refs.mailingsetid.value, 0);

        this.setState(
            {
                criteria: {
                    mailingname,
                    mailingsetid
                },
                totalrecord: 0,
                page: 1,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    deleteData(id) {
        let url = api.url.mailing.delete;
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

    handleValidFormChange = (event) => {
        let validfrom = event === null ? null : event;
        this.setState({ validfrom });
    }

    handleValidUntilChange = (event) => {
        let validuntil = event === null ? null : event;
        this.setState({ validuntil });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord, criteria } = this.state;
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
                var permissionItem = _checkPermission(permissionList, menuname, 'mailing-item');
                var editLabel = !_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View";
                var editIcon = !_checkPermission(permissionList, menuname, 'update') ? "mdi-lead-pencil" : "mdi-file";
                var statusDelete = _checkPermission(permissionList, menuname, 'delete');

                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.mailingname}</td>
                            <td>{val.langname}</td>
                            <td className="action-table inline three-btn" style={{ width: '25%' }}>
                                <Link to={{ pathname: '/mailing-set/mailing-item', state: { mailingsetid: this.props.mailingsetid, mailingid: val.id, mailingname: val.mailingname } }} title="View" className={"btn btn-outline-dark btn-sm " + permissionItem}><i className="mdi mdi-eye"></i> View Item</Link>
                                <Link to={{ pathname: '/mailing-set/mailing', state: { mailingsetid: this.props.mailingsetid, mailingid: val.id } }} title="Edit" className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</Link>
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
                    <Link to={{ pathname: '/mailing-set/mailing', state: { mailingsetid: this.props.mailingsetid, mailingid: null } }} title="Add New" className={"btn btn-default normal btn-sm m-2 " + _checkPermission(permissionList, menuname, 'create')}>
                        Add New
                    </Link>
                    <button type="submit" title="Filter" className="btn btn-default normal btn-sm m-2" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i className="mdi mdi-magnify"></i> Filter</button>
                    <div className="top-filter collapse" id="collapseExample">
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <div className="d-flex justify-content-end">
                                    <form className="form-inline">
                                        <input type="text" ref="mailingname" className="form-control mb-2 mr-sm-2" placeholder="Mailing Name" title="Mailing Name" maxLength="50" />
                                        <input type="text" ref="mailingsetid" className="form-control hidden" placeholder="Mailing Set ID" title="Mailing Set ID" maxLength="50" defaultValue={criteria.mailingsetid} />
                                        <button type="submit" title="Search" className="btn btn-outline-dark normal mb-2 mr-sm-2" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>No</th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'mailingname', this.state.setSorting.type.mailingname); }}>Mailing Name <i className={"mdi " + this.state.setSorting.icon.mailingname} /> </a></th>
                                <th>Language Name</th>
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
                </div >
            );
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;