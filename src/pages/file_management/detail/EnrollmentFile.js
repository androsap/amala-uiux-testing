import React from 'react';
import { api } from '../../../config/Services';
import { SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';
import moment from 'moment';

class App extends React.Component {
    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { fileid } = this.props;
        const configurationSearchForm = [
            { labeltext: "Activity Ref. Number", datafield: "activityreferencenumber", type: 'text', placeholder: 'Activity Ref. Number', showDefaultSearch: true },
            { labeltext: "Card Number", datafield: "membernumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Process Date", datafield: "processdate", type: 'datepicker', placeholder: 'Process Date', showDefaultSearch: false },
            { labeltext: "Processing Message", datafield: "processingmessage", type: 'text', placeholder: 'Processing Message', showDefaultSearch: true },
            { labeltext: "Response Code", datafield: "responsecode", type: 'text', placeholder: 'Response Code', showDefaultSearch: false },
            { labeltext: "Remark", datafield: "remark", type: 'text', placeholder: 'Remark', showDefaultSearch: false },
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.enrollmentfiledata.list,
            criteria: { fileid },
            columns: [
                { type: 'field', title: 'Activity Ref. Number', dataIndex: 'activityreferencenumber', sorter: true },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'membernumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'First Name', dataIndex: 'firstname', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Process Date', dataIndex: 'processdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'html', title: 'Mileage', dataIndex: 'mileage', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Processing Message', dataIndex: 'processingmessage', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Response Code', dataIndex: 'responsecode', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-'; }
                },
                {
                    type: 'html', title: 'File Name', dataIndex: 'filename', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-'; }
                }
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