import React from 'react';
import { api } from '../../../config/Services';
import { TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';

const optionsAddressType = [
    { label: 'PRIVATE', value: 'PRIVATE' },
    { label: 'BUSINESS', value: 'BUSINESS' }
];
const optionsStatus = [
    { label: "Active", value: true },
    { label: "Incative", value: false }
];
const configurationSearchForm = [
    { labeltext: "Address Type", datafield: "addresstype", type: 'select', placeholder: 'Address Type', showDefaultSearch: true, options: optionsAddressType },
    { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus }
];

class App extends React.Component {
    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const configurationTable = {
            url: api.url.memberaddress.list,
            criteria: { memberid: this.props.memberid },
            columns: [
                { type: 'field', title: 'Address Type', dataIndex: 'addresstype', sorter: true },
                {
                    type: 'html', title: 'Address', dataIndex: 'address', sorter: false,
                    render: (value, row, index) => { return (value) ? row.address + ', ' + row.cityname + ', ' + row.statename + ', ' + row.countryname : "Inactive" }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? "Active" : "Inactive" }
                }
            ]
        };

        return (
            <React.Fragment>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);