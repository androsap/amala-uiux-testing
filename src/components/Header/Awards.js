import React, { Component } from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import moment from 'moment';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: true,
            awardcode: '',
            partnername: '',
            awardtype: '',
            certificatecode: '',
            awardtypecode: '',
            categorytype: '',
            pricingby: '',
            startdate: null,
            enddate: null,
            awardstatus: ''
        };
    }

    componentDidMount() {
        let awardcode = this.props.id;
        this.getDetail(awardcode);
    }

    getDetail(awardcode) {
        let url = api.url.awardmaster.detailbasicinfo;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    loading: false,
                    awardcode: result.awardcode,
                    partnername: result.partnercode,
                    awardtypecode: result.awardtypecode,
                    categorytype: result.categorytype,
                    certificatecode: result.certificatecode,
                    pricingby: result.pricingby,
                    startdate: (result.startdate) ? moment(result.startdate).format("DD/MM/YYYY") : "-",
                    enddate: (result.enddate) ? moment(result.enddate).format("DD/MM/YYYY") : "-",
                    awardstatus: result.awardstatus
                });
            } else {
                this.setState({
                    loading: false,
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    render() {
        const { loading, formrender } = this.state;

        if (!loading) {
            if (formrender) {
                const { awardcode, partnername, awardtypecode, categorytype, pricingby, startdate, enddate, awardstatus } = this.state;
                return (
                    <div className="top-section">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="profile-section">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="f-12">Award Code</div>
                                            </div>
                                            <div className="col-sm-8">
                                                <span className="list-content">{awardcode}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="f-12">Partner</div>
                                            </div>
                                            <div className="col-sm-8">
                                                <span className="list-content">{partnername}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="profile-section">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">Award Type Code</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content">{awardtypecode}</span>
                                            </div>
                                        </div>
                                        {/* <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">Certificate Code</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content">{certificatecode}</span>
                                            </div>
                                        </div> */}
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">Category</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content"> {categorytype}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="profile-section">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <p className="d-flex justify-content-center">Princing</p>
                                                <span className="numeric d-flex justify-content-center"> {pricingby} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="profile-section">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">Start Date</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content">{startdate}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">End Date</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content">{enddate}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="f-12">Status</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="list-content"> {awardstatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                const { responseMessage } = this.state;
                return (
                    <div className="top-section">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-6 offset-md-3">
                                    <div className="content-title flex-hr m-2 title-description">
                                        <h1 className="title-has-control mt-2 d-flex justify-content-center">Something Went Wrong</h1>
                                        <div className="title-has-control d-flex justify-content-center">
                                            <blockquote className="blockquote"><p> {responseMessage}</p></blockquote>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div className="top-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6 offset-md-3">
                                <div className="content-title flex-hr m-2 title-description">
                                    <h1 className="title-has-control mt-2 d-flex justify-content-center">Please wait</h1>
                                    <div className="title-has-control d-flex justify-content-center">
                                        <blockquote className="blockquote"><p> Please wait for data retrieval</p></blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Layout;