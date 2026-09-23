import React, { Component } from 'react';
import { Upload, Form, Icon, Button, message } from 'antd';
import uuid from 'uuid/v4';
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
        const { form, datafield, value, blob } = this.props
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

        const { File } = this.state;
        const upload = {
            onChange: (e) => {
                const { file, fileList } = e;
                const { type, name, size, uid, lastModified, lastModifiedDate } = file;

                const { accept = [], maxSize = 0 } = this.props;
                if (this.props.custom !== undefined) {
                    var callErrorFormat = function (accept, type, props) {
                        if (accept && !accept.includes(type)) { return props.errorCondition('errorFormat', true); }
                        return props.errorCondition('errorFormat', false);
                    };
                    var callErrorSize = function (maxSize, size, props) {
                        if (maxSize && (size / 1024 / 1024 > maxSize)) { return props.errorCondition('errorSize', true); }
                        return props.errorCondition('errorSize', false);
                    };

                    callErrorFormat(accept, type, this.props)
                    callErrorSize(maxSize, size, this.props)
                }
                e.fileList = [{
                    uid,
                    lastModified,
                    lastModifiedDate,
                    name,
                    size,
                    type,
                    status: 'done',
                    percent: 0,
                    originFileObj: file,
                    thumbUrl: `${window.URL.createObjectURL(file)}`
                }];

                if (this.props.onChange) this.props.onChange(e)
            },
            onRemove: file => {
                this.setState(state => {
                    const index = state.File.indexOf(file);
                    const newFileList = state.File.slice();
                    newFileList.splice(index, 1);
                    return {
                        File: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                const { type, name, size, uid, lastModified, lastModifiedDate } = file;

                const { beforeUpload = () => true, accept, maxSize = 0 } = this.props

                if (this.props.custom !== undefined) {
                    if (accept && !accept.includes(type)) return message.error(`You can only upload JPEG/PNG file`);
                    if (maxSize) if (size / 1024 / 1024 > maxSize) return message.error(`Image size must be smaller than ${maxSize < 1024 ? (maxSize * 1000) : maxSize} ${maxSize < 1000 ? "KB" : "MB"}`);
                }

                if (!beforeUpload(file)) return false;
                this.setState({
                    File: [{
                        uid,
                        lastModified,
                        lastModifiedDate,
                        name,
                        size,
                        type,
                        status: 'done',
                        percent: 0,
                        originFileObj: file,
                        thumbUrl: `${window.URL.createObjectURL(file)}`
                    }]
                });

                return false;
            },
            File,
            fileList: File
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
                    <Upload {...upload} name="logo" action="/upload.do" listType={this.props.csv ? "text" : "picture"} accept={this.props.accept} >
                        <Button disabled={this.props.disabled}> <Icon type="upload" /> Click to upload </Button>
                    </Upload>,
                )}
            </Form.Item>
        )
    }

}

export default UploadBase;