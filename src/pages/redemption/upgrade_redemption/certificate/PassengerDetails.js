import React, { Component } from 'react';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salutation: '',
            name: '',
            familyname: '',
            memberid: '',
            travelertype: '',
            selfusage: '',
            numbercertificate: ''
        };
    }

    componentWillReceiveProps(props) {
        const { salutation, name, familyname, memberid, travelertype, selfusage,numbercertificate } = props.data;
        this.setState({ salutation, name, familyname, memberid, travelertype, selfusage, numbercertificate });
    }

    render() {
        const { salutation, name, familyname, memberid, travelertype, selfusage, numbercertificate } = this.state;
        return (
            <div className="card mt-3" key={numbercertificate}>
                <div className="card-body">
                    <h4 className="mt-2">Passanger Details</h4>
                    <hr className="mt-1" />
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="salutation-view">Salutation </label>
                                <div className="col-sm-9" htmlFor="salutationvalue-view"> {salutation}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="name-view">Name </label>
                                <div className="col-sm-9" htmlFor="namevalue-view">{name} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="familyname-view">Family Name </label>
                                <div className="col-sm-9" htmlFor="familynamevalue-view"> {familyname}</div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="memberid-view">Member ID </label>
                                <div className="col-sm-9" htmlFor="memberidvalue-view"> {memberid}</div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="travelertype-view">Traveler Type </label>
                                <div className="col-sm-9" htmlFor="travelertypevalue-view">{(travelertype) ? travelertype : '-'} </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3" htmlFor="selfusage-view">Self Usage </label>
                                <div className="col-sm-9" htmlFor="selfusagevalue-view"> {(selfusage) ? "Yes" : "No"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout;