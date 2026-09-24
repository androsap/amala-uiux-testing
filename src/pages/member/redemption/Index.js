import React from 'react';
import { Redirect } from 'react-router-dom';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, Alert, ErrorGeneral, CheckboxBase, AwardTypeSelect } from '../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../utilities/RequestService';
import { getProfile } from '../../../utilities/AuthService';
import { Form, Divider, Row, Col, Typography, Skeleton, Spin } from 'antd';
import moment from 'moment';
import TicketNumberForm from '../certificate/TicketNumber';
import { MemberLockAlert } from '../../../components/Partials';

const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseMessage: '',
            eligibleredeemstatus: false,
            addticketnumber: false,
            path: null,
            isLoadingTicketNumber: false,
            fieldvalue: {
                certificateid: null,
                cardnumber: null,
                name: null,
                familyname: null
            }
        }
    }

    getEligibleRedeem = () => {
        let cardnumber = this.props.cardnumber;
        let data = { cardnumber };
        let url = api.url.redemption.eligibleredeem;
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { result } = response;
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0' && result.redeemstatus !== undefined) {
                this.setState({ eligibleredeemstatus: result.redeemstatus, responseMessage: responsemessage });
            } else {
                Alert.error(responsemessage);
                this.setState({ responseMessage: responsemessage });
            }
            //call loader
            this.setState({ isLoading: false });
        });
    }

    componentDidMount() {
        document.title = "Member Redemption | Loyalty Management System";
        this.getEligibleRedeem();
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleAllAward = (event) => {
        let showall = event === null ? null : event.target.checked;
        const { awardmiles, tierid } = this.props;
        let criteria = {
            channel: "BO",
            showall,
            mileage: awardmiles,
            username: getProfile().username,
            eligibletier: tierid
        };

        this.componentTable.handleSearchForm(criteria);
    }

    handleValidationBuy = (path) => {
        let username = getProfile().username;
        let data = { username };
        let url = api.url.redemptioncertificate.getemptyticketnumber;
        this.setState({ isLoadingTicketNumber: true });
        /* check ticket number empty */
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const { result } = response;
                if (result.length > 0) {
                    const certificateid = (result && result[0]) ? result[0] : null;
                    let url = api.url.redemptioncertificate.detail;
                    let data = { certificateid };
                    //call loader
                    /* get data cardnumber & name from service detail certificate */
                    DetailRequest(url, data).then((response) => {
                        let { status, result } = response;
                        if (status.responsecode.substring(0, 1) === '0' && result) {
                            const cardnumber = (result && result['redeemusers'] && result['redeemusers']['memberiduser']) ? result['redeemusers']['memberiduser'] : null;
                            const name = (result && result['redeemusers'] && result['redeemusers']['name']) ? result['redeemusers']['name'] : null;
                            const familyname = (result && result['redeemusers'] && result['redeemusers']['familyname']) ? result['redeemusers']['familyname'] : null;

                            const fieldvalue = { ...this.state.fieldvalue, certificateid, cardnumber, name, familyname };

                            this.setState({ addticketnumber: true, isLoadingTicketNumber: false, fieldvalue });
                        } else {
                            Alert.error(response.status.responsemessage);
                            this.setState({ isLoadingTicketNumber: false });
                        }
                    });
                } else {
                    this.setState({ addticketnumber: false, path, isLoadingTicketNumber: false });
                }
            } else {
                Alert.error(response.status.responsemessage);
                this.setState({ isLoadingTicketNumber: false });
            }
        });
    }

    handleCancel = () => {
        this.setState({ addticketnumber: false, path: null });
    }

    render() {
        const { awardmiles, tierid, memberlock } = this.props;
        const { isLoadingTicketNumber, eligibleredeemstatus, isLoading, responseMessage, addticketnumber, fieldvalue } = this.state;
        const { blockredeem } = memberlock || {};

        let configurationTable = {
            url: api.url.awardlist.getawardredeemlist,
            criteria: {
                channel: "BO",
                showall: false,
                mileage: awardmiles,
                username: getProfile().username,
                eligibletier: tierid
            },
            columns: [
                { type: 'field', title: 'Award Code', dataIndex: 'awardcode', sorter: true },
                { type: 'field', title: 'Award Type', dataIndex: 'awardtypename', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                {
                    type: 'html', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Price', dataIndex: 'pricingby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : row.pricingby }
                },
                (!blockredeem) ? {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        let url = row.categorycode.toLowerCase();
                        return (
                            <span>
                                {/* <Button url={this.props.match.url + '/' + url + '/' + row.awardcode} size="small" label="Buy" /> */}
                                <Button htmlType="button" size="small" label="Buy" onClick={() => this.handleValidationBuy(this.props.match.url + '/' + url + '/' + row.awardcode)} />
                            </span>
                        )
                    }
                } : ''
            ]
        };

        let configurationSearchForm = [
            { labeltext: "Award Type", datafield: "awardtypecode", type: 'component', placeholder: 'Award Type', component: AwardTypeSelect, showDefaultSearch: true },
            { labeltext: "Award Code", datafield: "awardcode", type: 'text', placeholder: 'Award Code', showDefaultSearch: true },
            { labeltext: "Name", datafield: "name", type: 'text', placeholder: 'Name', showDefaultSearch: true },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false },
        ];

        if (!isLoading) {
            if (!addticketnumber && this.state.path) { return (<Redirect to={{ pathname: this.state.path }} />) }
            if (eligibleredeemstatus) {
                return (
                    <React.Fragment>
                        <Row>
                            <Col xs={24} xl={20}>
                                <Title level={4}>Redemption</Title>
                            </Col>
                            <Col xs={24} xl={4} style={{ textAlign: "right" }}>
                                <CheckboxBase form={this.props.form} datafield='showallaward' onChange={this.handleAllAward}> Show All Award</CheckboxBase>
                            </Col>
                            <Divider />
                            {(blockredeem) ? <MemberLockAlert memberlock={memberlock} /> : ''}
                        </Row>
                        <Spin spinning={isLoadingTicketNumber} tip="Please wait while checking the ticket number">
                            <TicketNumberForm {...fieldvalue} visible={addticketnumber} handleClose={this.handleCancel} />
                            <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                            {
                                ((awardmiles !== null && awardmiles !== undefined) && tierid) ?
                                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} /> : null
                            }
                        </Spin>
                    </React.Fragment>
                );
            } else {
                return (<ErrorGeneral {...this.props} message={responseMessage} custom={true} />);
            }
        } else {
            return (<Skeleton />);
        }
    }
}

export default Form.create()(App);