import React from 'react';
import { connect } from "react-redux";
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Row } from 'antd';

const configurationSearchForm = [
    { labeltext: "Flight Number", datafield: "flightnumber", type: 'text', placeholder: 'Flight Number', showDefaultSearch: true },
    { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
    { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true }
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
        this.props.handleAddRoute(this.componentTable.state.rowsSelection.selectedRows);
    }

    render() {
        const configurationTable = {
            rowKey: record => record.flightscheduleid,
            url: api.url.flightschedule.list,
            criteria: { airlinecode: this.props.airlinecode, active: true },
            columns: [
                { type: 'field', title: 'Airline Code', dataIndex: 'airlinecode', sorter: true },
                { type: 'field', title: 'Flight Number', dataIndex: 'flightnumber', sorter: true },
                { type: 'field', title: 'Origin', dataIndex: 'origin', sorter: true },
                { type: 'field', title: 'Destination', dataIndex: 'destination', sorter: true }
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