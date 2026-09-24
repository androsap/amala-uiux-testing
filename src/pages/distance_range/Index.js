import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, AirlineSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import CityPair from './CityPair';
import TableBase from '../../components/Table/TableBase';
import { RouteType } from '../../data';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Distance Range Code", datafield: "distancerangecode", type: 'text', placeholder: 'Distance Range Code', showDefaultSearch: true },
    { labeltext: "Distance Range Name", datafield: "distancerangename", type: 'text', placeholder: 'Distance Range Name', showDefaultSearch: true },
    { labeltext: "Bottom Range", datafield: "bottomrange", type: 'text', placeholder: 'Bottom Range', showDefaultSearch: true },
    { labeltext: "Upper Range", datafield: "upperrange", type: 'text', placeholder: 'Upper Range', showDefaultSearch: true },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: false },
    { labeltext: "Origin", datafield: "originairport", type: 'text', placeholder: 'Origin', showDefaultSearch: false },
    { labeltext: "Destination", datafield: "destinationairport", type: 'text', placeholder: 'Destination', showDefaultSearch: false },
    { labeltext: 'Route Type', datafield: 'routetype', type: 'select', options: RouteType, placeholder: 'Route Type', showDefaultSearch: false },
    { labeltext: 'Airline Code', datafield: 'airlinecode', type: 'text', placeholder: 'Airline Code', showDefaultSearch: false },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            distancerangename: null,
            route: null,
            bottomrange: null,
            upperrange: null,
            airlinecode: null
        };
    }

    componentDidMount() {
        document.title = "Manage Distance Range | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (distancerangename, route, bottomrange, upperrange, airlinecode) => {
        this.setState({ visible: true, distancerangename, route, bottomrange, upperrange, airlinecode });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, distancerangename, route, bottomrange, upperrange, airlinecode } = this.state;
        const configurationTable = {
            url: api.url.distancerange.list,
            columnClassName: "nowrap",
            retrieveCustom: true,
            noColumnRequest: true,
            sort: { effectivedate: "desc" },
            columns: [
                {
                    type: 'field', title: 'Distance Range Code', dataIndex: 'distancerangecode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Distance Range Name', dataIndex: 'distancerangename', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Bottom Range', dataIndex: 'bottomrange', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Upper Range', dataIndex: 'upperrange', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Origin', dataIndex: 'originairport', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Destination', dataIndex: 'destinationairport', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'TPM', dataIndex: 'tpm', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Route Type', dataIndex: 'routetype', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="City Pair" onClick={() => this.handleOpenModal(row.distancerangename, row.routetype, row.bottomrange, row.upperrange, row.airlinecode)} />
                                <Button url={'/distance-range/form/' + row.distancerangecode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Distance Range</Title>
                    </Col>
                    <Modal visible={visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                        <CityPair distancerangename={distancerangename} route={route} bottomrange={bottomrange} upperrange={upperrange} airlinecode={airlinecode} closeModalRefresh={this.handleCloseModalRefresh} />
                    </Modal>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/distance-range/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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