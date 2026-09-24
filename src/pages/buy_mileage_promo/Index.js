/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-26 03:38:11
 * @modify date 2020-07-26 03:38:11
 * @desc Buy Mileage Promo Master
 */

import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title } = Typography;
const optionsUnitType = [
    { label: 'Piece', value: 'PIECE' },
    { label: 'Package', value: 'PACKAGE' }
];
// const optionsMileageType = [
//     { label: 'Award Miles', value: 'AWARDMILES' },
//     // { label: 'Upgrade', value: 'UPGRADE' },
//     // { label: 'Expiry', value: 'EXPIRY' },
//     // { label: 'Trqansfer', value: 'TRANSFER' },
//     // { label: 'Gift Card', value: 'GIFTCARD' }
// ];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Buy Mileage Promo | Loyalty Management System";
    }

    deleteData(promoid) {
        let url = api.url.buymileagepromo.delete;
        let data = { promoid };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Promo Name", datafield: "promoname", type: 'text', placeholder: 'Promo Name', showDefaultSearch: true },
            { labeltext: "Mileage Unit Type ", datafield: "mileageunittype", type: 'select', placeholder: 'Unit Type', showDefaultSearch: true, options: optionsUnitType },
            { labeltext: "Start Date ", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date ", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.buymileagepromo.list,
            criteria: { active: true },
            columns: [
                { type: 'field', title: 'Promo Code', dataIndex: 'promoid', sorter: true },
                { type: 'field', title: 'Promo Name', dataIndex: 'promoname', sorter: true },
                {
                    type: 'field', title: 'Mileage Unit Type', dataIndex: 'mileageunittype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value) : '-' }
                },
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
                                <Button url={'/buy-mileage-promo/form/' + row.promoid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.promoid)} />
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
                        <Title level={3}>Manage Buy Mileage Promo</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/buy-mileage-promo/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);