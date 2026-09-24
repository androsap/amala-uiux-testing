import React from 'react';
import { connect } from "react-redux";
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Row } from 'antd';

const configurationSearchForm = [
    { labeltext: "Compartment Code", datafield: "compartmentcode", type: 'text', placeholder: 'Compartment Code', showDefaultSearch: true },
    { labeltext: "Subclass Code", datafield: "subclasscode", type: 'text', placeholder: 'Subclass Code', showDefaultSearch: true }
];

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddRoute = this.handleAddRoute.bind(this);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleAddRoute = () => {
        this.props.handleAdd(this.componentTable.state.rowsSelection.selectedRows);
    }

    render() {
        const configurationTable = {
            rowKey: record => record.compartmentcode + "" + record.subclasscode,
            url: api.url.subclass.list,
            criteria: { airlinecode: this.props.airlinecode },
            columns: [
                { type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true, width: '30%' },
                { type: 'field', title: 'Compartment Code', dataIndex: 'compartmentcode', sorter: true, width: '30%' },
                { type: 'field', title: 'Subclass Code', dataIndex: 'subclasscode', sorter: true, width: '30%' }
            ]
        };

        return (
            <React.Fragment>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} rowSelection={true} defaultRowSelected={this.props.defaultRowSelected} defaultRowSelectedKey={this.props.defaultRowSelectedKey} pagination={false} scroll={{ y: 240 }} />

                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                    <Button htmlType="submit" type="default" label="Add" onClick={this.handleAddRoute} />
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));