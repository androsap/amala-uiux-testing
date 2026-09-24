import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest, RetrieveRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Status } from '../../data';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
        };
    }

    componentDidMount() {
        document.title = "Redemption Promo Category Type | Loyalty Management System";
        this.getOptions();
    }

    getOptions(){
        let paging = { limit: -1, page: 20 }
        let criteria = { 
            "criteriatypecode": this.props.match.params.ID 
        };
        let sort = {
            "categorytypecode": "asc"
        };
        let url = api.url.redemptionpromo.categorytype.list;
        let column = [
            "categorytypecode",
        ];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                var options = response.result.map(({ categorytypecode }) => {
                    return {
                        label: categorytypecode,
                        value: categorytypecode
                    };
                });
                this.setState({ options })
            }
        });
    }

    changeData(categorytypecode, active) {
        let url = (active) ? api.url.redemptionpromo.categorytype.deactivate : api.url.redemptionpromo.categorytype.activate;
        let data = { categorytypecode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been changed';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback, active);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { match, form } = this.props;
        const criteriatypecode = match.params.ID;
        const configurationSearchForm = [
            { labeltext: "Category Type Code", datafield: "categorytypecode", type: 'select', options: this.state.options, placeholder: 'Category Type Code', showDefaultSearch: true },
            { labeltext: "Category", datafield: "category", type: 'text', placeholder: 'Category', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status Type', showDefaultSearch: true, options: Status },
        ];
        const configurationTable = {
            url: api.url.redemptionpromo.categorytype.list,
            criteria: { criteriatypecode },
            columns: [
                { type: 'field', title: 'Category Type Code', dataIndex: 'categorytypecode', sorter: true },
                { type: 'field', title: 'Category', dataIndex: 'category', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'active',
                    render: (value, { categorytypecode, active }, index) => {
                        const isActive = value;
                        return (
                            <Button
                                htmlType="button"
                                size="small"
                                type={isActive ? "danger" : "default"}
                                {...isActive ? null : { className: "btn-custom-green" }}
                                label={isActive ? "Deactivate" : "Activate"}
                                onClick={() => this.changeData(categorytypecode, active)}
                            />
                        )
                    }
                },

            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}> <Button url={'/promo-criteria-type'} shape="circle" icon="left" /> Redemption Promo Category Type ({criteriatypecode}) </Title>
                    </Col>
                    <Divider />
                </Row>

                <SearchForm form={form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
