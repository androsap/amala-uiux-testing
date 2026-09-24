import React from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Pagination from '../../../../components/Pagination';
import moment from 'moment';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                activityid: Number.parseInt(props.activityid, 0)
            },
            sort: {
                createddate: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    activityinfo: '',
                    createdby: '',
                    createddate: 'desc'
                },
                icon: {
                    activityinfo: '',
                    createdby: '',
                    createddate: 'mdi-arrow-up-bold'
                }
            }
        };
    }

    //handle pagination page
    handlePageChange(pageNumber) {
        this.setState(
            { page: pageNumber, isLoaded: false },
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
                    activityinfo: target === 'activityinfo' ? prevState.setSorting.type.activityinfo === 'desc' ? 'asc' : 'desc' : '',
                    createdby: target === 'createdby' ? prevState.setSorting.type.createdby === 'desc' ? 'asc' : 'desc' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    activityinfo: target === 'activityinfo' ? prevState.setSorting.type.activityinfo === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    createdby: target === 'createdby' ? prevState.setSorting.type.createdby === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.memberactivityhistory.list;
        let column = ['activityinfo', 'createdby', 'createddate'];
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
                            <td>{val.activityinfo}</td>
                            <td>{val.createdby}</td>
                            <td>{moment(val.createddate).format("DD/MM/YYYY")}</td>
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
                    <h3 className="title-has-control mt-2">Activity History </h3>
                </div>
                <hr className="mt-0" />
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'activityinfo', this.state.setSorting.type.activityinfo); }}>Activity Info <i className={"mdi " + this.state.setSorting.icon.activityinfo} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'createdby', this.state.setSorting.type.createdby); }}>Created By <i className={"mdi " + this.state.setSorting.icon.createdby} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'createddate', this.state.setSorting.type.createddate); }}>Created Date <i className={"mdi " + this.state.setSorting.icon.createddate} /> </a></th>
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
            </div>
        );
    }
}

export default Layout;