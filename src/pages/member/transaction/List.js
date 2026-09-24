import React, { Component } from 'react';
import ErrorGeneral from '../../error/ErrorGeneral';
import Pagination from "../../../components/Pagination";
import { GeneralRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from "../../../components/Alert";
import moment from 'moment';
import Button from '../../../components/Button';

const prefixmenuname = 'MBRTRANS';
const menucode = 'MBRTRANS';

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                active: "true"
            },
            data: {
                memberid: props.memberid,
                channel: "BO"
            },
            sort: {
                createddate: 'desc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    trxdate: '',
                    trxtype: '',
                    comment: '',
                    awardmiles: '',
                    tiermiles: '',
                    frequency: '',
                    createddate: 'asc'
                },
                icon: {
                    trxdate: '',
                    trxtype: '',
                    comment: '',
                    awardmiles: '',
                    tiermiles: '',
                    frequency: '',
                    createddate: 'mdi-arrow-down-bold'
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
                    trxdate: target === 'trxdate' ? prevState.setSorting.type.trxdate === 'desc' ? 'asc' : 'desc' : '',
                    trxtype: target === 'trxtype' ? prevState.setSorting.type.trxtype === 'desc' ? 'asc' : 'desc' : '',
                    comment: target === 'comment' ? prevState.setSorting.type.comment === 'desc' ? 'asc' : 'desc' : '',
                    awardmiles: target === 'awardmiles' ? prevState.setSorting.type.awardmiles === 'desc' ? 'asc' : 'desc' : '',
                    tiermiles: target === 'tiermiles' ? prevState.setSorting.type.tiermiles === 'desc' ? 'asc' : 'desc' : '',
                    frequency: target === 'frequency' ? prevState.setSorting.type.frequency === 'desc' ? 'asc' : 'desc' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    trxdate: target === 'trxdate' ? prevState.setSorting.type.trxdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    trxtype: target === 'trxtype' ? prevState.setSorting.type.trxtype === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    comment: target === 'comment' ? prevState.setSorting.type.comment === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    awardmiles: target === 'awardmiles' ? prevState.setSorting.type.awardmiles === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    tiermiles: target === 'tiermiles' ? prevState.setSorting.type.tiermiles === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    frequency: target === 'frequency' ? prevState.setSorting.type.frequency === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
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

    getList() {
        const { paging, criteria, sort, data } = this.state;
        let url = api.url.membertransaction.list;
        let column = [];
        var result = GeneralRequest(url, paging, column, criteria, sort, data);
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

    handleChangePage(displayPage) {
        this.props.updatePage({
            displayactivitypage: displayPage
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
                                <td>{moment(val.trxdate).format('DD/MM/YYYY')}</td>
                                <td>{val.trxtype}</td>
                                <td>{(val.comment) ? val.comment : '-'}</td>
                                <td className="text-right">{val.awardmiles}</td>
                                <td className="text-right">{val.tiermiles}</td>
                                <td className="text-right">{val.frequency}</td>
                                <td>{moment(val.createddate).format('DD/MM/YYYY')}</td>
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
                        <h1 className="mt-2">Manage Transaction</h1>
                        <Button onClick={() => this.handleChangePage('FORM')} type="button" label="Add New" className="btn btn-default normal btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'trxdate', this.state.setSorting.type.trxdate); }}>Transaction Date <i className={"mdi " + this.state.setSorting.icon.trxdate} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'trxtype', this.state.setSorting.type.trxtype); }}>Transaction Type <i className={"mdi " + this.state.setSorting.icon.trxtype} /> </a></th>
                                <th>Statement</th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'awardmiles', this.state.setSorting.type.awardmiles); }}>Award Miles <i className={"mdi " + this.state.setSorting.icon.awardmiles} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'tiermiles', this.state.setSorting.type.tiermiles); }}>Tier Miles <i className={"mdi " + this.state.setSorting.icon.tiermiles} /> </a></th>
                                <th><a href="" onClick={e => { this.handleSorting(e, 'frequency', this.state.setSorting.type.frequency); }}>Frequency <i className={"mdi " + this.state.setSorting.icon.frequency} /> </a></th>
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
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default TransactionList;