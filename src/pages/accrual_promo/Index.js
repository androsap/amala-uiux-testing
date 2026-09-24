import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Accrual Promo | Loyalty Management System";
    }

    deleteData(promocode) {
        let url = api.url.accrualpromo.delete;
        let data = { promocode };
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

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Promo Code", datafield: "promocode", type: 'text', placeholder: 'Promo Code', showDefaultSearch: true },
            { labeltext: "Promo Name", datafield: "promoname", type: 'text', placeholder: 'Promo Name', showDefaultSearch: true },
            { labeltext: "Award Miles Factor", datafield: "awardmilesfactor", type: 'exact', placeholder: 'Award Miles Factor', showDefaultSearch: false },
            { labeltext: "Tier Miles Factor", datafield: "tiermilesfactor", type: 'exact', placeholder: 'Tier Miles Factor', showDefaultSearch: false },
            { labeltext: "Frequency Factor", datafield: "frequencyfactor", type: 'exact', placeholder: 'Frequency Factor', showDefaultSearch: false },
            { labeltext: "Retro Start Date", datafield: "startretroperiod", type: 'datepicker', placeholder: 'Retro Start Date', showDefaultSearch: true, specialSearch: true },
            { labeltext: "Retro End Date", datafield: "endretroperiod", type: 'datepicker', placeholder: 'Retro End Date', showDefaultSearch: true, specialSearch: true }
        ];
        const configurationTable = {
            url: api.url.accrualpromo.list,
            columns: [
                { type: 'field', title: 'Promo Code', dataIndex: 'promocode', sorter: true },
                { type: 'field', title: 'Promo Name', dataIndex: 'promoname', sorter: true },
                { type: 'field', title: 'Award Miles Factor', dataIndex: 'awardmilesfactor', sorter: true },
                { type: 'field', title: 'Tier Miles Factor', dataIndex: 'tiermilesfactor', sorter: true },
                { type: 'field', title: 'Frequency Factor', dataIndex: 'frequencyfactor', sorter: true },
                {
                    type: 'html', title: 'Retro Start Date', dataIndex: 'startretroperiod',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Retro End Date', dataIndex: 'endretroperiod',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/accrual-promo/form/' + row.promocode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.promocode)} />
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
                        <Title level={3}>Manage Accrual Promo</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/accrual-promo/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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
