import React from 'react';
import { api } from '../../../config/Services';
import { SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

class App extends React.Component {
    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { fileid } = this.props;
        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Last Name", datafield: "lastname", type: 'text', placeholder: 'Last Name', showDefaultSearch: false },
            { labeltext: "Date of Redeem", datafield: "dateofredeem", type: 'datepicker', placeholder: 'Date of Redeem', showDefaultSearch: false },
            { labeltext: "Miles", datafield: "miles", type: 'text', placeholder: 'Miles', showDefaultSearch: false },
            { labeltext: "Point", datafield: "point", type: 'text', placeholder: 'Point', showDefaultSearch: false },
            { labeltext: "Reward Code", datafield: "rewardcode", type: 'text', placeholder: 'Reward Code', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'text', placeholder: 'Status', showDefaultSearch: true },
            { labeltext: "Remark", datafield: "remark", type: 'text', placeholder: 'Remark', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.filedata.transferpoint,
            criteria: { fileid: fileid },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                { type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true },
                {
                    type: 'html', title: 'Date of Redeem', dataIndex: 'dateofredeem', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Miles', dataIndex: 'miles', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Point', dataIndex: 'point', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Reward Code', dataIndex: 'rewardcode', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value, row, index) => { return (value ? jsUcfirst(value, '_') : '-') }
                },
            ]
        };
        return (
            <React.Fragment>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
