import React from 'react';
import { DeleteRequest, RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PartnerData: [],
        }
    };

    componentDidMount() {
        document.title = 'Manage Earning Miles | Loyalty Management System';
    };

    deleteData(earningmilesid) {
        let url = api.url.earningmiles.delete;
        let data = { earningmilesid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
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
            {
                labeltext: 'Partner Name', datafield: 'partnercode', type: 'select', placeholder: 'Partner Name', showDefaultSearch: true, onSearch: (e) => this.handlePartner(e),
                options: PartnerData, className: 'same-width', usingTitle: true, onChange: (e) => this.handlePartner(e)
            },
            { labeltext: 'Min. Miles', datafield: 'minmiles', type: 'text', placeholder: 'Min. Miles', showDefaultSearch: true },
            { labeltext: 'Max. Miles', datafield: 'maxmiles', type: 'text', placeholder: 'Max. Miles', showDefaultSearch: true },
            { labeltext: 'Effective Date', datafield: 'effectivedate', type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
            { labeltext: 'Discontinue Date', datafield: 'discontinuedate', type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.earningmiles.list,
            columns: [
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true },
                { type: 'field', title: 'Partner Name', dataIndex: 'partnername', sorter: true },
                { type: 'field', title: 'Min. Miles', dataIndex: 'minmiles', sorter: true },
                { type: 'field', title: 'Max. Miles', dataIndex: 'maxmiles', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/earning-miles/form/' + row.earningmilesid} size='small' label='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.earningmilesid)} />
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
                        <Title level={3}>Manage Earning Miles</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/earning-miles/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} ref={(e) => { this.componentSearchForm = e }} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);