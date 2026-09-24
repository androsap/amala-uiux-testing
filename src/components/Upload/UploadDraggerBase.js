import React, { Component } from 'react';
import { Upload, Form, Icon, message } from 'antd';
import uuid from 'uuid/v4';

const { Dragger } = Upload;

class UploadBase extends Component {
    state = {
        File: [],
    };

    validationRules = () => {
        let validation = [];
        if (this.props.validationrules) {
            this.props.validationrules.forEach((item, index) => {
                if (typeof (item) === "string") {
                    let valType = item.split(".");
                    switch (valType[0]) {
                        case "required":
                            validation.push({ required: true, message: `${this.props.labeltext} is Required` })
                            break;
                        default:
                    }
                }
                else if (typeof (item) === "function") {
                    validation.push({
                        validator: item
                    })
                }
            })
        }

        return validation;
    }

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    componentDidMount() {
        const { value, blob } = this.props
        if (blob) {
            this.setState({
                File: [blob]
            })
        }

        if (value && typeof value === "string") {
            const name = value.split("/")[value.split("/").length - 1];
            this.setState({
                File: [{
                    uid: uuid(),
                    lastModified: 1637653031846,
                    lastModifiedDate: new Date(),
                    name,
                    size: 11247,
                    type: "image/jpeg",
                    percent: 0,
                    originFileObj: {
                        uid: uuid()
                    },
                    thumbUrl: `${value}?v=${uuid()}`
                }]
            })
        }

    }

    render() {
        const accept = this.props.accept;
        const props = {
            accept,
            name: 'file',
            multiple: true,
            method: 'GET',
            action: '/upload.do',
            onChange(info) {
                const { status } = info.file;

                if ((status === 'done') && (info.fileList[0].type.includes(accept.split('.')[1]))) {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                } else if (status === 'uploading') {
                    message.info('Uploading ..., please wait');
                } else {
                    message.error('Please upload correct file');
                }
            },
        };

        const { getFieldDecorator } = this.props.form;
        let labelPosition = (this.props.labelCol && this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        let getValueFromEvent = this.props.getValueFromEvent ? this.props.getValueFromEvent : this.normFile;
        return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    getValueFromEvent: getValueFromEvent,
                    rules: this.validationRules(),
                })(
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for .csv file only, other file please convert first
                        </p>
                    </Dragger>,
                )}
            </Form.Item>
        )
    }

}

export default UploadBase;