import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { StatusPromoFile, TypePromoFile } from '../../data';
import { Form, Divider, Row, Col, Typography, Tooltip } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title, Paragraph } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Redemption Promo File | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { match, form } = this.props;
        const configurationSearchForm = [
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: true },
            { labeltext: "Type", datafield: "type", type: 'select', placeholder: 'Type', options: TypePromoFile, showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: StatusPromoFile, showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.redemptionpromo.filetype.list,
            columns: [
                {
                    type: 'html', title: 'File Name', dataIndex: 'filename', sorter: true,
                    render: (value) => { return (value.length > 25) ? <Tooltip title={<Paragraph copyable style={{ color: '#ffffff' }}>{value}</Paragraph>}>{value.substring(0, 25) + '...'}</Tooltip> : value }
                },
                { type: 'field', title: 'Type', dataIndex: 'type', sorter: true },
                { type: 'field', title: 'Total Record', dataIndex: 'totalrecord', sorter: true },
                { type: 'field', title: 'Success Record', dataIndex: 'successrecord', sorter: true },
                { type: 'field', title: 'Failed Record', dataIndex: 'failedrecord', sorter: true },
                {
                    type: 'html', title: 'Remarks', dataIndex: 'remarks', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return jsUcfirst(value, '_').toUpperCase() }
                },
                { type: 'field', title: 'Reference', dataIndex: 'reference', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <Button url={{
                                pathname: `${match.url}/form/${row.promofilecode}`,
                                state: {
                                    promofilecode: row.promofilecode,
                                    filename: row.filename
                                }
                            }} size="small" label="View" />
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Redemption Promo File</Title>
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