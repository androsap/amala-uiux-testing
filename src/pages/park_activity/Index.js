import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Park Activity | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Activity Date", datafield: "activitydate", type: 'datepicker', placeholder: 'Activity Date', showDefaultSearch: true },
            { labeltext: "Flight Number", datafield: "marketingflightnumber", type: 'text', placeholder: 'Flight Number', showDefaultSearch: false },
            { labeltext: "Airline", datafield: "marketingairlinecode", type: 'text', placeholder: 'Airline', showDefaultSearch: true },
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
            { labeltext: "Ticket Number", datafield: "ticketnumber", type: 'text', placeholder: 'Ticket Number', showDefaultSearch: false, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "Booking Person Alias", datafield: "bookingpersonalias", type: 'text', placeholder: 'Booking Person Alias', showDefaultSearch: true },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: false, maxLength: 20, validationrules: ['pattern.number'] }
        ];
        const configurationTable = {
            url: api.url.parkactivity.list,
            sort: { activitydate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Activity Date', dataIndex: 'activitydate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Flight Number', dataIndex: 'marketingflightnumber', sorter: true },
                { type: 'field', title: 'Airline', dataIndex: 'marketingairlinecode', sorter: true },
                { type: 'field', title: 'Origin', dataIndex: 'origin', sorter: true },
                { type: 'field', title: 'Destination', dataIndex: 'destination', sorter: true },
                { type: 'field', title: 'Booking Class', dataIndex: 'bookingclass', sorter: true },
                { type: 'field', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true },
                { type: 'field', title: 'Booking Person Alias', dataIndex: 'bookingpersonalias', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true }
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Park Activity</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/park-activity/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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