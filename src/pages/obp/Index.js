import React from 'react';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TableBase, AirportSelect, AirlineSelect } from '../../components/Base/BaseComponent';
import ViewUsage from './View';
import { Form, Divider, Row, Col, Typography, Modal, Empty } from 'antd';
import moment from 'moment';
import { SaveRequest } from '../../utilities/RequestService';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: {},
            sort: {},
            loading: false,
            visible: false,
            searching: false
        };
    }

    componentDidMount() {
        document.title = "Manage OBP Data | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
                if (!err) {
                    let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                    criteria.departuredate = (criteria.departuredate) ? + moment(criteria.departuredate).format("YYYYMMDD") : null;
                    if (searching) {
                        this.componentTable.handleSearchForm(criteria);
                    }
                    this.setState({ searching });
                }
            })
    }

    handleOpenModal = (id) => {
        this.setState({ visible: true, id });
    };

    handleCloseDownloaded = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleOk = () => {
        this.setState({ showListModal: false, showAddModal: false });
        this.checkPermission();
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    generateOBP(id) {
        let url = api.url.obp.uin;
        let data = { id, operatingcarriercode: "GA" };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = 'UIN has been updated succesfully';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        });
    }

    resetUIN(id) {
        let url = api.url.obp.reset;
        let data = { id };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = responsemessage;
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        });
    }

    render() {
        const { loading, visible, id, searching } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "ffpnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Last Name", datafield: "lastname", type: 'text', placeholder: 'Last Name', showDefaultSearch: true },
            { labeltext: "Origin", datafield: "origin", type: 'component', component: AirportSelect, placeholder: 'Origin', showDefaultSearch: false },
            { labeltext: "Destination", datafield: "destination", type: 'component', component: AirportSelect, placeholder: 'Destination', showDefaultSearch: false },
            { labeltext: "Departure Date", datafield: "departuredate", type: 'datepicker', placeholder: 'Departure Date', showDefaultSearch: false },
            { labeltext: "Ticket Number", datafield: "ticketnumber", type: 'text', placeholder: 'Ticket Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "PNR", datafield: "pnr", type: 'text', placeholder: 'PNR', showDefaultSearch: false },
            { labeltext: "Operating Carrier", datafield: "operatingcarriercode", type: 'component', component: AirlineSelect, placeholder: 'Operating Carrier', showDefaultSearch: false, custom:true },
            { labeltext: "Operating Flight Number", datafield: "operatingfltnumber", type: 'text', placeholder: 'Operating Flight Number', showDefaultSearch: false },
            { labeltext: "Operating Compartment", datafield: "operatingbookingclass", type: 'text', placeholder: 'Operating Compartment', showDefaultSearch: false },
            { labeltext: "Operating Sub Class", datafield: "operatingbookingsubclass", type: 'text', placeholder: 'Operating Sub Class', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.obp.list,
            sort: { departuredate: 'desc' },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'ffpnumber', sorter: true },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                { type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true },
                { type: 'field', title: 'Origin', dataIndex: 'origin', sorter: true },
                { type: 'field', title: 'Destination', dataIndex: 'destination', sorter: true },
                {
                    type: 'html', title: 'Departure Date', dataIndex: 'departuredate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true },
                { type: 'field', title: 'PNR', dataIndex: 'pnr', sorter: true },
                { type: 'field', title: 'Operating Carrier', dataIndex: 'operatingcarriercode', sorter: true },
                { type: 'field', title: 'Operating Flight Number', dataIndex: 'operatingfltnumber', sorter: true },
                { type: 'field', title: 'Operating Compartment', dataIndex: 'operatingbookingclass', sorter: true },
                { type: 'field', title: 'Operating Sub Class', dataIndex: 'operatingbookingsubclass', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" icon="eye" onClick={() => this.handleOpenModal(row.id)} title="View" className="btn-custom-info" />
                                <Button url={'/obp/form/' + row.id} size="small" icon="edit" actioncode="UPDATE" title="Edit" />
                                <Button htmlType='button' size='small' icon='check' title='Generate UIN' actioncode='GNRT' menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.generateOBP(row.id, row.operatingcarriercode)} className={row.uin === null ? 'btn-custom-dark-blue' : 'hidden'} />
                                <Button htmlType='button' size='small' icon='close' title='Reset UIN' actioncode='RESET' menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.resetUIN(row.id)} className={row.uin !== null ? 'btn-custom-red' : 'hidden'} />
                            </span>
                        )
                    }
                },
            ]
        }
        return (
            <React.Fragment>
                <Modal
                    title="View OBP Data"
                    loading={loading}
                    visible={visible}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    footer={null}
                    width={900}
                >
                    <ViewUsage id={id} closemodalrefresh={this.handleCloseDownloaded} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage OBP Data</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/obp/form/'} size="middle" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} showAdvanceSearch={true} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find a Member</Title>
                <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
            </React.Fragment >
        )
    }
}

export default Form.create()(App);