import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TierSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;

const optionsStatus = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Tier Completion Bonus | Loyalty Management System";
    }

    deleteData(tierbonusid, active) {
        let url = (active) ? api.url.tiercompletionbonus.deactivate : api.url.tiercompletionbonus.activate;
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
            { datafield: "promocompletionname", type: 'text', placeholder: 'Promo Name', showDefaultSearch: true },
            { datafield: "status", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus },
            { datafield: "awardmiles", type: 'text', placeholder: 'Award Miles', showDefaultSearch: false },
            { datafield: "tiermiles", type: 'text', placeholder: 'Tier Miles', showDefaultSearch: false },
            { datafield: "frequency", type: 'text', placeholder: 'Frequency', showDefaultSearch: false }
        ];

        const configurationTable = {
            url: api.url.tiercompletionbonus.list,
            columns: [
                { type: 'field', title: 'Tier', dataIndex: 'tierid' },
                { type: 'field', title: 'Promo', dataIndex: 'promocompletionname', sorter: true },
                {
                    type: 'html', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true,
                    render: (val) => { return (val) ? (val) : '-' }
                },
                {
                    type: 'html', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true,
                    render: (val) => { return (val) ? (val) : '-' }
                },
                {
                    type: 'html', title: 'Frequency', dataIndex: 'frequency', sorter: true,
                    render: (val) => { return (val) ? (val) : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (val) => { return val.toUpperCase() }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (_val, row) => {
                        return (
                            <span>
                                <Button url={`${this.props.location.pathname}/form/${row.tiercompletionbonusid}`} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
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
                        <Title level={3}>Manage Tier Completion Bonus</Title>
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