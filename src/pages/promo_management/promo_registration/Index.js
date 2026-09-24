import React from 'react';
import { DeleteRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, SearchForm, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import TableBase from '../../../components/Table/TableBase';
import moment from 'moment';
import { MemberStatus } from '../../../data';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            criteria: {},
            promoCodeOptions: [],
            registrationCodeOptions: [],
            partnerCodeOptions: [],
            visible: false,
            expanded: false,
            active: true,
            selectedTable: [],
            selectedRows: [],
            selectedRowKeys: [],
            placement: 'bottom',
        }
    };

    componentDidMount() {
        document.title = 'Manage Promo Registration | Loyalty Management System';
    };

    handleSearchForm = (criteria, criteriadata) => {
        criteriadata.statuslist = (criteriadata.statuslist) ? criteriadata.statuslist : ['SUCCESS', 'REGISTERED'];
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    deleteData(memberpromocode) {
        let url = api.url.memberpromo.delete;
        let data = { memberpromocode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback);
    };

    handleDataAutoComplete = (registrationcode) => {
        if (registrationcode && registrationcode.length > 1) {
            let url = api.url.promomanage.regcode.retrieve;
            let criteria = { status: 'ACTIVE', registrationcode: `%${registrationcode}%` };
            let paging = { limit: -1, page: 1 };

            RetrieveRequest(url, criteria, paging).then((response) => {
                if (response.status.responsecode === '0000') {
                    var registrationCodeOptions = response.result.map(obj => {
                        return obj.registrationcode;
                    });
                    this.setState({ registrationCodeOptions });
                } else Alert.error(response.status.responsemessage);
            });
        } else this.setState({ registrationCodeOptions: [] });
    };

    handleOptions = (value, type) => {
        if (value && value.length > 2) {
            let url = (type === 'partnercode') ? api.url.partner.list : api.url.promomanage.retrieve;
            let criteria = (type === 'partnercode') ? { partnercode: `%${value}%` } : { promocode: `%${value}%` }

            RetrieveRequest(url, criteria).then((response) => {
                const { status = {}, result } = response || {};
                const { responsecode, responsemessage } = status || {};
                if (responsecode === '0000' && result) {
                    var options = result.map(obj => {
                        var result2 = {};
                        result2['label'] = (type === 'partnercode') ? obj.partnercode : obj.promocode;
                        result2['value'] = (type === 'partnercode') ? obj.partnercode : obj.promocode;
                        return result2;
                    });

                    if (type === 'partnercode') {
                        this.setState({ partnerCodeOptions: options });
                    } else this.setState({ promoCodeOptions: options });

                } else Alert.error(responsemessage);
            });
        } else {
            if (type === 'partnercode') {
                this.setState({ partnerCodeOptions: [] });
            } else this.setState({ promoCodeOptions: [] });
        }
    };

    handleDownload = () => {
        const callback = () => {
            let downloadid = this.state.selectedRows.map(val => val.memberpromocode);
            let url = api.url.memberpromo.download;
            let data = { downloadid: downloadid };
            let message = 'Downloading file...';
            this.setState({ isLoading: true });
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    window.location.href = result.urldownload;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    this.handleCancel();
                } else {
                    this.handleCancel();
                    Alert.error(responsemessage);
                }
                this.setState({ isLoading: false });
            });
        }
        confirm({
            title: 'Are you sure to download this file?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    // handleDownload = (type) => {
    //     const callback = () => {
    //         window.location.href = (type === 'PDF') ? this.state.url : this.state.url2;
    //         Alert.success('Downloading...');
    //     }

    //     confirm({
    //         title: 'Are you sure want to download this file?',
    //         onOk(e) {
    //             return new Promise((resolve, reject) => {
    //                 setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
    //                 callback();
    //             }).catch(() => console.log('Oops errors!'));
    //         },
    //         onCancel() { },
    //     });
    // };

    render() {
        const { promoCodeOptions, registrationCodeOptions, partnerCodeOptions } = this.state;
        const { menucode, prefixmenuname } = this.props;

        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Member Status', datafield: 'memberstatus', type: 'select', placeholder: 'Member Status', options: MemberStatus, showDefaultSearch: false },
            {
                labeltext: 'Promo Code', datafield: 'promocode', type: 'select', placeholder: 'Promo Code', showDefaultSearch: true,
                onSearch: (e) => this.handleOptions(e, 'promocode'), options: promoCodeOptions, onChange: (e) => this.handleOptions(e, 'promocode')
            },
            {
                labeltext: 'Registration Code', datafield: 'registrationcode', type: 'autocomplete', placeholder: 'Registration Code', showDefaultSearch: true,
                onSearch: (registrationcode) => this.handleDataAutoComplete(registrationcode), dataSource: registrationCodeOptions, createData: true
            },
            { labeltext: 'Registration Date', datafield: 'createdDate', type: 'datepicker', placeholder: 'Registration Date', showDefaultSearch: true, specialSearchLike: true },
            {
                labeltext: 'Partner Code', datafield: 'partnercode', type: 'select', placeholder: 'Partner Code', showDefaultSearch: false,
                onSearch: (e) => this.handleOptions(e, 'partnercode'), options: partnerCodeOptions, onChange: (e) => this.handleOptions(e, 'partnercode')
            },
            { labeltext: 'Created By', datafield: 'createdby', type: 'text', placeholder: 'Created By', showDefaultSearch: false },
        ];

        const configurationTable = {
            url: api.url.memberpromo.list,
            criteriadata: { useregistrationcode: true, statuslist: ['REGISTERED'] },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true },
                { type: 'field', title: 'Member Status', dataIndex: 'memberstatus', sorter: true },
                { type: 'field', title: 'Promo Code', dataIndex: 'promocode', sorter: true },
                { type: 'field', title: 'Registration Code', dataIndex: 'registrationcode', sorter: true },
                {
                    type: 'html', title: 'Registration Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: false },
                { type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: false },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (_value, row) => {
                        return (
                            <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.memberpromocode)} />
                        )
                    }
                },
            ],

        };


        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={3}>Promo Registration</Title>
                    </Col>
                    <Col xs={24} xl={4}>
                        <Button type='primary' url={'/promo-registration/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                        {/* <Button htmlType="button" type="default" icon="download" label="Download" onClick={() => this.handleDownload()} /> */}
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase useCustomOnChange={true} ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));