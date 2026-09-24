import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert, CriteriaTypeCodeSelect } from '../../components/Base/BaseComponent';
import { Status } from '../../data';
import { Form, Divider, Row, Col, Typography } from 'antd';

const { Title } = Typography;

class App extends React.Component {

    componentDidMount() {
        document.title = "Redemption Promo Criteria Type | Loyalty Management System";
    }

    changeData(criteriatypecode, active) {
        let url = (active) ? api.url.redemptionpromo.criteriatype.deactivate : api.url.redemptionpromo.criteriatype.activate;
        let data = { criteriatypecode };
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
        const { menucode, prefixmenuname, match, form } = this.props;
        const configurationSearchForm = [
            { labeltext: "Criteria Type Code", datafield: "criteriatypecode", type: 'component', component: CriteriaTypeCodeSelect, placeholder: 'Criteria Type Code', showDefaultSearch: true },
            { labeltext: "Criteria", datafield: "criteria", type: 'text', placeholder: 'Criteria', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status Type', showDefaultSearch: true, options: Status },
        ];
        const configurationTable = {
            url: api.url.redemptionpromo.criteriatype.list,
            columns: [
                { type: 'field', title: 'Criteria Type Code', dataIndex: 'criteriatypecode', sorter: true },
                { type: 'field', title: 'Criteria', dataIndex: 'criteria', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'active',
                    render: (value, { criteriatypecode, active }, index) => {
                        const isActive = value;
                        const props = {
                            menucode,
                            prefixmenuname
                        }

                        return (
                            <Row type="flex" gutter={3}>
                                <Col>
                                <Button
                                    url={`${match.url}/category-type/${criteriatypecode}`}
                                    size="small"
                                    label="View"
                                    actioncode="VIEW"
                                />
                                </Col>
                                <Col>
                                <Button
                                    htmlType="button"
                                    size="small"
                                    type={isActive ? "danger" : "default"}
                                    {...isActive ? null : { className: "btn-custom-green" }}
                                    label={isActive ? "Deactivate" : "Activate"}
                                    {...props}
                                    onClick={() => this.changeData(criteriatypecode, active)}
                                />
                                </Col>
                                
                            </Row>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Redemption Promo Criteria Type</Title>
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