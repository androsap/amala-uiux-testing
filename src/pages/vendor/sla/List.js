import React from 'react';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Alert, Button, TableBase, SearchForm, VendorRegionSelect } from '../../../components/Base/BaseComponent';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { jsUcfirst } from '../../../utilities/Helpers';

const { Title } = Typography;

const optionsType = [
    { value: 'DAYS', label: 'Days' },
    { value: 'WEEKS', label: 'Weeks' },
    { value: 'MONTHS', label: 'Months' },
]
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
        }
    }

    componentDidMount() {
        document.title = "Manage Vendor SLA | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    onEdit = (e, slaid) => {
        e.preventDefault();
        this.props.handleEditRegion(slaid);
    }

    deleteData(slaid) {
        let url = api.url.vendorsla.delete;
        let data = { slaid };
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
    }


    handleChangePage(page, slaid = null) {
        this.props.changePage({ page, slaid });
    }

    render() {
        const { menucode, prefixmenuname } = this.props;

        const configurationTable = {
            url: api.url.vendorsla.retrieve,
            sort: { createdDate: 'desc' },
            criteria: { vendorcode: this.props.vendorcode },
            columns: [
                { type: 'field', title: 'SLA Type', dataIndex: 'slatype', sorter: true, width: '10%' },
                {
                    type: 'field', title: 'All Region', dataIndex: 'allregion', sorter: true, width: '10%',
                    render: (value) => { return (value) ? 'YES' : 'NO' }
                },
                {
                    type: 'field', title: 'Region', dataIndex: 'slaregion', sorter: true, ellipsis: true, width: '30%',
                    render: (value) => { const regionname = value.map((obj) => ' ' + obj.regionname).toString(); return regionname }
                },
                {
                    type: 'field', title: 'SLA Days', dataIndex: 'slaindays', sorter: true, align: 'center', width: '10%',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'SLA Weeks', dataIndex: 'slainweeks', sorter: true, align: 'center', width: '10%',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'SLA Months', dataIndex: 'slainmonths', sorter: true, align: 'center', width: '10%',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '15%',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleChangePage('form', row.slaid)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" actioncode="DELETE" onClick={() => this.deleteData(row.slaid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Region", datafield: "region", type: 'component', placeholder: 'Region', component: VendorRegionSelect, showDefaultSearch: true },
            { labeltext: "SLA Type", datafield: "slatype", type: 'select', placeholder: 'SLA Type', options: optionsType, showDefaultSearch: true }
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Manage Vendor SLA</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button htmlType="button" type="primary" size="default" label="Add New" onClick={() => (this.handleChangePage('form'))} />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
