import React, { Component } from 'react';
import ErrorGeneral from '../../error/ErrorGeneral';
import Pagination from "../../../components/Pagination";
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from "../../../components/Alert";
import ReactModal from 'react-responsive-modal';
import Form from './Form';
import Datepicker from '../../../components/Datepicker';
import moment from 'moment';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'membertourcode';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                corporatecode: props.getStore().corporatecode
            },
            sort: {
                tourcode: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    tourcode: 'desc',
                    startdate: '',
                    enddate: ''
                },
                icon: {
                    tourcode: 'mdi-arrow-up-bold',
                    startdate: '',
                    enddate: ''
                }
            },
            showModal: false,
            corporatecode: null,
            startdate: null,
            enddate: null
        };
    }

    //handle open modal
    handleOpenModal = () => {
        this.setState({ showModal: true });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
        this.getList();
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
                    tourcode: target === 'tourcode' ? prevState.setSorting.type.tourcode === 'desc' ? 'asc' : 'desc' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'asc' : 'desc' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    tourcode: target === 'tourcode' ? prevState.setSorting.type.tourcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        let targetSection = this.props.getStore().targetSection;
        if (targetSection === menuname) {
            if (!_checkPermission(permissionList, menuname, "access")) {
                this.getList();
            } else {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ corporatecode: props.getStore().corporatecode });
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.tourcode.list;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    dataList: response.result,
                    isLoaded: true,
                    totalrecord: response.paging.totalrecord,
                    corporatecode: this.props.getStore().corporatecode
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    searchAction = (e) => {
        e.preventDefault();
        let corporatecode = this.props.getStore().corporatecode;
        let tourcode = "%" + this.refs.tourcode.value + "%";
        let startdate = this.state.startdate ? moment(this.state.startdate).format('YYYY-MM-DD') : null;
        let enddate = this.state.enddate ? moment(this.state.enddate).format('YYYY-MM-DD') : null;

        this.setState(
            {
                criteria: {
                    corporatecode,
                    tourcode,
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

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        this.setState({ startdate });
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        this.setState({ enddate });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { dataList, isLoaded, paging, totalrecord, showModal } = this.state;
            const { corporatecode, startdate, enddate } = this.state;

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
                                <td>{val.tourcode}</td>
                                <td>{moment(val.startdate).format('DD/MM/YYYY')}</td>
                                <td>{moment(val.enddate).format('DD/MM/YYYY')}</td>
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
                            <Form corporatecode={corporatecode} closeModalRefresh={this.handleCloseModalRefresh} />
                        </div>
                    </ReactModal>
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="mt-2">Manage Tour Code</h1>
                        <button onClick={() => this.handleOpenModal('')} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'membertourcode')}>Add New</button>
                    </div>
                    <div className="top-filter">
                        <form className="container-fluid form-filter inline">
                            <div className="row">
                                <div className="col-md-3">
                                    <input type="text" ref="tourcode" className="form-control" placeholder="Tour Code" title="Tour Code" maxLength="50" />
                                </div>
                                <div className="col-md-3">
                                    <Datepicker className="form-control" selected={startdate} onChange={this.handleStartDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Start Date" />
                                </div>
                                <div className="col-md-3">
                                    <Datepicker className="form-control" selected={enddate} onChange={this.handleEndDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="End Date" />
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
                                <th>No</th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'tourcode', this.state.setSorting.type.tourcode); }}>Tour Code <i className={"mdi " + this.state.setSorting.icon.tourcode} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'startdate', this.state.setSorting.type.startdate); }}>Start Date <i className={"mdi " + this.state.setSorting.icon.startdate} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'enddate', this.state.setSorting.type.enddate); }}>End Date <i className={"mdi " + this.state.setSorting.icon.enddate} /> </a></th>
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

export default Layout;