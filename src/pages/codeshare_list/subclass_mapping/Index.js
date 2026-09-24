import React from 'react';
import { connect } from "react-redux";
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import SubclassForm from './Form';
import moment from 'moment';

const prefixmenuname = 'SUCLSMAP';
const menucode = 'SUCLSMAP';

const configurationSearchForm = [
    { labeltext: "Marketing Airline", datafield: "marketingairlinename", type: 'text', placeholder: 'Marketing Airline', showDefaultSearch: true },
    { labeltext: "Marketing Subclass", datafield: "marketingsubclass", type: 'text', placeholder: 'Marketing Subclass', showDefaultSearch: true },
    { labeltext: "Operating Airline", datafield: "operatingairlinename", type: 'text', placeholder: 'Operating Airline', showDefaultSearch: true },
    { labeltext: "Operating Subclass", datafield: "operatingsubclass", type: 'text', placeholder: 'Operating Subclass', showDefaultSearch: true },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: false },
];

class App extends React.Component {
    state = {
        visible: false,
        subclassmappingcode: null
    }

    componentDidMount() {
        this.componentTable.getList();
    }

    deleteData(subclassmappingcode) {
        let url = api.url.subclassmapping.delete;
        let data = { subclassmappingcode };
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

    handleOpenModal = (subclassmappingcode) => {
        this.setState({ visible: true, subclassmappingcode });
    }

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { visible, subclassmappingcode } = this.state;
        const { active, codeshareid } = this.props.data;
        const configurationTable = {
            url: api.url.subclassmapping.list,
            criteria: { codeshareid },
            columns: [
                { type: 'field', title: 'Marketing Airline', dataIndex: 'marketingairlinename', sorter: true },
                { type: 'field', title: 'Marketing Subclass', dataIndex: 'marketingsubclass', sorter: true },
                { type: 'field', title: 'Operating Airline', dataIndex: 'operatingairlinename', sorter: true },
                { type: 'field', title: 'Operating Subclass', dataIndex: 'operatingsubclass', sorter: true },
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
                                <Button htmlType="button" size="small" label={(active) ? 'Edit' : 'View'} type="default" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.subclassmappingcode)} />
                                {
                                    (active) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.subclassmappingcode)} /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="Subclass Mapping" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                    <SubclassForm {...this.props.data} subclassmappingcode={subclassmappingcode} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        {
                            (active) ? <Button type="primary" size="default" label="Add New" htmlType="button" onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                    </Col>
                </Row>
                <SearchForm showAdvanceSearch={true} form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));