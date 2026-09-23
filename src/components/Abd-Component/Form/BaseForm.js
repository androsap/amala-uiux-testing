import React, { Component } from 'react';
import { 
    AntdInput,
    AntdButton,
    AntdButtonGroup,
    AntdInputHidden,
    AntdDatePicker,
    AntdCheckbox,
    AntdInputNumber,
    AntdPassword,
    AntdSearch,
    AntdRadioButton,
    AntdSelect,
    AntdSwitch,
    AntdTextArea,
    AntdTabPanel,
    AntdUpload,
    AntdTable,
    AntdInputMask
} from './Components';
import { 
    Form, 
    Row,
    Col,
    Spin
} from 'antd';
import moment from 'moment';
import { getFieldValue } from '../BaseFunction';
const uuidv1 = require('uuid/v1');

export class BaseForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            key: uuidv1(),
            spinning: false
        }
        this.methods = {
            handleSubmitBase: (e) => {
                if(e) e.preventDefault();
                const { spinning } = this.state;
                const { itemOptions } = this.methods;
                if(spinning) return false;
                const { validateFields, handleSubmit, form } = this.props;
                
                form.validateFields(validateFields || null, (err, values) => {
                    Object.keys(values).map(item => {
                        const { editorType, editorOptions } = itemOptions(item) || {};
                        const { value } = editorOptions ? (editorOptions.format || {}) : {}
                        if(editorType) 
                            if(editorType === "date" && values[item]) values[item] = moment(values[item]).format(value);
                        return typeof values[item] === "undefined" ? values[item] = null : null;
                    });
                    console.log("values", values)
    
                    if (!err) {
                        if(handleSubmit) handleSubmit(err, values, this.methods);
                    }
                });
            },
            validationSummary: (dt) => {
                var result = [];
    
                Object.keys(dt).forEach((item, index) => {
                    const find = dt.hasOwnProperty(item);
                    if(find){
                        if(!dt[item].hasOwnProperty("errors")){
                            this.validationSummary(dt[item]).forEach(i => {
                                result.push(i) 
                            });
                        }
                        else{
                            result.push({
                                dataField: item,
                                errors: dt[item].errors
                            });
                        }
                    }
                });
                return result;
            },
            loading: (isLoading) => {
                this.setState((prevState) => ({
                    spinning: isLoading || !prevState.spinning,
                }))
            },
            itemOptions: (field, itemChilds) => {
                const { items } = this.props;
                const { itemOptions } = this.methods;
                
                var itemFields = !itemChilds ? items : itemChilds;
    
                let result = null;
    
                itemFields.forEach(item => {
                    if (item.itemType === "group") {
                        if (item.key === field) {
                            if(item) result = item;
                        }
                        else {
                            const r = itemOptions(field, item.items);
                            if(r) result = r;
                        }
                    }
                    else {
                        if(item.editorType === "tabpanel"){
                            if (item.dataField === field) {
                                if(item) { 
                                    result = item;
                                }
                            }
                            else{
                                item.editorOptions.items.forEach(itemChild => {
                                    if(itemChild.form.key === field){
                                        result = itemChild.form;
                                    }
                                    else{
                                        const r = itemOptions(field, itemChild.form.items);
                                        if(r) result = r;
                                    }
                                })
                            }
                        }
                        else{
                            if (item.dataField === field) {
                                if(item) { 
                                    result = item;
                                }
                            }
                        }
                    }
                });
                return result;
            },
            setValueSelf: async (keys) => {
                // let { getData, updateData } = this.methods;
                let { setFieldsValue } = this.props.form;
                // let data = await getData();
                // debugger
                setFieldsValue({})
                // updateData(data)
            },
            addItem: (itemData, key) => {
                let { items } = this.props;
                let { itemOptions, setValueSelf } = this.methods;
    
                if(itemData){
                    if(Array.isArray(itemData)){
                        if(key){
                            if(itemOptions(key)){
                                if(itemOptions(key).items){
                                    itemData.forEach(item => {
                                        itemOptions(key).items.push(item);
                                    })
                                }
                            }
                        }
                        else{
                            itemData.forEach(item => {
                                items.push(item);
                            })
                        }
                    }
                    else {
                        if(key){
                            if(itemOptions(key)){
                                itemOptions(key).items.push(itemData);
                            }
                        }
                        else{
                            items.push(itemData);
                        }
                    }
                
                    setValueSelf();
                }
            },
            removeItem: (keys, data) => {
                let { items } = this.props;
                let obj = data || items;
                let { removeItem, setValueSelf } = this.methods;
                
                if(Array.isArray(obj)){
                    var i = obj.length;
                    while (i--) {
                        if (obj[i].itemType === "group"){
                            if(obj[i].key === keys){
                                obj.splice(i, 1); 
                                continue;
                            }
                        }
                        else{
                            if(obj[i].dataField === keys) {
                                obj.splice(i, 1); 
                                continue;
                            }
                        }
                        obj[i].items && removeItem(keys, obj[i].items);
                    }
                }
                else{
                    removeItem(keys, [obj]);
                }

                setValueSelf(keys);
            },
            getData: () => {
                const { getFieldsValue } = this.props.form;
                return getFieldsValue();
            },
            reset: () => {
                const { resetFields } = this.props.form;
                resetFields();
            },
            refresh: () => {
                const { setFieldsValue } = this.props.form;
                setFieldsValue({});
            },
            updateData: (formData, value, itemChilds) => {
                const { items, isGrouping, form } = this.props;
                const { updateData, itemOptions, addItem, loading } = this.methods;
                const { setFieldsValue } = form;
                var itemFields = !itemChilds ? items : itemChilds;
                loading();
                //case if formData have a key and value and item is not found, so this function add input hide for save the formData
                const addItemDynamic = (dataItem) => {
                    const str = JSON.stringify(items || []);
                    const summaryField = str !== "[]" ? str.match(/"dataField":"(.*?)",/g) : [];
                   
                    const dataFields = summaryField ? summaryField.map(m => {
                        return m.match(/":"(.*?)"/g)[0].replace(/"/g, "").replace(/:/g, "")
                    }) : [];
        
                    const getKeys = (data) => {
                        const isObject = val => typeof val === 'object' && !Array.isArray(val);
        
                        const paths = (obj = {}) => Object.entries(obj || {}).reduce((product, [key, value]) =>
                            isObject(value) ?
                                product.concat([
                                    [key, paths(value)] // adds [root, [children]] list
                                ]) :
                                product.concat([key]), // adds [child] list
                                []
                        )
        
                        const addDelimiter = (a, b) => a ? `${a}.${b}` : b;
        
                        const pathToString = ([root, children]) => children.map(child =>
                            Array.isArray(child) ?
                                addDelimiter(root, pathToString(child)) :
                                addDelimiter(root, child)
                        ).join('|');

                        var result = [];
                        const dt = pathToString(["", paths(data)]).split("|");
                        dt.forEach(item => {
                            if(Array.isArray(data[item])) {
                                const { editorType } = itemOptions(item) || {};
                                if(editorType === "table") result.push(`${item}`)
                                else data[item].map((d, index) => result.push(`${item}[${index}]`))
                            }
                            else result.push(`${item}`)
                        })
                        return result;
                    }
        
                    const keyNewItem = getKeys(dataItem);
                    
                    var addNew = [];
                    keyNewItem.forEach(y => {
                        const exist = dataFields.findIndex(x => x === y);
                        if(exist === -1 && addNew.filter(z => z === y).length === 0 && y){
                            addNew.push(y)
                        }
                    })
        
                    if(!isGrouping){
                        addNew.forEach(x => {
                            if(!itemOptions(x)){
                                addItem({
                                    dataField: x,
                                    editorType: "hidden"
                                })
                            }
                        });
                    }
                    setFieldsValue({});
                }
        
                addItemDynamic(formData);
        
                setTimeout(() => {
                    if(Object.keys(formData).length){
                        if(typeof formData === "string" && typeof value !== "undefined"){
                            const find = items.find(x => x.dataField === formData);
                            if(find){
                                if(find.editorType === "date" || find.editorType === "month" || find.editorType === "range" || find.editorType === "week"){
                                    setFieldsValue({
                                        [formData]: moment(value)
                                    })
                                }
                                else{
                                    setFieldsValue({
                                        [formData]: value
                                    })
                                }
                            }
        
                            setFieldsValue(formData)
                        }
                        else if(typeof formData === "object"){
                            if(Object.keys(formData).length){
                                itemFields.forEach(item => {
                                    if(item.itemType === "group"){
                                        updateData(formData, null, item.items);
                                    }
                                    else{
                                        if(item.editorType === "date" || item.editorType === "month" || item.editorType === "range" || item.editorType === "week"){
                                            const { format } = item.editorOptions;
                                            const { value } = format || {};
                                            if(getFieldValue(formData, item.dataField))
                                                setFieldsValue({
                                                    [item.dataField]: value ? moment(formData[item.dataField], value) : moment(formData[item.dataField])
                                                })
                                        }
                                        else if(item.editorType === "upload"){
                                            let upload = itemOptions(item.dataField);
                                            if(Array.isArray(getFieldValue(formData, item.dataField))){
                                                if(formData[item.dataField].length){
                                                    upload.editorOptions.defaultFileList = formData[item.dataField];
                                                }
                                            }
                                        }
                                        else if(item.editorType === "tabpanel"){
                                            item.editorOptions.items.forEach(itemTab => {
                                                updateData(formData, null, itemTab.form.items);
                                            })
                                            setFieldsValue({});
                                        }
                                        else if(item.editorType === "table"){
                                            if(item.dataField){
                                                const valueDt = getFieldValue(formData, item.dataField);
                                                if(Array.isArray(valueDt)){
                                                    item.editorOptions.dataSource = valueDt;
                                                    setFieldsValue({});
                                                }
                                            }
                                        }
                                        else{
                                            if(item.dataField){
                                                const v = item.dataField;
                                                const f = v.indexOf("[");
                                                const l = v.lastIndexOf("]");
                                                
                                                const dataField = f !== -1 ? v.replace(v.slice(f, l+1), "") : v;
                                                if(getFieldValue(formData, dataField)) 
                                                    setFieldsValue({
                                                        [dataField]: getFieldValue(formData, dataField)
                                                    })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                    setFieldsValue({});
                    loading();
                }, 20);
            },
            renderForm: (items, colCount, data, options, isFirst) => {
                const { caption } = this.props;
                const { renderElement, renderForm } = this.methods;
                
                colCount = colCount || 1;
                
                return (<Row>
                    {caption && isFirst ? <Col span={24}><h6 className="mb-1 pl-3 pr-3">{caption}</h6><hr className="m-0 ml-2 mr-2"/></Col> : null}
                    {items.map((item, index) => {
                        if(item.itemType === "group"){
                            const colCountChild = item.colCount || 1;
                            const span = Math.round((24 / colCount) * (item.colSpan || 1));
                            const visible = typeof(item.visible) !== "undefined" ? (!item.visible ? " d-none" : "") : "";
                            const className = item.class || "";
                            return (<Col key={`group-${index}`} span={span} className={className + visible}>
                                {item.caption ? <Col key={`sub-group-${index}`} span={24}><h6 className="mb-1 pl-3 pr-3">{item.caption}</h6><hr className="m-0 ml-2 mr-2"/></Col> : null}
                                {renderForm(item.items, colCountChild, data, item)}
                            </Col>)
                        }
                        else{
                            const span = Math.round((24 / colCount) * (item.colSpan || 1));
                            let styleDisplay = typeof(item.visible) !== "undefined" ? (!item.visible ? {style:{display: "none"}} : null) : null;
                            let style = Object.assign(styleDisplay || {}, {padding: "0px 5px"});
                            style = Object.assign(style, item.style || {});
        
                            return (<Col key={`element-${item.dataField || index}`} span={span} style={{...style}}>
                                {renderElement(item, data, options)}
                            </Col>)
                        }
                    })}
                </Row>);
            },
            renderElement: (item, data, options) => {
                const { disabled, formData } = this.props;
                const { form } = this.props;
                if (typeof (item.itemTemplate) === "function") {
                    return item.itemTemplate({
                        data, 
                        item, 
                        options,
                        ...this.methods
                    });
                }
    
                var EditorType = AntdInput;
    
                if(typeof(item) === "string"){
                    var sp = item.split("|");
                    if(sp.length === 1){
                        item = { dataField: item }
                    }
                    else{
                        item = { 
                            dataField: sp[0],
                            ...sp[1] ? { editorType: JSON.parse(sp[1]) } : null,
                            ...sp[2] ? { label: JSON.parse(sp[2]) } : null,
                            ...sp[3] ? { editorOptions: JSON.parse(sp[3]) } : null,
                            ...sp[4] ? { validationRules: JSON.parse(sp[4]) } : null
                        }
                    }
                }
                
                if(!item.editorOptions){
                    item.editorOptions = {};
                }
    
                if(!item.editorType) item.editorType = "input";
                
                if(options){
                    if(options.disabled){
                        item.editorOptions.disabled = true;
                        item.validationRules = [];
                    }
                }
    
                if(disabled){
                    if(options){
                        if(!options.withOut){
                            item.editorOptions.disabled = true;
                            item.validationRules = [];
                        }
                    }
                    else{
                        item.editorOptions.disabled = true;
                        item.validationRules = [];
                    }
                }
    
                switch(item.editorType.toLocaleLowerCase()){
                    case "input":
                        EditorType = AntdInput;
                        break;
                    case "hidden":
                        EditorType = AntdInputHidden;
                        break;
                    case "mask":
                        EditorType = AntdInputMask;
                        break;
                    case "button":
                        EditorType = AntdButton;
                        if(!item.editorOptions) item.editorOptions = {}
                        if(!item.editorOptions.className) item.editorOptions.className = "";
                        if(!item.editorOptions.className.includes("btn-default")) item.editorOptions.className += " btn-default "
                        break;
                    case "textarea":
                        EditorType = AntdTextArea;
                        break;
                    case "date":
                        EditorType = AntdDatePicker;
                        break;
                    case "radiobutton":
                        EditorType = AntdRadioButton;
                        break;
                    case "select":
                        EditorType = AntdSelect;
                        break;
                    case "number":
                        EditorType = AntdInputNumber;
                        break;
                    case "checkbox":
                        EditorType = AntdCheckbox;
                        break;
                    case "switch":
                        EditorType = AntdSwitch;
                        break;
                    case "tabpanel":
                        EditorType = AntdTabPanel;
                        item.editorOptions.items = item.editorOptions.items.map(x => {
                            return {
                                ...x,
                                form: {
                                    ...x.form,
                                    formData: Object.assign(x.form.formData|| {}, formData || {})
                                }
                            }
                        });
                        break;
                    case "table":
                        EditorType = AntdTable;
                        if(item.dataField){
                            const valueDt = getFieldValue(formData, item.dataField);
                            if(Array.isArray(valueDt)){
                                item.editorOptions.dataSource = valueDt;
                                // form.setFieldsValue({
                                //     [item.dataField] : valueDt
                                // });
                            }
                        }
                        break;
                    case "password":
                        EditorType = AntdPassword;
                        break;
                    case "upload":
                        EditorType = AntdUpload;
                        break;
                    case "search":
                        EditorType = AntdSearch;
                        break;
                    case "buttongroup":
                        EditorType = AntdButtonGroup;
                        if(!item.editorOptions) item.editorOptions = {}
    
                        if(typeof item.editorOptions.items === "object"){
                            item.editorOptions.items.forEach(x => {
                                if(!x.className) x.className = "";
                                
                                if(!x.className.includes("btn-default")) x.className += " btn-default "
                            });
                        }
                        break;
                    default:
                        EditorType = AntdInput;
                        break;
                }

                return <EditorType props={item} form={form} methods={this.methods} />;
            },
            setItem: (data) => {
                this.props.form.setFieldsValue(data)
            }
        }
    }

    componentDidMount(){
        const { formData } = this.props;
        const { updateData } = this.methods;

        updateData(formData || {});
    }

    render() {
        const { items, colCount, formData, isGrouping, handleSubmit } = this.props;
        const { handleSubmitBase, renderForm } = this.methods;
        const { key, spinning } = this.state;
        return (<Spin spinning={spinning}>
            {isGrouping
                ? renderForm(items || [], colCount, formData, null, true) 
                : <Form
                    className="asyst-form"
                    key={key}
                    onSubmit={handleSubmit ? handleSubmitBase : (e) => {e.preventDefault()}}
                >
                    {renderForm(items || [], colCount, formData, null, true)}
                </Form>}
        </Spin>);
    }
}

export default BaseForm;