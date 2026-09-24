import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Redemption Promo File Data | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { form, location } = this.props;
        const { promofilecode, filename } = location.state;
        const configurationSearchForm = [
            { labeltext: "Data", datafield: "data", type: 'text', placeholder: 'Data', showDefaultSearch: true },
            { labeltext: "Response Code", datafield: "responsecode", type: 'text', placeholder: 'Response Code', showDefaultSearch: true },
            { labeltext: "Response Message", datafield: "responsemessage", type: 'text', placeholder: 'Response Message', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.redemptionpromo.filedata.list,
            criteria: { promofilecode },
            columns: [
                { type: 'field', title: 'Data', dataIndex: 'data', sorter: true },
                { type: 'field', title: 'Response Code', dataIndex: 'responsecode', sorter: true },
                { type: 'field', title: 'Response Message', dataIndex: 'responsemessage', sorter: true },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value) => { return value ? value : '-' }
                }
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}><Button url='/promo-file' shape="circle" icon="left" /> Redemption Promo File Data ({filename})</Title>
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