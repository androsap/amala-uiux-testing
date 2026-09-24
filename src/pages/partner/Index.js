import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Alert, Button, TableBase, SearchForm, CheckboxBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Menu, Button as AntButton, Dropdown, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsPartnerType = [
    { label: "AIR", value: "AIR" },
    { label: "NONAIR", value: "NONAIR" }
];
const configurationSearchForm = [
    { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
    { labeltext: "Partner Name", datafield: "partnername", type: 'text', placeholder: 'Partner Name', showDefaultSearch: true },
    { labeltext: "Partner Type", datafield: "partnertype", type: 'select', placeholder: 'Partner Type', showDefaultSearch: true, options: optionsPartnerType },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true },
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Partner | Loyalty Management System";
    }

    deleteData(partnercode) {
        let url = api.url.partner.delete;
        let data = { partnercode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleBulk = (event) => {
        let havebulk = null;
        if (event?.target?.checked === true) { havebulk = true };
        
        let criteria = { havebulk };

        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const configurationTable = {
            url: api.url.partner.list,
            columns: [
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true },
                { type: 'field', title: 'Partner Name', dataIndex: 'partnername', sorter: true },
                { type: 'field', title: 'Partner Type', dataIndex: 'partnertype', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? "Active" : "Inactive" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={{ pathname: '/partner/bulk', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active, havebulk: row.havebulk } }} size="small" icon="gift" title="Transaction" className="btn-custom-info"/>
                                <Button url={{ pathname: '/partner/cobrand', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active } }} size="small" icon="api" title="Cobrand" type="primary"/>
                                <Button url={'/partner/form/' + row.partnercode} size="small" icon="edit" title={(usermenu[menucode] && usermenu[menucode][menucode + '_UPDATE']) ? 'Edit' : 'View'} actioncode="UPDATE"/>
                                <Button htmlType="button" size="small" icon="delete" title="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.partnercode)} />
                                
                                {/* <Dropdown overlay={
                                    <Menu>
                                        {
                                            (usermenu['PARTBULK'] && usermenu['PARTBULK']['PARTBULK_ACCESS']) ?
                                                <Menu.Item key="1" className={(row.havebulk) ? '' : 'hidden'}>
                                                    <Link to={{ pathname: '/partner/bulk', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active } }}>Bulk</Link>
                                                </Menu.Item> : null
                                        }
                                        {
                                            (usermenu['PARTCOBR'] && usermenu['PARTCOBR']['PARTCOBR_ACCESS']) ?
                                                <Menu.Item key="2">
                                                    <Link to={{ pathname: '/partner/cobrand', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active } }} menucode="PARTCOBR" prefixmenuname="PARTCOBR" actioncode="ACCESS">Cobrand</Link>
                                                </Menu.Item> : null
                                        }
                                        <Menu.Item key="3">
                                            <Link to={'/partner/form/' + row.partnercode}>{(usermenu[menucode] && usermenu[menucode][menucode + '_UPDATE']) ? 'Edit' : 'View'}</Link>
                                        </Menu.Item>
                                        {
                                            (usermenu[menucode] && usermenu[menucode][prefixmenuname + '_DELETE']) ?
                                                <Menu.Item key="4">
                                                    <Link to="#" onClick={() => this.deleteData(row.partnercode)}>Delete</Link>
                                                </Menu.Item> : null
                                        }
                                    </Menu>
                                }>
                                    <AntButton type="default" size="small">
                                        Actions <Icon type="down" />
                                    </AntButton >
                                </Dropdown> */}
                                
                                {/* <Button url={{ pathname: '/partner/bulk', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active } }} size="small" label="Bulk" className="btn-custom-info" className="btn-custom-dark-blue" menucode="PARTBULK" prefixmenuname="PARTBULK" actioncode="ACCESS" />
                                {
                                    (row.partnertype === 'NONAIR') ? <Button url={{ pathname: '/partner/cobrand', state: { partnercode: row.partnercode, partnername: row.partnername, activepartner: row.active } }} size="small" label="Cobrand" className="btn-custom-dark-blue" menucode="PARTCOBR" prefixmenuname="PARTCOBR" actioncode="ACCESS" /> : ''
                                }
                                <Button url={'/partner/form/' + row.partnercode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                 <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.partnercode)} /> */}
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
                        <Title level={3}>Manage Partner</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/partner/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <Row>
                    <Col xs xl={21}>
                        <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    </Col>
                    <Col xs={24} xl={3} style={{ textAlign: "right", marginTop: 20 }}>
                        <CheckboxBase form={this.props.form} datafield='showallaward' onChange={this.handleBulk}>Partner Bulk Miles</CheckboxBase>
                    </Col>
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));