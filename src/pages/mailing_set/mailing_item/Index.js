import React from 'react';
import { Link } from 'react-router-dom';
import { RetrieveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from '../../../components/Alert';
import Breadcrumb from '../../../components/Breadcrumb';
import Pagination from '../../../components/Pagination';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
import ErrorGeneral from '../../error/ErrorGeneral';
import Select2 from '../../../components/Select2';

var permissionList = _getUserPermission();
var menuname = 'title';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingsetid: (this.props.location.state && this.props.location.state.mailingsetid) ? this.props.location.state.mailingsetid : null,
            mailingid: (this.props.location.state && this.props.location.state.mailingid) ? this.props.location.state.mailingid : null,
            mailingname: (this.props.location.state && this.props.location.state.mailingname) ? this.props.location.state.mailingname : null,
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                mailingid: ''
            },
            sort: {
                mailingitemname: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    mailingitemname: 'desc',
                    itemtype: '',
                    description: ''
                },
                icon: {
                    mailingitemname: 'mdi-arrow-up-bold',
                    itemtype: '',
                    description: ''
                }
            },
            itemtype: null,
            optionsItemType: [
                {
                    label: "CONTENT",
                    value: "CONTENT"
                },
                {
                    label: "ATTACHMENT",
                    value: "ATTACHMENT"
                }
            ]
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
                    mailingitemname: target === 'mailingitemname' ? prevState.setSorting.type.mailingitemname === 'desc' ? 'asc' : 'desc' : '',
                    itemtype: target === 'itemtype' ? prevState.setSorting.type.itemtype === 'desc' ? 'asc' : 'desc' : '',
                    description: target === 'description' ? prevState.setSorting.type.description === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    mailingitemname: target === 'mailingitemname' ? prevState.setSorting.type.mailingitemname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    itemtype: target === 'itemtype' ? prevState.setSorting.type.itemtype === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    description: target === 'description' ? prevState.setSorting.type.description === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        document.title = "Manage Mailing Set | Loyalty Management System";
        if (!_checkPermission(permissionList, menuname, 'access')) {
            this.setState({
                criteria: {
                    mailingid: (this.props.location.state && this.props.location.state.mailingid) ? this.props.location.state.mailingid : null
                }
            }, () => this.getList());
        }
    }

    /*componentWillReceiveProps(props) {
        if (!_checkPermission(permissionList, menuname, 'access')) {
            this.setState({
                criteria: {
                    mailingid: (props.mailingid) ? props.mailingid : null
                }
            }, () => this.getList());
        }
    }*/

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.mailingitem.list;
        let column = ['id', 'mailingitemname', 'itemtype', 'description'];
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
        let mailingid = this.refs.mailingid.value;
        let mailingitemname = "%" + this.refs.mailingitemname.value + "%";
        let itemtype = this.state.itemtype;

        this.setState(
            {
                criteria: {
                    mailingid,
                    mailingitemname,
                    itemtype
                },
                totalData: 0,
                page: 1,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    deleteData(id) {
        let url = api.url.mailingitem.delete;
        id = Number.parseInt(id, 0);
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

    handleItemTypeChange = (event) => {
        let itemtype = event === null ? null : event.value;
        this.setState({ itemtype });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord, criteria, optionsItemType, itemtype, mailingid, mailingsetid, mailingname } = this.state;
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
                            <td>{val.mailingitemname}</td>
                            <td>{val.itemtype}</td>
                            <td>{val.description ? val.description.length > 60 ? val.description.substring(0, 60) + '...' : val.description : null}</td>
                            <td className="action-table inline two-btn">
                                <Link to={{ pathname: '/mailing-set/mailing-item/form/' + val.id, state: { mailingid, mailingsetid, mailingname } }} title="Edit" className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</Link>
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

        if (mailingid) {
            if (!_checkPermission(permissionList, menuname, 'access')) {
                return (
                    <div className="container-fluid">
                        <Breadcrumb path="Data Management / Mailing Set / Mailing / Mailing Item" />
                        <div className="main-panel">
                            <div className="content-title flex-hr mb-1 title-description">
                                <h1 className="title-has-control mt-2"><Link to={"/mailing-set/form/" + mailingsetid} className="btn btn-outline-dark circle btn-sm"><i className="mdi mdi-arrow-left-thick"></i></Link> Manage Mailing Item for {mailingname}</h1>
                                <Link to={{ pathname: '/mailing-set/mailing-item/form', state: { mailingid, mailingsetid, mailingname } }} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>
                                    Add New
                            </Link>
                            </div>
                            <div className="top-filter">
                                <form className="container-fluid form-filter">
                                    <div className="row">
                                        <div className="col">
                                            <input type="text" ref="mailingitemname" className="form-control" placeholder="Mailing Item Name" title="Mailing Item Name" maxLength="50" />
                                        </div>
                                        <div className="col">
                                            <Select2 reference="itemtype" className="reactSelect2" id="itemtype-view" options={optionsItemType} onChange={this.handleItemTypeChange} value={optionsItemType.filter(({ value }) => value === itemtype)} placeholder="Item Type"></Select2>
                                        </div>
                                        <div className="col">
                                            <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                        </div>
                                        <div className="col hidden">
                                            <input type="text" ref="mailingid" className="form-control" placeholder="Mailing ID" title="Mailing ID" maxLength="50" defaultValue={criteria.mailingid} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>No</th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'mailingitemname', this.state.setSorting.type.mailingitemname); }}>Mailing Item Name <i className={"mdi " + this.state.setSorting.icon.mailingitemname} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'itemtype', this.state.setSorting.type.itemtype); }}>Item Type <i className={"mdi " + this.state.setSorting.icon.itemtype} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'description', this.state.setSorting.type.description); }}>Description <i className={"mdi " + this.state.setSorting.icon.description} /> </a></th>
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
        } else {
            return (<ErrorGeneral message={'Mailing ID not detected, please do not use tab'} />);
        }
    }
}

export default Layout;