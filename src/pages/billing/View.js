import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import { jsUcfirst } from '../../utilities/Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            areaList: [],
            dataList: [],
            isLoaded: false,
            active: '',
            errors: {}
        };
    }

    componentDidMount() {
        this.getDetail(this.props.billingfileid);
    }

    handleStatusChange = (event) => {
        let active = event === null ? null : event.target.value;
        this.setState({ active });
    }

    getDetail(billingfileid) {
        let url = api.url.billing.detail;
        let data = { billingfileid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    loading: false,
                    dataList: (result !== undefined) ? result : []
                });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage
                    }
                );
            }
        });
    }

    render() {
        if (this.state.responseCode.substring(0, 1) === '0') {
            const { loading, dataList } = this.state;
            var body = '';
            var number = 0;
            if (dataList.length) {
                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.ffpcarriercode}</td>
                            <td>
                                {
                                    (val.lastname) ? val.firstname + "/" + val.lastname : val.firstname + "/" + val.firstname
                                }
                            </td>
                            <td>{val.marketingcarrier}</td>
                            <td>{val.marketingfltnum}</td>
                            <td>{val.operatingcarriercode}</td>
                            <td>{val.operatingfltnumber}</td>
                            <td>{val.origin + " - " + val.destination}</td>
                            <td>{val.flighttypeindicator}</td>
                            <td>{jsUcfirst(val.billstatus, "_")}</td>
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

            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h3 className="title-has-control mt-2">Detail Bill</h3>
                            </div>
                            <hr className="mt-0" />
                            <form className="clearfix position-relative">
                                <Loader value={loading} />
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table className="table table-bordered table-striped table-hover">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th rowSpan="2">No</th>
                                                    <th rowSpan="2">FFP Carrier Code</th>
                                                    <th rowSpan="2">Pax Name</th>
                                                    <th colSpan="2">Marketing</th>
                                                    <th colSpan="2">Operating</th>
                                                    <th style={{ width: "10%" }} rowSpan="2">Route</th>
                                                    <th rowSpan="2">Flight Type Indicator</th>
                                                    <th rowSpan="2">Status</th>
                                                </tr>
                                                <tr>
                                                    <th>Carrier</th>
                                                    <th>Flight Number</th>
                                                    <th>Carrier</th>
                                                    <th>Flight Number</th>
                                                </tr>
                                            </thead>
                                            {body}
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;