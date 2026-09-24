import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Loader from '../../../components/Loader';
import Pagination from '../../../components/Pagination';
import ErrorGeneral from '../../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            responseCode: '0',
            responseMessage: '',
            areaList: [],
            ticketOffice: [],
            isLoaded: false,
            criteria: { type: props.areatype },
            totalrecord: 0,
            paging: {
                page: 1,
                limit: 10
            },
            sort: {},
            active: '',
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

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { paging, criteria } = this.state;
        let url = api.url.brancharea.list;
        let column = [];
        let sort = (this.state.criteria.type === 'COUNTRY') ? { countryname: 'asc' } : { cityname: 'asc' };
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    dataList: response.result,
                    isLoaded: true,
                    totalrecord: response.paging.totalrecord
                });
            } else {
                this.setState(
                    {
                        responseCode: response.status.responsecode,
                        responseMessage: response.status.responsemessage
                    }
                );
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
                                <td>{this.props.areatype === "COUNTRY" ? val.countryname : val.cityname}</td>
                                <td>{val.branchcode}</td>
                                <td>{val.branchname}</td>
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
                        <h3 className="title-has-control mt-2">{this.state.criteria.type === "COUNTRY" ? 'Country' : 'City'} Coverage Area</h3>
                    </div>
                    <hr className="mt-0 mb-1" />
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>No</th>
                                <th>{this.props.areatype === "COUNTRY" ? 'Country Name' : 'City Name'}</th>
                                <th>Branch Code</th>
                                <th>Branch Name</th>
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