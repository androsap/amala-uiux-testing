import React, { Component } from 'react';
import { Upload, Form, Icon, Button } from 'antd';

class UploadCSV extends Component {
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

    handleChange = (file) => {
        let File = [...file.fileList];
        // 1. Limit the number of uploaded files
        // Only to show one recent uploaded files, and old ones will be replaced by the new
        File = File.slice(-1);
        this.setState({ File });
    };

    render() {
        const { File } = this.state;
        const { onlyOne, form } = this.props;
        const { getFieldDecorator } = form;

        let getValueFromEvent = this.props.getValueFromEvent ? this.props.getValueFromEvent : this.normFile;
        let labelPosition = (this.props.labelCol && this.props.wrapperCol) ? {
            labelCol: this.props.labelCol,
            wrapperCol: this.props.wrapperCol
        } : null;

        let upload = {
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
                this.setState(state => ({
                    File: [...state.File, file],
                }));
                return false;
            },
            onChange: file => {
                if (this.props.onlyOne) this.handleChange(file);
                this.props.onChange(file);
            },
            File,
        };

        if (onlyOne) {
            return (
                <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                    {getFieldDecorator(this.props.datafield, {
                        getValueFromEvent: getValueFromEvent,
                        rules: this.validationRules(),
                    })(
                        <Upload {...this.props} {...upload} action="/upload.do" listType="text" accept={(this.props.accept) ? this.props.accept : ".csv"} fileList={File} showUploadList={{ showRemoveIcon: false }}>
                            <Button disabled={this.props.disabled}> <Icon type="upload" /> Click to upload </Button>
                        </Upload>,
                    )}
                </Form.Item>
            )
        } else return (
            <Form.Item label={this.props.labeltext} className={this.props.className} {...labelPosition}>
                {getFieldDecorator(this.props.datafield, {
                    valuePropName: 'fileList',
                    getValueFromEvent: getValueFromEvent,
                    rules: this.validationRules(),
                })(
                    <Upload {...upload} action="/upload.do" listType="text" accept={(this.props.accept) ? this.props.accept : ".csv"}>
                        <Button disabled={this.props.disabled}> <Icon type="upload" /> Click to upload </Button>
                    </Upload>,
                )}
            </Form.Item>
        )
    }

}

export default UploadCSV;