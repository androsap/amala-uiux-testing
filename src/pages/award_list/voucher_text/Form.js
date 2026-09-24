import React, { Component } from 'react';
import { DetailRequest, SaveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { UploadBase, LanguageSelect, SwitchButton, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Icon, Popover, Select, Button as AntdButton } from 'antd';
import Draggable from 'react-draggable';
import qrcode from '../../../assets/images/qrcode.jpg'

const { Option } = Select;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                changetemplate: true,
                vouchertext: [],
                imgvoucher: null,
                changeposition: false,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
            tags: {
                processingdate: { templatetext: 'processing-date', label: 'Processing Date', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                cardnumber: { templatetext: 'card-number', label: 'Card Number', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                name: { templatetext: 'name', label: 'Name', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                selfusage: { templatetext: 'self-usage', label: 'Self Usage', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                basicawardprice: { templatetext: 'basic-award-price', label: 'Basic Award price', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                totalprice: { templatetext: 'total-price', label: 'Total price', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                processedbypic: { templatetext: 'processed-by-pic', label: 'Processed By Pic', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                certificateid: { templatetext: 'certificate-id', label: 'Cerfiticate ID', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                certificatevaliduntil: { templatetext: 'certificate-valid-until', label: 'Certificate Valid Until', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                awardcode: { templatetext: 'award-code', label: 'Award Code', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                awardtypename: { templatetext: 'award-type-name', label: 'Award Type Name', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                awarddescription: { templatetext: 'award-description', label: 'Award Description', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                awardpartnercode: { templatetext: 'award-partner-code', label: 'Award partner Code', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                pnr: { templatetext: 'pnr', label: 'PNR', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                qrcode: { templatetext: 'qr-code', label: 'QR Code', size: 12, show: false, disabled: false },
                promocode: { templatetext: 'promocode', label: 'Promo Code', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                promoname: { templatetext: 'promoname', label: 'Promo Name', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                vouchercode: { templatetext: 'vouchercode', label: 'Voucher Code', show: false, disabled: false, size: 12, color: 'black', font: 'arial' },
                vouchercodevalidity: { templatetext: 'vouchercodevalidity', label: 'Vouchercode Validity', show: false, disabled: false, size: 12, color: 'black', font: 'arial' }
            },
            tagActive: {},
            uploadTemplateImage: false,
            file: true
        }
    }

    componentDragable = [];

    checkPermission() {
        let id = this.props.awardvouchercode;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            } else {
                this.componentLanguageSelect.retrieveData();
                this.getOptionsTagStatementText();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getOptionsTagStatementText = () => {
        const { categorycode } = this.props;
        let tags = this.state.tags;
        if (categorycode === 'FREEFLIGHT' || categorycode === 'UPGRADE') {
            tags.ticket = { templatetext: 'ticket', label: 'Ticket', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.originalitinerary = { templatetext: 'original-itinerary', label: 'Original Itinerary', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.freeflight = { templatetext: 'free-flight', label: 'Free Flight', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.companionflight = { templatetext: 'companion-flight', label: 'Companion Flight', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.travelertype = { templatetext: 'traveler-type', label: 'Traveler Type', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.companionmemberid = { templatetext: 'companion-member-id', label: 'Companion Member ID', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.companiontravelertype = { templatetext: 'companion-traveler-type', label: 'Companion Traveler', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
        } else if (categorycode === 'HOTEL') {
            tags.activitydate = { templatetext: 'activity-date', label: 'Activity Date', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
        } else if (categorycode === 'TRANSFER') {
            tags.recipientname = { templatetext: 'recipient-name', label: 'Recipient Name', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
            tags.recipientcardnumber = { templatetext: 'recipient-cardnumber', label: 'Recipient Cardnumber', show: false, disabled: false, size: 12, color: 'black', font: 'arial' };
        }
    }

    getDetail = (awardvouchercode, actionspage) => {
        let url = api.url.awardvouchertext.detail;
        let data = { awardvouchercode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let langcode = (result.langcode) ? result.langcode : undefined;
                let isdefault = (result.isdefault) ? result.isdefault : false;
                let imgvoucher = (result.imgvoucher) ? result.imgvoucher : null
                let vouchertext = result.vouchertext;
                let active = (result.active) ? result.active : false;
                let generalfielddisabled = (actionspage !== "view") ? !active : true;

                let setValue = { langcode, isdefault };
                this.props.form.setFieldsValue(setValue);

                let changetemplate = false;
                this.setState({
                    fieldvalue: { ...this.state.fieldvalue, changetemplate, vouchertext, imgvoucher, active },
                    fielddisabled: { ...this.state.fielddisabled, generalfielddisabled }, file: active
                });

                this.getOptionsTagStatementText();
                this.viewVoucher(imgvoucher, vouchertext);
                this.componentLanguageSelect.retrieveData();
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                var vouchertext = [];
                const { changeposition, changetemplate } = this.state.fieldvalue;
                if (actionspage === 'create' || changeposition || changetemplate) {
                    vouchertext = Object.keys(this.state.tagActive).map((key) => {
                        return {
                            templatetext: '{' + this.componentDragable[key].getCoordinat().templatetext + '}',
                            positionx: this.componentDragable[key].getCoordinat().deltaPosition.x,
                            positiony: this.componentDragable[key].getCoordinat().deltaPosition.y,
                            font: this.componentDragable[key].getCoordinat().font,
                            size: this.componentDragable[key].getCoordinat().fontSize,
                            color: this.componentDragable[key].getCoordinat().color
                        }
                    });
                } else {
                    vouchertext = this.state.fieldvalue.vouchertext;
                }

                this.setState({ isLoading: true });
                //define parameter
                let path = '/vouchertemplate/';
                let awardcode = this.props.awardcode;
                let langcode = input.langcode;
                let isdefault = (input.isdefault) ? 1 : 0;
                let imgvoucher = path;
                let vouchertextstatus = true;

                let request = { awardcode, langcode, isdefault, imgvoucher, vouchertextstatus, vouchertext };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.awardvouchertext.create;
                } else {
                    request.awardvouchercode = this.props.awardvouchercode;
                    message = 'Data has been updated';
                    url = api.url.awardvouchertext.update;
                }

                /* Mapping Request File*/
                var fileRequest = new FormData();
                var file = (input.vouchercard && input.vouchercard[0] && input.vouchercard[0]['originFileObj']) ? input.vouchercard[0]['originFileObj'] : null;
                fileRequest.append("file", file);
                fileRequest.append("path", path);
                SaveRequest(url, request, fileRequest).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.changePage({ page: 'index' });
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    addLabelOnCanvas = (e, data, key) => {
        e.preventDefault();
        this.setState({
            tagActive: {
                ...this.state.tagActive,
                [key]: <DragComponent {...data} key={key} id={key} ref={(e) => { this.componentDragable[key] = e }} inactivetag={this.inactivetag} />
            }
        });

        // //disabled tag
        let tags = this.state.tags;
        let updated = this.state.tags[key];
        updated.disabled = true;
        tags[key] = updated;
    }

    normFile = e => {
        var canvas = document.getElementById('imageCanvas');
        var ctx = canvas.getContext('2d');

        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        var upload;
        if (e.fileList.length !== 0) {
            reader.readAsDataURL(e.file);
            upload = true;
        } else {
            upload = false;
        }
        let fielddisabled = { specialfielddisabled: upload };
        this.setState({ uploadTemplateImage: upload, fielddisabled, file: upload });

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    previewVoucher = () => {
        const canvas = document.getElementById('canvasFinal');
        const ctx = canvas.getContext('2d');
        const img = document.getElementById('imageCanvas');
        canvas.classList.remove("d-none");
        canvas.setAttribute("width", img.width);
        canvas.setAttribute("height", img.height);
        ctx.drawImage(img, 0, 0);

        const base_image = new Image();
        let x = '';
        let y = '';
        let xqr = '';
        let yqr = '';
        let label = '';
        var font = '';
        var fontSize = '';
        var color = '';
        Object.keys(this.state.tagActive).map((key) => {
            fontSize = Number.parseInt(this.componentDragable[key].getCoordinat().fontSize, 0);
            color = this.componentDragable[key].getCoordinat().color;
            font = this.componentDragable[key].getCoordinat().font;
            label = (this.componentDragable[key].getCoordinat().label === 'QR Code') ? '' : this.componentDragable[key].getCoordinat().label;
            x = this.componentDragable[key].getCoordinat().deltaPosition.x;
            y = this.componentDragable[key].getCoordinat().deltaPosition.y;
            y = (label === '') ? y : (y * 1) + 19;
            if (label === '') {
                xqr = x;
                yqr = y;
                make_base();
                function make_base() {
                    base_image.src = qrcode;
                    base_image.onload = function () {
                        ctx.drawImage(base_image, xqr, yqr, 100, 100);
                    }
                }
            }

            ctx.font = fontSize + 'px ' + font;
            ctx.fillStyle = color;
            return ctx.fillText(label, x, y);
        });
    }

    onChangeSize = (size, data, key) => {
        data.size = Number.parseInt(size, 0);
        this.setState({
            tagActive: {
                ...this.state.tagActive,
                [key]: <DragComponent key={key} id={key} ref={(e) => { this.componentDragable[key] = e }} inactivetag={this.inactivetag} {...data} />
            }
        });
    }

    onChangeFontFamily = (font, data, key) => {
        data.font = font;
        this.setState({
            tagActive: {
                ...this.state.tagActive,
                [key]: <DragComponent key={key} id={key} ref={(e) => { this.componentDragable[key] = e }} inactivetag={this.inactivetag} {...data} />
            }
        });
    }

    onChangeColor = (color, data, key) => {
        data.color = color;
        this.setState({
            tagActive: {
                ...this.state.tagActive,
                [key]: <DragComponent key={key} id={key} ref={(e) => { this.componentDragable[key] = e }} inactivetag={this.inactivetag} {...data} />
            }
        });
    }

    inactivetag = (id) => {
        let tagActive = this.state.tagActive;
        delete tagActive[id];
        let tags = this.state.tags;
        tags[id].disabled = false;
        this.setState({ tagActive })
    }

    handleChangePage(page, vouchertextid = '') {
        this.props.changePage({ page, vouchertextid });
    }

    handleChangeTemplate = (changetemplate) => {
        this.setState({ fieldvalue: { ...this.state.fieldvalue, changetemplate }, fielddisabled: { ...this.state.fielddisabled, specialfielddisabled: false } });
    }

    handleValidationDurationInMonth = (rule, value, callback) => {
        // if (value && value < 1) { callback('Duration must start from 1'); }
        // else if (value && value > 12) { callback('Maximum duration of 12'); }
        callback();
    }

    handleChangePosition = (e) => {
        e.preventDefault();
        let { vouchertext, imgvoucher } = this.state.fieldvalue;
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById('imageCanvas');
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);
        }
        imageCanvas.src = imgvoucher;

        // let key = '';
        let tags = this.state.tags;
        let result = [];
        for (const field in vouchertext) {
            let defaultPosition = { x: 0, y: 0 };
            defaultPosition.x = vouchertext[field]['positionx'];
            defaultPosition.y = vouchertext[field]['positiony'];
            let key = vouchertext[field]['templatetext'].replace('{', '').replace('}', '').replace(/-/g, '');
            result[key] = <DragComponent {...tags[key]} key={key} id={key} ref={(e) => { this.componentDragable[key] = e }} inactivetag={this.inactivetag} defaultPosition={defaultPosition} />;
        }

        this.setState({
            tagActive: { ...this.state.tagActive, ...result },
            fieldvalue: { ...this.state.fieldvalue, changeposition: true }
        })
    }

    viewVoucher = (imgvoucher, vouchertext) => {
        const base_image = new Image();
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById('imageCanvas');
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);

            vouchertext.map((obj, key) => {
                ctx.font = obj.size + 'px ' + obj.font;
                ctx.fillStyle = obj.color;
                if (obj.templatetext === '{qr-code}') {
                    make_base();
                    function make_base() {
                        base_image.src = qrcode;
                        base_image.onload = function () {
                            ctx.drawImage(base_image, obj.positionx, obj.positiony, 100, 100);
                        }
                    }
                }

                return ctx.fillText((obj.templatetext === '{qr-code}') ? '' : obj.templatetext, obj.positionx, (obj.positiony * 1) + 19);
            })
        }
        imageCanvas.src = imgvoucher;
    }

    deleteData(awardvouchercode, active) {
        let url = (active) ? api.url.awardvouchertext.deactivate : api.url.awardvouchertext.activate;
        let data = { awardvouchercode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.setState({ tagActive: {} });
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, tags, tagActive, uploadTemplateImage, file } = this.state;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
        const { changetemplate, changeposition, active } = this.state.fieldvalue;
        const { menucode, prefixmenuname, awardvouchercode } = this.props;

        let contentform = [];

        for (const field in tags) {
            contentform[field] =
                <Form labelCol={{ xs: { span: 24 }, sm: { span: 8 } }} wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }} style={{ width: '300px' }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Size">
                        <Select defaultValue={tags[field]['size']} onChange={(e) => this.onChangeSize(e, tags[field], field)}>
                            <Option value="10">10</Option>
                            <Option value="15">15</Option>
                            <Option value="20">20</Option>
                            <Option value="25">25</Option>
                            <Option value="30">30</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Font Family">
                        <Select defaultValue={tags[field]['font']} onChange={(e) => this.onChangeFontFamily(e, tags[field], field)}>
                            <Option value="arial">Arial</Option>
                            <Option value="monospace">Monospace</Option>
                            <Option value="sans-serif">Sans-serif</Option>
                            <Option value="serif">Serif</Option>
                        </Select>
                    </Form.Item><Form.Item label="Color">
                        <Select defaultValue={tags[field]['color']} onChange={(e) => this.onChangeColor(e, tags[field], field)}>
                            <Option value="white">White</Option>
                            <Option value="black">Black</Option>
                            <Option value="red">Red</Option>
                            <Option value="green">Green</Option>
                            <Option value="blue">Blue</Option>
                        </Select>
                    </Form.Item>
                </Form>
        }

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Voucher | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Voucher</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <LanguageSelect ref={(e) => { this.componentLanguageSelect = e }} form={this.props.form} labeltext="Language" datafield="langcode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Set as Default" datafield="isdefault" defaultChecked={false} disabled={generalfielddisabled} />
                                    <SwitchButton form={this.props.form} labeltext="Change Template" datafield="changetemplate" className={(actionspage !== 'update') ? 'hidden' : ''} onChange={this.handleChangeTemplate} disabled={generalfielddisabled} />
                                    <UploadBase getValueFromEvent={(e) => this.normFile(e)} form={this.props.form} className={(changetemplate) ? '' : 'hidden'} labeltext="Certificate Template" datafield="vouchercard" validationrules={(changetemplate) ? ['required', this.handleValidationDurationInMonth] : []} disabled={specialfielddisabled} />
                                </Col>
                            </Row>
                            <Row>
                                {
                                    (uploadTemplateImage) ?
                                        Object.keys(tags).map((key) => {
                                            return (
                                                <Col span={4} style={{ marginBottom: '5px' }} >
                                                    <AntdButton.Group>
                                                        <Popover content={contentform[key]} title={tags[key].label} trigger="click">
                                                            <AntdButton type="primary" icon="menu" size="small" disabled={!tags[key].disabled} />
                                                        </Popover>
                                                        <AntdButton type="default" size="small" onClick={(e) => this.addLabelOnCanvas(e, tags[key], key)} disabled={tags[key].disabled}> {tags[key].label} </AntdButton>
                                                    </AntdButton.Group>
                                                </Col>
                                            )
                                        })
                                        : null
                                }
                            </Row>
                            <div style={{ width: '100%', position: 'relative', display: (uploadTemplateImage) ? 'block' : (file) ? 'block' : 'none' }}>
                                <canvas id="imageCanvas" />
                                {
                                    Object.keys(tagActive).map((key) => {
                                        return tagActive[key]
                                    })
                                }
                            </div>
                            {
                                (uploadTemplateImage) ?
                                    <Row>
                                        <Col style={{ textAlign: 'center' }}>
                                            <AntdButton type="primary" htmlType="button" onClick={this.previewVoucher}> Preview </AntdButton>
                                        </Col>
                                    </Row>
                                    : null
                            }
                            <canvas id="canvasFinal" className="d-none" />
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
                                {
                                    (actionspage === 'update' && !changeposition && !changetemplate && active) ?
                                        <Button htmlType="button" type="primary" label="Change Position" onClick={(e) => this.handleChangePosition(e)} />
                                        : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.deleteData(awardvouchercode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.deleteData(awardvouchercode, active)} /> : ""
                                }
                                <Button htmlType="button" type="default" label="Back" onClick={() => this.handleChangePage('index')} />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}


class dragcomponent extends Component {
    state = {
        activeDrags: 0,
        deltaPosition: this.props.defaultPosition ? this.props.defaultPosition : { x: 0, y: 0 }
    }

    onStart = () => {
        this.setState({ activeDrags: ++this.state.activeDrags });
    };

    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };

    handleDrag = (e, ui) => {
        const { x, y } = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    };

    getCoordinat = () => {
        return {
            ...this.state,
            label: this.props.label,
            fontSize: this.props.size,
            font: this.props.font,
            color: this.props.color,
            templatetext: this.props.templatetext
        }
    }

    handleRemove = (id) => {
        this.props.inactivetag(id);
    }

    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        let defaultPosition = this.props.defaultPosition ? this.props.defaultPosition : { x: 0, y: 0 };
        return (
            <Draggable bounds="canvas" {...dragHandlers} defaultPosition={defaultPosition} position={null} onDrag={this.handleDrag}>
                {(this.props.label === 'QR Code') ?
                    <div style={{ width: '120px', height: '100px', position: 'absolute', left: '0px', top: '0px', paddingRight: '10px' }}>
                        <img src={qrcode} alt='QR Code'></img>
                        <span data-toggle="remove" style={{ position: 'absolute', right: 0, padding: 0, margin: 0 }}><Icon type="close" onClick={() => this.handleRemove(this.props.id)} /></span>
                    </div> :
                    <div style={{ position: 'absolute', left: '0px', top: '0px', color: this.props.color, fontSize: this.props.size, font: this.props.font, paddingRight: '10px' }} className="tag-default handle">
                        {this.props.label}
                        <span data-toggle="remove" style={{ position: 'absolute', right: 0, padding: 0, margin: 0 }}><Icon type="close" onClick={() => this.handleRemove(this.props.id)} /></span>
                    </div>}
            </Draggable>
        )
    }
}

const DragComponent = dragcomponent;

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));