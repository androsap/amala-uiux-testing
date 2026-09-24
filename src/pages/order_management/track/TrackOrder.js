import React from 'react';
import { DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';

import Information from './Information';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            letterData: {},
            memberProfile: {},
            orderDetail: {},
            trackingDetail: {},
            vendorProduct: [],
            isLoading: false
        };
    };

    componentDidMount() {
        document.title = 'Manage Tracking Detail | Loyalty Management System';
        this.getList();
    };

    getList = async () => {
        await this.setState({ isLoading: true });

        const ordercode = this.props.match.params.ID;
        await RetrieveRequest(api.url.memberbuyproduct.retrieve, { ordercode }).then(async (response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result && result.length !== 0) {
                const { sendto, country, state, city, mailingproduct, lettercode, memberid, vendorregion } = result[0]

                await DetailRequest(api.url.mailingproduct.detail, { mailingproductcode: mailingproduct.mailingproductcode }).then(async (response) => {
                    const { status, result } = response;
                    const { responsecode, responsemessage } = status;
                    const { vendorproduct } = result;

                    if (responsecode === '0000' && result) {
                        let vendor = (!vendorproduct) ? null : (vendorproduct.length === 0) ? null : vendorproduct.filter((val) => { return val !== null });
                        let vendorPrinting = (!vendor) ? null : (vendor.length === 0) ? null : vendor.filter((val) => val.vendortype === 'PRINTING')[0];
                        let printingvendorname = (!vendorPrinting) ? null : (vendorPrinting.length === 0) ? null : vendorPrinting.vendorname;
                        let vendorPackaging = (!vendor) ? null : (vendor.length === 0) ? null : vendor.filter((val) => val.vendortype === 'PACKAGING')[0];
                        let packagingvendorname = (!vendorPackaging) ? null : (vendorPackaging.length === 0) ? null : vendorPackaging.vendorname;
                        let vendorCourier = (!vendor) ? null : (vendor.length === 0) ? null : vendor.filter((val) => val.vendortype === 'COURIER')[0];
                        let couriervendorname = (!vendorCourier) ? null : (vendorCourier.length === 0) ? null : vendorCourier.vendorname;
                        let vendorcourierregionname = (!vendorCourier) ? null : (vendorCourier.length === 0) ? null : (vendorCourier.regions.filter((val) => val.regioncode === vendorregion)[0]) ?
                            vendorCourier.regions.filter((val) => val.regioncode === vendorregion)[0].regionname : null;

                        this.setState({ vendorProduct: { ...result, printingvendorname, packagingvendorname, couriervendorname, vendorcourierregionname } });
                    } else Alert.error(responsemessage);
                });

                await DetailRequest(api.url.letter.detail, { lettercode }).then(async (response) => {
                    const { status, result } = response;
                    const { responsecode, responsemessage } = status;
                    if (responsecode === '0000' && result) {
                        this.setState({ letterData: result });
                    } else Alert.error(responsemessage)
                });

                await this.setState({ orderDetail: result[0] });
                if ((sendto === 'HOME') && (country || state || city)) {
                    const Address = [country, state, city, 'countrycode', 'statecode', 'citycode'];

                    for (var index = 0; index < Address.slice(0, 3).length; index++) {
                        await this.getDetailAddress(index, Address)
                    };
                };

                await DetailRequest(api.url.member.profile, { memberid }).then(async (response) => {
                    const { status, result } = response;
                    const { responsecode, responsemessage } = status;
                    if (responsecode === '0000' && result) {
                        this.setState({ memberProfile: result });
                    } else Alert.error(responsemessage)
                });
            } else Alert.error(responsemessage)
        });

        await DetailRequest(api.url.memberbuyproduct.tracking, { ordercode }).then(async (response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                this.setState({ trackingDetail: result });
            } else Alert.error(responsemessage)
            this.setState({ isLoading: false });
        });
    };

    getDetailAddress = async (index, Address) => {
        if (Address[index]) {
            const criteria = { [Address[index + 3]]: Address[index] };
            const url = (index === 0) ? api.url.country.list : (index === 1) ? api.url.state.list : api.url.city.list;
            RetrieveRequest(url, criteria).then(async (response) => {
                const { status, result } = response;
                const { responsecode, responsemessage } = status;

                if (responsecode === '0000' && result && result.length !== 0) {
                    if (index === 0) {
                        this.setState({ orderDetail: { ...this.state.orderDetail, countryname: result[0].countryname } })
                    } else if (index === 1) {
                        this.setState({ orderDetail: { ...this.state.orderDetail, statename: result[0].statename } })
                    } else this.setState({ orderDetail: { ...this.state.orderDetail, cityname: result[0].cityname } })
                } else Alert.error(responsemessage)
            });
        }
    };

    render() {
        const { isLoading, trackingDetail, orderDetail, memberProfile, letterData, vendorProduct } = this.state;

        return (
            <React.Fragment >
                <Information {...this.props} isLoading={isLoading} trackingDetail={trackingDetail} orderDetail={orderDetail} memberProfile={memberProfile} letterData={letterData} vendorProduct={vendorProduct} />
            </React.Fragment >
        );
    }
}

export default Form.create()(App);