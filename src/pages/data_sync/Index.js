import React from 'react';
import { api } from '../../config/Services';
import { SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showmorerequest: false,
        }
    }

    componentDidMount() {
        document.title = "Data Sync Monitoring | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) return;

            const syncdatestart = this.props.form.getFieldValue('syncdatestart');
            const syncdateend = this.props.form.getFieldValue('syncdateend');

            // block hanya jika start ada tapi end kosong
            const blocked = syncdatestart && !syncdateend;

            if (!blocked) {
                this.componentTable.handleSearchForm(criteria);
            }

            this.setState({ criteria });
        });
    };

    render() {
        const syncdatestart = this.props.form.getFieldValue("syncdatestart");
        const formatXML = (xml) => {
            if (typeof xml !== 'string') return '';
            let formatted = '';
            const reg = /(>)(<)(\/*)/g;
            xml = xml.replace(reg, '$1\r\n$2$3');
            let pad = 0;
            xml.split('\r\n').forEach((node) => {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) pad -= 2;
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 2;
                }
                formatted += new Array(pad + 1).join(' ') + node + '\r\n';
                pad += indent;
            });
            return formatted.trim();
        };
        const configurationTable = {
            url: api.url.datasync.list,
            sort: { syncdate: 'desc' },
            columns: [
                { type: 'field', title: 'Type', dataIndex: 'type', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Operation', dataIndex: 'operation', sorter: true },
                {
                    type: 'html', title: 'Sequence Number', dataIndex: 'sequencenumber', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Sync Date', dataIndex: 'syncdate', sorter: true, width: '8%',
                    render: (value, row, index) => { return (value) ? moment(value).format('DD-MM-YYYY HH:mm:ss') : '' }
                },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'CsxNumber', dataIndex: 'csxnumber', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'ErrorCode', dataIndex: 'errorcode', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Request', dataIndex: 'request', width: '20%',
                    render: (value, row, index) => {
                        if (!value || !Object.keys(value).length) return '-';

                        let str = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                        str = str.replace(/\\n/g, '\n');

                        const key = `showmorerequest${index}`;
                        const show = this.state[key];
                        const limit = 60;

                        return (
                            <div>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                                    {show ? str : str.slice(0, limit) + (str.length > limit ? '...' : '')}
                                </pre>
                                {str.length > limit && (
                                    <a onClick={() => this.setState({ [key]: !show })}>
                                        {show ? 'Show Less . . .' : 'Show More . . .'}
                                    </a>
                                )}
                            </div>
                        );
                    }
                },
                {
                    type: 'html', title: 'Response', dataIndex: 'response', width: '20%',
                    render: (value, _, i) => {
                        if (!value || !Object.keys(value).length) return '-';

                        let str = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                        str = str.trim().startsWith('<') ? formatXML(str) : str.replace(/\\n/g, '\n');

                        const key = `showmoresponse${i}`;
                        const show = this.state[key];
                        const limit = 60;
                        const text = show ? str : str.slice(0, limit) + (str.length > limit ? '...' : '');

                        return (
                            <div>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{text}</pre>
                                {str.length > limit && (
                                    <a onClick={() => this.setState({ [key]: !show })}>
                                        {show ? 'Show Less . . .' : 'Show More . . .'}
                                    </a>
                                )}
                            </div>
                        );
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, validationrules: ['pattern.number', 'min.9'], maxLength: 9 },
            { labeltext: "Operation", datafield: "operation", type: 'text', placeholder: 'Operation', showDefaultSearch: true },
            { labeltext: "Sync Date Start", datafield: "syncdatestart", type: 'datepicker', placeholder: 'Sync Date Start', showDefaultSearch: true },
            { labeltext: "Sync Date End", datafield: "syncdateend", type: 'datepicker', placeholder: 'Sync Date End', validationrules: syncdatestart ? ['required'] : [], disabled: syncdatestart ? false : true, minDate: moment(syncdatestart), showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Data Sync Monitoring</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);