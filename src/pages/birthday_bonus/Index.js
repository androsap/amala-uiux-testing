import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TierSelect, ChannelSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Birthday Bonus | Loyalty Management System";
    }

    deleteData(tierbonusid, active) {
        let url = (active) ? api.url.birthdaybonus.deactivate : api.url.birthdaybonus.activate;
        let data = { tierbonusid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback, active);
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;

        const configurationSearchForm = [
            { datafield: "tierid", type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect },
            { datafield: "enrollchannel", type: 'component', placeholder: 'Enroll Channel', showDefaultSearch: true, component: ChannelSelect },
            { datafield: "tiermiles", type: 'text', placeholder: 'Tier Miles', showDefaultSearch: false },
            { datafield: "awardmiles", type: 'text', placeholder: 'Award Miles', showDefaultSearch: false },
            { datafield: "frequency", type: 'text', placeholder: 'Frequency', showDefaultSearch: false },
            { datafield: "bonusstartperiod", type: 'datepicker', placeholder: 'Start Period', showDefaultSearch: true, specialSearch: true },
            { datafield: "bonusendperiod", type: 'datepicker', placeholder: 'End Period', showDefaultSearch: true, specialSearch: true }
        ];

        const configurationTable = {
            url: api.url.birthdaybonus.list,
            columns: [
                {
                    type: 'html', title: 'Tier', dataIndex: 'tierid',
                    render: (val, row) => { return (val) ? (`${row.membershipname} - ${row.tiername}`) : '-' }
                },
                {
                    type: 'html', title: 'Enroll Channel', dataIndex: 'enrollchannel', sorter: true,
                    render: (val) => { return (val) ? (val) : '-' }
                },
                {
                    type: 'html', title: 'Specific Type', dataIndex: 'specificchannel',
                    render: (val, row) => { return (row.partnercode || row.branchcode) ? (`Yes - ${row.partnercode || row.branchcode}`) : 'No' }
                },
                { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                {
                    type: 'html', title: 'Start Period', dataIndex: 'bonusstartperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Period', dataIndex: 'bonusendperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (val) => { return (val) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (val, row) => {
                        return (
                            <span>
                                <Button url={`${this.props.location.pathname}/form/${row.tierbonusid}`} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button 
                                    htmlType="button" 
                                    size="small" 
                                    type={row.active ? "danger" : "default"}
                                   className={!row.active ? "btn-custom-green" : null}
                                    label={row.active ? "Deactivate" : "Activate"} 
                                    actioncode="DELETE" 
                                    onClick={() => this.deleteData(row.tierbonusid, row.active)} 
                                /> 
                                {/* <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tierbonusid)} /> */}
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
                        <Title level={3}>Manage Birthday Bonus</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={`${this.props.location.pathname}/form`} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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
