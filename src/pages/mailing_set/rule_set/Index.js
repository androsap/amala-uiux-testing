import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import Alert from '../../../components/Alert';
import ReactModal from 'react-responsive-modal';
import { api } from '../../../config/Services';
import Pagination from '../../../components/Pagination';
import RuleSetForm from '../rule_set/Form';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'rule_set';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {},
            sort: {
                rulesetname: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    rulesetname: 'desc'
                },
                icon: {
                    rulesetname: 'mdi-arrow-up-bold'
                }
            },
            showModal: false
        }
        this.closeAndRefresh = React.createRef();
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
                    rulesetname: target === 'rulesetname' ? prevState.setSorting.type.rulesetname === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    rulesetname: target === 'rulesetname' ? prevState.setSorting.type.rulesetname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, 'access')) this.getList();
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.ruleset.list;
        let column = ['id', 'rulesetname'];
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
        let rulesetname = "%"+this.refs.rulesetname.value+"%";

        this.setState(
            {
                criteria: {
                    rulesetname
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

    selectedRule(rulesetid, rulesetname) {
        this.props.closeModalRefresh();
        this.props.updateStore({
            rulesetid,
            rulesetname
        });
    }

    //handle open modal
    handleOpenModal = (code) => {
        this.setState({ showModal: true, patnercode: code });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
        // this.getList();
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord, showModal } = this.state;
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
                            <td>{val.rulesetname}</td>
                            <td className="action-table inline two-btn">
                                <button type="button" title="Select" className="btn btn-default normal btn-sm" ref={this.closeAndRefresh} onClick={() => this.selectedRule(val.id, val.rulesetname)}> Select</button>
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
            <div className="container-fluid">
                <div className="content-title flex-hr mb-0 title-description">
                    <h3 className="title-has-control mt-2">Rule Set Preview</h3>
                </div>
                <hr className="mt-4" />
                <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                    <div className="modal-lg">
                        <RuleSetForm closeModalRefresh={this.handleCloseModalRefresh} updateStore={(u) => { this.updateStore(u) }} />
                    </div>
                </ReactModal>
                {/* <button type="button" onClick={() => this.handleOpenModal('')} className="btn btn-default normal btn-sm">Add New</button> */}
                <button type="button" title="Filter" className="btn btn-default normal btn-sm m-2" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i className="mdi mdi-magnify"></i> Filter</button>
                <div className="top-filter collapse" id="collapseExample">
                    <div className="row mt-2">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-end">
                                <form className="form-inline">
                                    <input type="text" ref="rulesetname" className="form-control mb-2 mr-sm-2" placeholder="Rule Set Name" title="Rule Set Name" maxLength="50" />
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
                            <th><a href="" onClick={e => { this.handleSorting(e, 'rulesetname', this.state.setSorting.type.rulesetname); }}>Rule Name <i className={"mdi " + this.state.setSorting.icon.rulesetname} /> </a></th>
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
    }
}

export default Layout;