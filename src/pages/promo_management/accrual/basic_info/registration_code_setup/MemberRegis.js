import React from 'react';
import { api } from '../../../../../config/Services';
import { SearchForm, TableBase } from '../../../../../components/Base/BaseComponent';
import { Form } from 'antd';

class App extends React.Component {
    componentDidMount() { };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    render() {
        const { datapromo } = this.props;
        const { promocode } = (datapromo) ? datapromo[0] : {};
        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.promomanage.member.retrieve,
            criteria: { promocode },
            columns: [
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, align: 'center',
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }

        return (
            <React.Fragment>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

export default Form.create()(App);
