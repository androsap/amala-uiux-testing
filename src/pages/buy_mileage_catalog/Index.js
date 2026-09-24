import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';
import { PriceType } from '../../data';

const { Title } = Typography;
const optionsUnitType = [
    { label: 'Piece', value: 'PIECE' },
    { label: 'Package', value: 'PACKAGE' }
];
const optionsMileageType = [
    { label: 'Award Miles', value: 'AWARDMILES' },
    { label: 'Expired', value: 'EXPIRED' },
    // { label: 'Upgrade', value: 'UPGRADE' },
    // { label: 'Trqansfer', value: 'TRANSFER' },
    // { label: 'Gift Card', value: 'GIFTCARD' }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Buy Mileage Catalog | Loyalty Management System";
    }

    deleteData(buymileageid) {
        let url = api.url.buymileagecatalog.delete;
        let data = { buymileageid };
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
    };

    activeDeactive = (buymileageid, active) => {
        let url = (active) ? api.url.buymileagecatalog.deactivate : api.url.buymileagecatalog.activate;
        let data = { buymileageid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success(responsemessage)
            } else Alert.error(responsecode);
            this.componentTable.getList();
        }
        DeleteRequest(url, data, callback, active);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Catalogue Name", datafield: "buymileagename", type: 'text', placeholder: 'Catalogue Name', showDefaultSearch: true },
            { labeltext: "Mileage Type ", datafield: "mileagetype", type: 'select', placeholder: 'Mileage Type', showDefaultSearch: false, options: optionsMileageType },
            { labeltext: "Unit Type ", datafield: "unittype", type: 'select', placeholder: 'Unit Type', showDefaultSearch: true, options: optionsUnitType },
            { labeltext: "Price Type ", datafield: "pricetype", type: 'select', placeholder: 'Price Type', showDefaultSearch: false, options: PriceType },
            { labeltext: "Base Mileage", datafield: "basemileage", type: 'text', placeholder: 'Base Mileage', showDefaultSearch: false },
            { labeltext: "Start Date ", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date ", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.buymileagecatalog.list,
            sort: { createddate: 'desc' },
            columns: [
                { type: 'field', title: 'Catalogue Name', dataIndex: 'buymileagename', sorter: true },
                { type: 'field', title: 'Mileage Type', dataIndex: 'mileagetype', sorter: true },
                {
                    type: 'field', title: 'Unit Type', dataIndex: 'unittype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Price Type', dataIndex: 'pricetype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value) : '-' }
                },
                { type: 'field', title: 'Base Mileage', dataIndex: 'basemileage', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/buy-mileage-catalog/form/' + row.buymileageid} size="small" title="Edit" icon="edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" title="Delete" icon="delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.buymileageid)} />
                                {
                                    (row.active) ? <Button htmlType="button" size="small" label="Deactivate" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.activeDeactive(row.buymileageid, row.active)} /> :
                                        <Button htmlType="button" size="small" type="default" className="btn-custom-green" label="Activate" actioncode="DELETE" onClick={() => this.activeDeactive(row.buymileageid, row.active)} />
                                }
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
                        <Title level={3}>Manage Buy Mileage Catalog</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/buy-mileage-catalog/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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
