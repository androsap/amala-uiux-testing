import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, UploadCSV } from '../../../components/Base/BaseComponent';
import { Form, Row, Typography, Modal, Empty, Table, Spin, Col } from 'antd';
import { ExcelRenderer } from 'react-excel-renderer';
import moment from 'moment';

const { Text } = Typography;
const { Column } = Table;


class App extends Component {
    state = {
        visible: false,
        rows: [],
        isLoading: false
    };

    componentDidMount() {
        document.title = 'Upload File | Loyalty Management System';
    };

    handleDownload = () => {
        window.location.href = 'https://amala-pdt.garuda-indonesia.com/uploads/ordertemplate/printing.xlsx';
    };

    handleOpenModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleFile = (e) => {
        if (Object.keys(e).length) {
            let fileObj = e.file;
            if (
                !(fileObj.type === 'application/vnd.ms-excel' || fileObj.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ) {
                Alert.error('Unknown file format. Only (.xlxs) file will be uploaded.');
                return false;
            }

            if (fileObj) {
                ExcelRenderer(fileObj, (err, resp) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let newRows = [];
                        resp.rows.slice(1).map((row, index) => {
                            if (row && row !== 'undefined') {
                                newRows.push({
                                    key: index,
                                    ordercode: row[0],
                                    orderdate: new Date(1900, 0, --row[1]),
                                    cardnumber: row[3],
                                    membername: row[2],
                                    qty: row[10],
                                    status: row[33],
                                });
                            }
                        });

                        if (newRows.length === 0) {
                            Alert.error('No data found in file.');
                            return false;
                        } else {
                            this.setState({
                                fileName: fileObj.name,
                                cols: resp.cols,
                                rows: newRows
                            });
                        }
                    }
                });
                this.setState({ fileObj });
                return e && e.fileList;
            }
        }
        return false;
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                var file = this.state.fileObj;
                var fileRequest = new FormData();
                fileRequest.append('file', file);

                let data = {};
                let message = 'New data has been created';
                let url = api.url.printing.upload;
                SaveRequest(url, data, fileRequest).then((response) => {
                    const { status = {} } = response;
                    const { responsecode, responsemessage } = status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : message);
                        this.props.closemodalrefresh();
                        this.setState({ isLoading: false });
                    } else {
                        Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                        this.props.onCancel();
                    };
                })
            }
        });
    };

    handleChange = (file) => {
        if (file.fileList.length === 0) this.setState({ rows: [] });
    };

    render() {
        const { visible, rows, isLoading } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <React.Fragment>
                <Modal title='File Preview' visible={visible} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    {
                        (rows.length) ?
                            <TemplatePreview {...this.props} {...this.state} /> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No data displayed</span>} />
                    }
                </Modal>
                <Spin spinning={isLoading}>
                    <Form onSubmit={this.saveAction} {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 9, offset: 3 }} xl={{ span: 9, offset: 3 }}>
                                <UploadCSV form={this.props.form} labeltext='File' datafield='uploadfile' getValueFromEvent={(e) => this.handleFile(e)} accept={'.xlsx, .xls'} onChange={this.handleChange} onlyOne={true} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 8 }} xl={{ span: 8 }} style={{ marginTop: 4, paddingLeft: 0 }}>
                                <Button htmlType='button' type='default' size='default' label='Preview' onClick={() => this.handleOpenModal()} disabled={!rows.length} />
                                <Button htmlType='submit' type='primary' size='default' label='Upload' disabled={!rows.length} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center'>
                            <Text type='secondary' style={{ marginBottom: 3 }}>If you don't have template file in excel format to upload, you can download here:</Text>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='button' type='default' label='Download Template (.xlsx)' onClick={() => this.handleDownload()} />
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>
        );
    }
}

class TemplatePreview extends Component {
    render() {
        let { rows, fileName } = this.props;
        rows = rows.filter((obj) => { return obj.ordercode !== undefined }).map((obj, key) => { return ({ no: (key + 1), ...obj }) });
        return (
            <Form.Item>
                <Text strong>File Name: {fileName}</Text>
                <Table rowKey={record => record.number} dataSource={rows} pagination={false} scroll={{ y: 260 }}>
                    <Column title='No' dataIndex='no' key='no' render={(value) => ((value) ? value : '-')} width={20} />
                    <Column title='Order Code' dataIndex='ordercode' key='ordercode' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Order Date' dataIndex='orderdate' key='orderdate' render={(value) => ((value) ? moment(value).format('DD/MM/YYYY') : '-')} width={50} />
                    <Column title='Card Number' dataIndex='cardnumber' key='cardnumber' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Member Name' dataIndex='membername' key='membername' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Qty' dataIndex='qty' key='qty' render={(value) => ((value) ? value : '-')} width={50} />
                    <Column title='Status' dataIndex='status' key='status' render={(value) => ((value) ? value : '-')} width={50} />
                </Table>
            </Form.Item>
        )
    }
}

export default Form.create()(App);
