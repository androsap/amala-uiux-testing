import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, TierSelect, BranchSelect, CountrySelect, StateSelect, CitySelect, PartnerSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import { getProfile } from '../../utilities/AuthService';
import { MemberStatus, ReportMemberProfileChannel } from '../../data';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            criteria: {},
            fielddisabled: {
                enrollmentdatedisabled: true,
                countrydisabled: true,
                statedisabled: true,
                citydisabled: true,
            }
        }
        this.componentTable = [];

        this.handleEnrollmentDateFrom = this.handleEnrollmentDateFrom.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentDidMount() {
        document.title = "Member Profile Report | Loyalty Management System";
        let userBranch = (getProfile()) ? getProfile().branchcode : null;
        this.props.form.setFieldsValue({ branchoffice: userBranch });
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    const { country, state } = criteria;
                    /* remapping criteria */
                    criteria.country = (country) ? [country] : [];
                    criteria.state = (state) ? [state] : [];
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            }
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.memberprofilereport.generate;
            let criteria = this.state.criteria;
            let message = 'Generating report file...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode && responsecode === '0000') {
                    //window.location.href = response.result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    Modal.info({
                        content: (
                            <div>
                              <p>Your ID Report is {response.result.idgeneratereport}</p>
                              <Paragraph copyable={{ text: response.result.idgeneratereport }}>Copy ID Report.</Paragraph>
                            </div>
                          ),
                    });
                } else {
                    Alert.error(responsemessage);
                }
            });
        }

        confirm({
            title: 'Are you sure to generate this report file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    handleEnrollmentDateFrom = (enrollmentdatefrom) => {
        let enrollmentdatedisabled = (enrollmentdatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, enrollmentdatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ enrollmentdateto: undefined });
    }

    /* handle country change */
    handleCountryChange = async (countrycode) => {
        let statedisabled = true;
        let citydisabled = true;
        if (countrycode) {
            statedisabled = false;
            await this.props.form.setFieldsValue({ state: undefined, cityid: undefined });
            // await this.componentSearchForm.component.state.resetOptions()
            await this.componentSearchForm.component.state.retrieveData({ countrycode });
        }
        let fielddisabled = { ...this.state.fielddisabled, statedisabled, citydisabled };
        this.setState({ fielddisabled });
    }

    /* handle airline change */
    handleStateChange = async (statecode) => {
        let citydisabled = true;
        if (statecode) {
            citydisabled = false;
            await this.props.form.setFieldsValue({ cityid: undefined });
            await this.componentSearchForm.component.cityid.resetOptions()
            await this.componentSearchForm.component.cityid.retrieveData({ statecode });
        }
        let fielddisabled = { ...this.state.fielddisabled, citydisabled };
        this.setState({ fielddisabled });
    }

    render() {
        const { searching, fielddisabled } = this.state;
        const { enrollmentdatedisabled, statedisabled, citydisabled } = fielddisabled;

        const enrollmentdatefrom = this.props.form.getFieldValue('enrollmentdatefrom');
        const country = this.props.form.getFieldValue('country');
        const state = this.props.form.getFieldValue('state');

        const configurationSearchForm = [
            { labeltext: "Tier", datafield: "tier", type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect, validationrules: ['required'] },
            { labeltext: "BO Enrollment", datafield: "boenrollment", type: 'component', placeholder: 'BO Enrollment', showDefaultSearch: true, component: BranchSelect },
            { labeltext: "BO Address", datafield: "branchcodeaddress", type: 'component', placeholder: 'BO Address', showDefaultSearch: true, component: BranchSelect },
            { labeltext: 'Enroll Channel', datafield: 'enrollchannel', type: 'select', placeholder: 'Enroll Channel', showDefaultSearch: true, options: ReportMemberProfileChannel },
            { labeltext: "Enrollment Date From", datafield: "enrollmentdatefrom", type: 'datepicker', placeholder: 'Enrollment Date From', showDefaultSearch: false, onChange: (e) => this.handleEnrollmentDateFrom(e) },
            {
                labeltext: "Enrollment Date To", datafield: "enrollmentdateto", type: 'datepicker', placeholder: 'Enrollment Date To', showDefaultSearch: false,
                defaultPickerValue: enrollmentdatefrom, validationrules: enrollmentdatefrom ? ['required'] : [], disabled: !enrollmentdatefrom ? true : enrollmentdatedisabled,
                minDate: moment(enrollmentdatefrom)
            },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: MemberStatus },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: MemberStatus, className: 'hidden' },
            { labeltext: 'Partner', datafield: 'partnercode', type: 'component', placeholder: 'Partner', showDefaultSearch: true, component: PartnerSelect },
            {
                labeltext: "Country", datafield: "country", type: 'component', placeholder: 'Country', showDefaultSearch: false, component: CountrySelect,
                onChange: (e) => this.handleCountryChange(e), disabled: false
            },
            {
                labeltext: "State", datafield: "state", type: 'component', placeholder: 'State', showDefaultSearch: false, component: StateSelect,
                disabled: country ? statedisabled : true, validationrules: country ? ['required'] : [], onChange: (e) => this.handleStateChange(e)
            },
            {
                labeltext: "City", datafield: "cityid", type: 'component', placeholder: 'City', showDefaultSearch: false, component: CitySelect,
                disabled: country ? citydisabled : true, validationrules: state ? ['required'] : []
            },
        ];
        const configurationTable = {
            url: api.url.memberprofilereport.list,
            columnClassName: "nowrap",
            columns: [
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'DOB', dataIndex: 'dateofbirth', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Nationality', dataIndex: 'nationality', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Religion', dataIndex: 'religionname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Salutation', dataIndex: 'salutationname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Gender', dataIndex: 'gender', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Email Address', dataIndex: 'emailaddress', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Phone Number', dataIndex: 'phonenumber', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Address', dataIndex: 'address', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'City', dataIndex: 'cityname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Country', dataIndex: 'countryname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                // { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                // { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                // { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                {
                    type: 'field', title: 'Enrollment Channel', dataIndex: 'enrollchannel', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Membership Period', dataIndex: 'membershipperiod', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Language', dataIndex: 'langname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'BO Code', dataIndex: 'branchcodeenroll', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Status', dataIndex: 'memberstatus', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                }
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Member Profile Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Row type="flex" justify="end" style={{ marginBottom: 10 }} className={(searching) ? '' : 'hidden'}>
                        <Button htmlType="button" type="primary" size="small" icon="download" label="Generate Report ID" onClick={() => this.handleDownloadModal()} />
                    </Row>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find the Transaction</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);
