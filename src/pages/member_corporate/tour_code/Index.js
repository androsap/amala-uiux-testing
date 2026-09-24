import React from 'react';
import { api } from '../../../config/Services';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment'
import TourCodeForm from './Form';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            titlepage: 'Create',
            tourcodeid: null
        }
    }

    componentDidMount() {
        document.title = "Member Tour Code | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (tourcodeid) => {
        this.setState({ visible: true, tourcodeid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    deleteData(tourcodeid) {
        let url = api.url.tourcode.delete;
        let data = { tourcodeid };
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

    render() {
        const { menucode, prefixmenuname, profile } = this.props;
        const { visible, tourcodeid, titlepage } = this.state;
        const configurationSearchForm = [
            { labeltext: "Tour Code", datafield: "tourcode", type: 'text', placeholder: 'Tour Code', showDefaultSearch: true },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.tourcode.list,
            criteria: { corporatecode: profile.corporatecode },
            columns: [
                { type: 'field', title: 'Tour Code', dataIndex: 'tourcode', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return moment(value).format('DD/MM/YYYY') }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return moment(value).format('DD/MM/YYYY') }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.tourcodeid)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tourcodeid)} />
                            </span>
                        )
                    }
                }
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Tour Code"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <TourCodeForm profile={profile} tourcodeid={tourcodeid} setTitlePage={this.setTitlePage} refreshHeader={this.props.refreshHeader} onClose={this.handleCancel} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Tour Code</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        {/* <Button type="primary" url={this.props.match.url + '/form'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> */}
                        <Button htmlType="button" type="primary" size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal()} />
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