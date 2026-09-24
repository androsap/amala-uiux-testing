import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { Status, PromoType, PromoPeriodType } from '../../data';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Redemption Promo | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        const newcriteria = {
            ...criteria,
            date: (criteria.date !== null) ? `${criteria.date}%` : null,
        };
        this.componentTable.handleSearchForm(newcriteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Promo Code", datafield: "promocode", type: 'text', placeholder: 'Promo Code', showDefaultSearch: true },
            { labeltext: "Promo Name", datafield: "catalogname", type: 'text', placeholder: 'Promo Name', showDefaultSearch: true },
            { labeltext: "Promo Type", datafield: "promotype", type: 'select', placeholder: 'Promo Type', options: PromoType, showDefaultSearch: false },
            { labeltext: "Period Type", datafield: "promoperiodtype", type: 'select', placeholder: 'Period Type', options: PromoPeriodType, showDefaultSearch: false },
            { labeltext: "Date", datafield: "date", type: 'datepicker', placeholder: 'Date', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', options: Status, showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.redemptionpromo.catalog.list,
            columns: [
                { type: 'field', title: 'Promo Code', dataIndex: 'promocode', sorter: true },
                { type: 'field', title: 'Promo Name', dataIndex: 'catalogname', sorter: true },
                {
                    type: 'field', title: 'Promo Type', dataIndex: 'promotype', sorter: true,
                    render: (value) => { return (value === 'AIR') ? 'AIR' : 'NON AIR' }
                },
                {
                    type: 'field', title: 'Participant Limit', dataIndex: 'participantlimit', sorter: true,
                    render: (value, row, index) => { return (value === 0) ? 'Unlimited' : value }
                },
                {
                    type: 'field', title: 'Member Use Limit', dataIndex: 'memberuselimit', sorter: true,
                    render: (value, row, index) => { return (value === 0) ? 'Unlimited' : value }
                },
                {
                    type: 'field', title: 'Period Type', dataIndex: 'promoperiodtype', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : 'Unlimited' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={{ pathname: '/promo-catalog/form/' + (row.promocatalogcode) }}
                                    size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Redemption Promo</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/promo-catalog/form/'}
                            size="middle" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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
