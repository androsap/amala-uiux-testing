import React from 'react';
import { api } from '../../../config/Services';
import { SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';
import moment from 'moment';
import { formatNumber } from '../../../utilities/Helpers';

class App extends React.Component {
    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const memberid = this.props.match.params.ID;
        const configurationSearchForm = [
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.memberbuymileagelimit.list,
            criteria: { memberid },
            sort: { startdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return value ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return value ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'field', title: 'Allowed Mileage', dataIndex: 'allowedmileage', sorter: true,
                    render: (value, row, index) => { return (value !== undefined && value !== null) ? formatNumber(value) : '-' }
                },
                {
                    type: 'field', title: 'Total Mileage', dataIndex: 'totalmileage', sorter: true,
                    render: (value, row, index) => { return (value !== undefined && value !== null) ? formatNumber(value) : '-' }
                }
            ]
        };
        return (
            <React.Fragment>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
