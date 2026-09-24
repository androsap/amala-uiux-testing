import React from 'react';
import moment from 'moment';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import CancelAir from './Air';
import CancelNonAir from './NonAir';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardnumber: props.cardnumber,
            certificateid: props.certificateid,
            awardcategory: props.awardcategory,
            redeemuser: [],
            loading: false,
            redeemairactivity: [],
            activityprice: null,
            certificatedetail: {},
        }
    }

    getStore() {
        return this.state;
    }

    //handle reload data
    handleRefresh = () => {
        this.componentDidMount();
    }

    updatePage(value) {
        this.setState(value);

        this.props.updatePage({
            displayactivitypage: 'INDEX'
        });
    }

    componentDidMount() {
        const { certificateid, awardcategory } = this.state;
        this.getDetail(certificateid, awardcategory);
    }

    componentWillReceiveProps(props) {
        this.setState({
            displayactivitypage: props.displayactivitypage
        })
    }

    getDetail(certificateid, awardcategory) {
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid, awardcategory };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    loading: false,
                    redeemairactivity: (result.redeemairactivity) ? result.redeemairactivity : null,
                    activityprice: (result.redeemairactivity.price) ? result.redeemairactivity.price : null,
                    certificatedetail: {
                        memberid: (result.memberid) ? result.memberid : null,
                        awardcode: (result.awardcode) ? result.awardcode : '-',
                        awardtype: (result.awardtypename) ? result.awardtypename : '-',
                        certificateprice: (result.redeemuser.certificateprice) ? result.redeemuser.certificateprice : '0',
                        status: (result.redeemuser.status) ? result.redeemuser.status : '-',
                        issueddate: (result.issueddate) ? moment(result.issueddate).format('DD/MM/YYYY') : '-',
                        validitydate: (result.validitydate) ? moment(result.validitydate).format('DD/MM/YYYY') : '-',
                        freeaward: (result.freeaward) ? 'Yes' : 'No',
                        bookingcode: (result.bookingcode) ? result.bookingcode : '-',
                        selfusage: (result.redeemuser.selfusage) ? 'Yes' : 'No',
                        ticketnumber: (result.ticketnumber) ? result.ticketnumber : '-',
                        ticketvaliditydate: (result.ticketvaliditydate) ? moment(result.ticketvaliditydate).format('DD/MM/YYYY') : '-'
                    }
                });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    render() {
        const { certificatedetail, certificateid, cardnumber, awardcategory, redeemairactivity, activitiesDetail, redeemAirActivities, activityprice } = this.state;

        return (
            <div className="container-fluid">
                <form className="clearfix position-relative" autoComplete="off">
                    {
                        (awardcategory === 'AIR') ?
                            <CancelAir {...this.props} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} refreshMainPage={this.handleRefresh} certificatedetail={certificatedetail} cardnumber={cardnumber} certificateid={certificateid} awardcategory={awardcategory} redeemairactivity={redeemairactivity} activitiesDetail={activitiesDetail} redeemAirActivities={redeemAirActivities} activityprice={activityprice} /> :
                            <CancelNonAir {...this.props} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} refreshMainPage={this.handleRefresh} certificatedetail={certificatedetail} cardnumber={cardnumber} certificateid={certificateid} awardcategory={awardcategory} />
                    }
                </form>
            </div>
        )
    }
}


export default Layout;