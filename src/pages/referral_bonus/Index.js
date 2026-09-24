import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TierSelect, MembershipSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Referral Bonus | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;

        const configurationSearchForm = [
            { datafield: "membershipid", type: 'component', placeholder: 'Membership', showDefaultSearch: true, component: MembershipSelect },
            { datafield: "tierid", type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect },
            { datafield: "tiermiles", type: 'text', placeholder: 'Tier Miles', showDefaultSearch: false },
            { datafield: "awardmiles", type: 'text', placeholder: 'Award Miles', showDefaultSearch: false },
            { datafield: "frequency", type: 'text', placeholder: 'Frequency', showDefaultSearch: false },
            { datafield: "period", type: 'datepicker', placeholder: 'Date Period', showDefaultSearch: true, specialSearch: true },
        ];

        const configurationTable = {
            url: api.url.referralbonus.list,
            columns: [
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                {
                    type: 'html', title: 'Start Period', dataIndex: 'startperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Period', dataIndex: 'endperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Max. Referring', dataIndex: 'maxreferring', sorter: true,
                    render: (val) => { return (val !== null) ? (val) : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (val) => { return (val) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (val, row) => {
                        return (
                            <Button url={`${this.props.location.pathname}/form/${row.tierreferralbonusid}`} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Referral Bonus</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={`${this.props.location.pathname}/form`} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
