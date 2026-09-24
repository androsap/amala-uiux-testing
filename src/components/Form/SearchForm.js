import React from 'react';
import { Button, InputText, DatePickerBase, SelectBase, InputAutoComplete, SelectBaseWithCheckbox } from '../Base/BaseComponent';
import { Form, Row, Col, Icon } from 'antd';
import moment from 'moment';

class SearchForm extends React.Component {
    state = {
        advancesearch: false
    }

    handleSearch = e => {
        e.preventDefault();
        var items = this.props.optionsConfiguration;
        this.props.form.validateFields((err, values) => {
            let criteria = {};
            let criteriadata = {};
            Object.keys(values).map(function (key, index) {
                if (items.filter(val => val.datafield === key)[0] !== undefined) {
                    var type = items.filter(val => val.datafield === key)[0]['type'];
                    var specialSearch = items.filter(val => val.datafield === key)[0]['specialSearch'];
                    var customformat = items.filter(val => val.datafield === key)[0]['customformat'];
                    var specialSearchLike = items.filter(val => val.datafield === key)[0]['specialSearchLike'];
                    var specialSearchCustom = items.filter(val => val.datafield === key)[0]['specialSearchCustom'];
                    var normalSearch = items.filter(val => val.datafield === key)[0]['normalSearch'];
                    var searchLike = items.filter(val => val.datafield === key)[0]['searchLike'];
                    var specialSearchArray = items.filter(val => val.datafield === key)[0]['specialSearchArray'];

                    if (customformat) {
                        return criteria[key] = customformat(values[key]);
                    } else {
                        switch (type) {
                            case 'datepicker':
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== undefined && values[key] !== null) ? moment(values[key]).format('YYYY-MM-DD') : null;
                                } else if (specialSearchLike) {
                                    return criteria[key] = (values[key] !== undefined && values[key] !== null) ? `%${moment(values[key]).format('YYYY-MM-DD')}%` : null;
                                } else if (searchLike) {
                                    return criteriadata[key] = (values[key] !== undefined && values[key] !== null) ? `%${moment(values[key]).format('YYYY-MM-DD')}%` : null;
                                } else {
                                    return criteria[key] = (values[key] !== undefined && values[key] !== null) ? moment(values[key]).format('YYYY-MM-DD') : null;
                                }
                            case 'select':
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== undefined) ? values[key] : null;
                                } else if (specialSearchArray) {
                                    return criteriadata[key] = (values[key] !== undefined && values[key]) ? [`${values[key]}`] : null;
                                } else {
                                    return criteria[key] = (values[key] !== undefined) ? values[key] : null;
                                }
                            case 'selectcheckbox':
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== undefined) ? values[key] : null;
                                } else {
                                    return criteria[key] = (values[key] !== undefined) ? values[key] : null;
                                }
                            case 'component':
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== undefined) ? values[key] : null;
                                } else {
                                    return criteria[key] = (values[key] !== undefined) ? values[key] : null;
                                }
                            case 'exact':
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== "" && values[key] !== undefined) ? values[key] : null;
                                } else {
                                    return criteria[key] = (values[key] !== "" && values[key] !== undefined) ? values[key] : null;
                                }
                            default:
                                if (specialSearch) {
                                    return criteriadata[key] = (values[key] !== undefined && values[key]) ? "%" + values[key] + "%" : null;
                                } else if (normalSearch) {
                                    return criteria[key] = (values[key] !== undefined && values[key]) ? values[key] : null;
                                } else {
                                    return criteria[key] = (values[key] !== undefined && values[key]) ? "%" + values[key] + "%" : null;
                                }
                        }
                    }
                }
                return null;
            });
            this.props.onSubmit(criteria, criteriadata);
        });
    };

    generateField = (item, key) => {
        const validationrules = ['pattern.preventsql', ...(item.validationrules || [])]
        var fieldType = (item.type) ? item.type : 'text';
        var forceRender = (item.forceRender === false) ? false : true;

        switch (fieldType) {
            case 'autocomplete':
                return <InputAutoComplete form={this.props.form} {...item} key={key} validationrules={validationrules} />
            case 'datepicker':
                return <DatePickerBase form={this.props.form} {...item} key={key} />;
            case 'select':
                return <SelectBase form={this.props.form} {...item} key={key} />;
            case 'selectcheckbox':
                if (item.labeltext) {
                    return <SelectBaseWithCheckbox ref={(e) => { this.componentLabelCheckbox = e }} form={this.props.form} {...item} key={key} maxTagCount={2} />
                } else {
                    item.datafield = `${item.datafield}2`;
                    return <SelectBaseWithCheckbox ref={(e) => { this.componentCheckbox = e }} form={this.props.form} {...item} key={key} maxTagCount={1} />
                };
                            case 'component':
                let Component = item.component;
                let mode = (item.multipleSelect) ? 'multiple' : undefined;
                this.component = [];
                return <Component form={this.props.form} ref={(e) => { this.component[item.datafield] = e }} {...item} key={key} forceRender={forceRender} mode={mode} disabled={item.disabled} customRender={item.customRender} criteria={item.criteria} />;
            default:
                return <InputText form={this.props.form} {...item} key={key} validationrules={validationrules} />
        }
    };

    customClear = e => {
        this.props.form.resetFields(this.props.customClear);
    }

    handleReset = () => {
        if (this.props.memberCertif) {
            this.props.handleCustomClear();
        } else {
            this.props.form.resetFields();
            if (this.props.searchWithSelectCheckbox) {
                if (this.state.advancesearch) {
                    this.componentLabelCheckbox.handleReset()
                } else this.componentCheckbox.handleReset();
            }
        }
    };

    handleAdvanceSearch = () => {
        const { advancesearch } = this.state;
        this.setState({ advancesearch: !advancesearch });
        if (this.props.searchWithSelectCheckbox) this.props.handleSelectCheckbox(!advancesearch);
    };

    render() {
        const { advancesearch } = this.state;
        var fieldsDefaultSearch = this.props.optionsConfiguration.map((obj, key) => {
            if (obj.showDefaultSearch) { return this.generateField({ ...obj, labeltext: undefined }, key); }
            return null;
        });

        var totalField = Math.floor(this.props.optionsConfiguration.length / 2);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <React.Fragment>
                <Row gutter={24} type={(this.props.justify) ? "flex" : ''} justify={(this.props.justify) ? this.props.justify : 'start'} style={this.props.style}>
                    <Form layout="inline" className={(!this.props.defaultAdvanceSearch) ? "searching-form" : "searching-form hidden"} onSubmit={this.handleSearch} style={{ display: (!advancesearch) ? 'block' : 'none' }} >
                        {fieldsDefaultSearch}
                        <span style={{ lineHeight: '40px' }}>
                            <Button label="Search" size="default" type="primary" htmlType="submit" />
                            <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.props.allowCustomClear ? this.customClear : this.handleReset} htmlType="button" />
                            {this.props.useDownload ? <Button htmlType='button' type='primary' icon='download' title={this.props.titleDownload} onClick={() => this.props.handleDownload()} /> : null}
                        </span>
                        <Row style={{ display: (this.props.showAdvanceSearch) ? 'block' : 'none' }}>
                            <a className="btn-advance-search" style={{ fontSize: 12 }} onClick={this.handleAdvanceSearch}>
                                Advance Search<Icon type={advancesearch ? 'up' : 'down'} />
                            </a>
                        </Row>
                    </Form>
                    <Form {...formItemLayout} className="searching-form" style={{ display: ((this.props.showAdvanceSearch && advancesearch) || this.props.defaultAdvanceSearch) ? 'block' : 'none' }} onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: (!this.props.defaultAdvanceSearch) ? 'block' : 'none' }}>
                                <a className="btn-advance-search" style={{ fontSize: 12 }} onClick={this.handleAdvanceSearch}>
                                    Advance Search<Icon type={advancesearch ? 'up' : 'down'} />
                                </a>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={12} xl={12}>
                                {
                                    this.props.optionsConfiguration.map((obj, key) => {
                                        if (key < totalField) { return this.generateField(obj, key); }
                                        return null;
                                    })
                                }
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={12} xl={12}>
                                {
                                    this.props.optionsConfiguration.map((obj, key) => {
                                        if (key >= totalField) { return this.generateField(obj, key); }
                                        return null;
                                    })
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button label="Search" size="default" type="primary" htmlType="submit"> Search </Button>
                                <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.props.allowCustomClear ? this.customClear : this.handleReset} htmlType="button" > Clear </Button>
                                {this.props.useDownload ? <Button htmlType='button' type='primary' icon='download' title={this.props.titleDownload} onClick={() => this.props.handleDownload()} /> : null}
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </React.Fragment>
        )
    }
}

export default SearchForm;