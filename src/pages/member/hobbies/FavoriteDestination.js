import React from 'react';
import { api } from '../../../config/Services';
import { SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';

class App extends React.Component {
    componentDidMount() {
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    saveAction = (origin, destination) => {
        let memberid = this.props.match.params.ID;
        let actioncodecreate = (this.props.actioncode !== "UPDATE") ? true : false;
        let url = actioncodecreate ? api.url.favoritedestination.create : api.url.favoritedestination.update;
        let dataCreate = [{
            memberid: memberid,
            routetype: "DOMESTIC",
            origin: origin,
            destination: destination,
        }];
        let dataUpdate = [{
            memberid: memberid,
            routetype: "DOMESTIC",
            origin: origin,
            destination: destination,
            memberdestinationid: this.props.memberdestinationid
        }];
        this.setState({ isLoading: true });
        SaveRequest(url, (actioncodecreate ? dataCreate : dataUpdate)).then((response) => {
            const { responsecode, responsemessage } = response.status;
            let message = 'New data has been updated';
            if (responsecode.substring(0, 1) === '0') {
                message = (responsemessage) ? responsemessage : message;
                Alert.success(message);

                this.props.refreshList();
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            this.setState({ isLoading: false });
        })
    }

    render() {
        const configurationSearchForm = [
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.flightschedule.list,
            criteria: { airlinecode: "GA" },
            columns: [
                { type: 'field', title: 'Airline', dataIndex: 'airlinecode' },
                {
                    type: 'html', title: 'Route', dataIndex: 'route',
                    render: (value, row, index) => {
                        let origin = row.origin;
                        let destination = row.destination;
                        let route = `${origin} - ${destination}`;

                        return route;
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'select',
                    render: (value, row, index) => {
                        let origin = row.origin;
                        let destination = row.destination;

                        return (
                            <Button htmlType="button" size="small" label="Select" onClick={() => this.saveAction(origin, destination)} />
                        )
                    }
                },
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
