import React from 'react';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, AirlineSelect } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;
class App extends React.Component {
    
    componentDidMount() {
        document.title = "Retro Claim Management | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.retroclaim.retroclaimskyin,
            columns: [
                {
                    type: 'html', title: 'Departure Date', dataIndex: 'departuredate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Flight Information', dataIndex: 'flightinformation',
                    render: (_value, row) => {
                        let operatingairline = (row.operatingairline) ? row.operatingairline : null;
                        let operatingfltnumber = (row.operatingfltnumber) ? row.operatingfltnumber : null;
                        if (operatingairline || operatingairline) {
                            return `${operatingairline} ${operatingfltnumber}`;
                        } else {
                            return "-";
                        }
                    }
                },
                {
                    type: 'html', title: 'Route', dataIndex: 'route', sorter: false,
                    render: (_value, row) => { return `${row.origin ? row.origin : ''} - ${row.destination ? row.destination : ''}` }
                },
                {
                    type: 'html', title: 'Ticket Name', dataIndex: 'ticketname', sorter: true,
                    render: (value) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Eligibility Denial Info', dataIndex: 'eligibilitydenialinfo', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Eligibility Denial Code', dataIndex: 'eligibilitydenialcode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '7%',
                    render: (_value, row) => {
                        return (
                            <Button url={`/retro-claim-skyteam-in-manager/form/${row.id}`} size="small" title="View" icon="eye" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" />
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Departure Date", datafield: "departuredate", type: 'datepicker', placeholder: 'Departure Date', showDefaultSearch: true },
            { labeltext: "Airline", datafield: "operatingairline", type: 'component', component: AirlineSelect, placeholder: 'Airline', showDefaultSearch: true, custom: true, customRender: true, criteria: { alliancetype: 'INTERNALGA' } },
            { labeltext: "Flight Number", datafield: "operatingfltnumber", type: 'text', placeholder: 'Flight Number', showDefaultSearch: false },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, validationrules: ['pattern.number', 'min.9'] },
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: false },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: false },
            { labeltext: "Ticket Name", datafield: "ticketname", type: 'text', placeholder: 'Ticket Name', showDefaultSearch: false },
            { labeltext: "Ticket Number", datafield: "ticketnumber", type: 'text', placeholder: 'Ticket Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Retro Claim Management - SKYTEAM - IN</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} ref={(e) => { this.componentSearch = e }} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);