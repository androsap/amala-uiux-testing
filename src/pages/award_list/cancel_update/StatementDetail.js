import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Pagination from '../../../components/Pagination';
import Loader from '../../../components/Loader';
import ErrorGeneral from '../../error/ErrorGeneral';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            responseCode: '0',
            responseMessage: '',
            sort: {
                langcode: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    channel: 'desc',
                    statementtext: '',
                    correctiontext: '',
                    langcode: ''
                },
                icon: {
                    channel: 'mdi-arrow-up-bold',
                    statementtext: '',
                    correctiontext: '',
                    langcode: ''
                }
            },
            criteria: { statementcode: this.props.id },
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

    //handle sorting page
    handleSorting(e, target, type) {
        e.preventDefault();
        this.setState(prevState => ({
            sort: {
                [target]: (type === '') ? 'asc' : type
            },
            setSorting: {
                type: {
                    channel: target === 'channel' ? prevState.setSorting.type.channel === 'desc' ? 'asc' : 'desc' : '',
                    statementtext: target === 'statementtext' ? prevState.setSorting.type.statementtext === 'desc' ? 'asc' : 'desc' : '',
                    correctiontext: target === 'correctiontext' ? prevState.setSorting.type.correctiontext === 'desc' ? 'asc' : 'desc' : '',
                    langcode: target === 'langcode' ? prevState.setSorting.type.langcode === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    channel: target === 'channel' ? prevState.setSorting.type.channel === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    statementtext: target === 'statementtext' ? prevState.setSorting.type.statementtext === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    correctiontext: target === 'correctiontext' ? prevState.setSorting.type.correctiontext === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    langcode: target === 'langcode' ? prevState.setSorting.type.langcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.target.value;
        this.setState({ status });
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.statementtext.list;
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
                                <td>{val.channel}</td>
                                <td>{val.langcode}</td>
                                <td>{val.statementtext ? val.statementtext.length > 50 ? val.statementtext.substring(0, 50) + '...' : val.statementtext : null}</td>
                                <td>{val.correctiontext ? val.correctiontext.length > 50 ? val.correctiontext.substring(0, 50) + '...' : val.correctiontext : null}</td>
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
                        <h3 className="title-has-control mt-2">Template Text</h3>
                    </div>
                    <hr className="mt-0 mb-1" />
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>No</th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'channel', this.state.setSorting.type.channel); }}>Channel <i className={"mdi " + this.state.setSorting.icon.channel} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'langcode', this.state.setSorting.type.langcode); }}>Language <i className={"mdi " + this.state.setSorting.icon.langcode} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'statementtext', this.state.setSorting.type.statementtext); }}>Statement Text <i className={"mdi " + this.state.setSorting.icon.statementtext} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'correctiontext', this.state.setSorting.type.correctiontext); }}>Correction Text <i className={"mdi " + this.state.setSorting.icon.correctiontext} /> </a></th>
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