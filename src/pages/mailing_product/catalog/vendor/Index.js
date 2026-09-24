import React from 'react';
import { Form, Modal, Tooltip } from 'antd';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button, TableBase, SearchForm } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { VendorType, YesNoOptions } from '../../../../data';
import moment from 'moment';

import VendorForm from './Form';
class Vendor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            vendors: [],
            visible: {
                showvendorform: false,
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
            }
        }
    };

    checkPermission() {
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        const id = this.props.match.params.ID;

        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            };

            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        }
    };

    componentDidMount() {
        document.title = `Vendor Mailing Product | Loyalty Management System`;
        this.checkPermission();
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleEdit = (e, mailingproductvendorid, vendors) => {
        e.preventDefault();
        this.setState({ mailingproductvendorid, vendors });
        this.handleVisible(true, 'showvendorform');
    };

    handleDelete = (e, mailingproductvendorid) => {
        e.preventDefault();
        let url = api.url.mailingproduct.vendor.delete;
        var callback = (response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                Alert.success(status.responsemessage);
                this.handleRefreshTable();
            } else Alert.error(status.responsemessage);

        };

        DeleteRequest(url, { mailingproductvendorid }, callback);
    };

    handleRefreshTable = () => {
        setTimeout(() => { this.componentTable.getList(); }, 100);
    };

    handleVisible = (value, type) => {
        this.setState({ visible: { [type]: value } });
    };

    render() {
        const { visible, mailingproductvendorid, actionspage, vendors } = this.state;
        const { menucode, prefixmenuname, period, producttype } = this.props;
        const { showvendorform } = visible;

        const configurationSearchForm = [
            { labeltext: 'Vendor Name', datafield: 'vendorname', type: 'text', placeholder: 'Vendor Name', showDefaultSearch: true },
            { labeltext: 'Vendor Type', datafield: 'vendortype', type: 'select', placeholder: 'Vendor Type', showDefaultSearch: true, options: VendorType },
            { labeltext: 'All Region', datafield: 'allregion', type: 'select', placeholder: 'All Region', showDefaultSearch: true, options: YesNoOptions },
            { labeltext: 'Date', datafield: 'date', type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true, specialSearch: true },
        ];

        const configurationTable = {
            url: api.url.mailingproduct.vendor.retrieve,
            criteria: { mailingproductcode: this.props.match.params.ID },
            sort: { createdDate: 'desc' },
            columnClassName: 'nowrap',
            columns: [
                {
                    type: 'field', title: 'Vendor Name', dataIndex: 'vendorname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Vendor Type', dataIndex: 'vendortype', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'All Region', dataIndex: 'allregion', sorter: true,
                    render: (value, row) => { return (value === null || value === undefined) ? '-' : (value) ? 'Yes' : 'No' }
                },
                {
                    type: 'field', title: 'Regions', dataIndex: 'regions', sorter: false, width: '10%',
                    render: (value, row, index) => {
                        const regionname = value.map((obj) => { return ` ${obj.regionname}` }).toString();

                        return <Tooltip title={regionname}>{(regionname.length <= 20) ? regionname : `${regionname.substring(0, 18)} ...`}</Tooltip>
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        const { mailingproductvendorid } = row;
                        const { menucode, prefixmenuname } = this.props;

                        if (actionspage !== 'view') {
                            return (
                                <span>
                                    <Button htmlType='button' size='small' icon='edit' type='default' title='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={(e) => this.handleEdit(e, mailingproductvendorid, row)} />
                                    <Button htmlType='button' size='small' icon='delete' type='danger' title='Delete' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={(e) => this.handleDelete(e, mailingproductvendorid)} />
                                </span>
                            )
                        } else return null
                    }
                },
            ]
        };

        return (
            <React.Fragment>

                <Modal visible={showvendorform} title={'Edit Vendor'} onCancel={(e) => this.handleVisible(false, 'showvendorform')} footer={null} destroyOnClose={true} width={680}>
                    <VendorForm menucode={menucode} prefixmenuname={prefixmenuname} datasource={vendors} mailingproductvendorid={mailingproductvendorid} actionspage={actionspage} handleClose={(e) => this.handleVisible(false, 'showpriceform')}
                        mailingproductcode={this.props.match.params.ID} handleSavePrice={(e) => this.handleVisible(false, 'showvendorform')} handleRefreshTable={this.handleRefreshTable} period={period} vendors={vendors} producttype={producttype} />
                </Modal>

                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Vendor;

