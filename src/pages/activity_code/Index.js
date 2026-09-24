import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { RetrieveRequest } from '../../utilities/RequestService';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PartnerData: [],
        }
    };

    componentDidMount() {
        document.title = 'Manage Non Air Activity Code | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handlePartner = (value) => {
        if (value && value.length > 2) {
            RetrieveRequest(api.url.partner.list, { partnername: `%${value}%` }).then((response) => {
                const { status = {}, result } = response || {};
                const { responsecode, responsemessage } = status || {};
                if (responsecode === '0000' && result) {
                    var PartnerData = result.map(obj => {
                        var result2 = {};
                        result2['label'] = `${obj.partnercode} - ${obj.partnername}`;
                        result2['value'] = obj.partnercode;
                        return result2;
                    });

                    this.setState({ PartnerData })
                } else Alert.error(responsemessage);
            });
        } else this.setState({ PartnerData: [] });
    };

    render() {
        const { PartnerData } = this.state;
        const { menucode, prefixmenuname } = this.props;

        const configurationSearchForm = [
            { labeltext: 'Activity Code', datafield: 'activitycode', type: 'text', placeholder: 'Activity Code', showDefaultSearch: true },
            { labeltext: 'Activity Name', datafield: 'activityname', type: 'text', placeholder: 'Activity Name', showDefaultSearch: true },
            {
                labeltext: 'Partner', datafield: 'partnercode', type: 'select', placeholder: 'Partner', showDefaultSearch: true, onSearch: (e) => this.handlePartner(e),
                options: PartnerData, className: 'same-width', usingTitle: true, onChange: (e) => this.handlePartner(e)
            },
        ];
        const configurationTable = {
            url: api.url.activitycode.list,
            criteria: { active: true },
            columns: [
                { type: 'field', title: 'Activity Code', dataIndex: 'activitycode', sorter: true },
                { type: 'field', title: 'Activity Name', dataIndex: 'activityname', sorter: true },
                {
                    type: 'html', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Partner Name', dataIndex: 'partnername', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => { return (value) ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={`/activity-code/form/${row.activitycode}`} size='small' label='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Non Air Activity Code</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/activity-code/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

export default Form.create()(App);