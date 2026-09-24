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
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: true },
            { labeltext: "Cobrand Code", datafield: "cobrandcode", type: 'text', placeholder: 'Cobrand Code', showDefaultSearch: true },
            { labeltext: "Termination Date", datafield: "terminationdate", type: 'datepicker', placeholder: 'Termination Date', showDefaultSearch: true },
            { labeltext: "Processing Message", datafield: "processingmessage", type: 'text', placeholder: 'Processing Message', showDefaultSearch: false },
            { labeltext: "Processing Result Code", datafield: "processingresultcode", type: 'text', placeholder: 'Processing Result Code', showDefaultSearch: false },
            { labeltext: "Remark", datafield: "remark", type: 'text', placeholder: 'Remark', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.filedata.terminate,
            criteria: { fileid },
            columns: [
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'File Name', dataIndex: 'filename', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Termination Date', dataIndex: 'terminationdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'html', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Processing Message', dataIndex: 'processingmessage', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Processing Result Code', dataIndex: 'processingresultcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value) => { return (value) ? value : '-'; }
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
