import React, { Component } from 'react';
import { 
    Table,
    Row,
    Col,
    Input,
    Pagination,
    Alert,
    Spin,
    Button,
    Dropdown,
    Menu,
    Popover,
    Transfer,
    Form,
    Modal,
    Icon
} from 'antd'
import { 
    distinct, 
    sorting, 
    getFieldValue, 
    jsonCopy,
    formatCurrency
} from '../BaseFunction';
import moment from 'moment';
import BaseHelper from '../../../helper/BaseHelper';
import TypeRequestEnum from '../enums/TypeRequestEnum';
import BaseForm from '../Form/BaseForm';

const uuidv1 = require('uuid/v1');
const { confirm } = Modal;

export class Index extends Component {
    constructor(props){
        super(props);
        const { paging, columns } = props;
        const { pageSize } = paging || {};

        const columnChooserDataSource = columns
            .filter(x => typeof x.showInColumnChooser === "undefined" ? true : x.showInColumnChooser)
            .map(x => {
                return {
                    key: x.dataField || x.caption,
                    title: x.caption || x.dataField,
                    description: x.caption || x.dataField,
                    visible: typeof x.visible === "undefined" ? true : x.visible
                }
            })

        this.state = {
            keyTable: uuidv1(),
            keyPagination: uuidv1(),
            columnChooserDataSource,
            columnChooserSelectedKeys: [],
            columnChooserTargetKeys: columnChooserDataSource.filter(x => !x.visible).map(x => x.key),
            modeEdit: null,
            activeMode: -1,
            isNew: false,
            rowItemEditable: [],
            visibleColumnChooser: false,
            scroll: null,
            loading: false,
            limit: pageSize || 10,
            page: 1,
            mainDataSource: [],
            filters: {},
            fixedFilter: {},
            sort: {},
            totalPage: 0,
            totalRecord: 0,
            columnsMap: this.mappingColumn(columns),
            componentToolbar: [],
            componentError: [],
            selectedRowKeys: [],
            selectRowData: [],
            isSelectAll: false,
            componentExport: null,
            isCancel: false,
            isUpdate: false,
            tempMainDataSource: []
        }
        this.methods = {
            mappingColumn: this.mappingColumn.bind(this),
            loading: (isLoading) => {
                this.setState((prevState) => ({
                    loading: isLoading || !prevState.loading,
                }))
            },
            getDataSource: () => {
                const { mainDataSource } = this.state;
                return mainDataSource;
            },
            refresh: () => {
                const { dataSource, columns, keyData, caseback } = this.props;
                const { limit, page, sort, fixedFilter, filters, selectRowData, mainDataSource, paging } = this.state;
                const { loading, resizableGrid } = this.methods;

                loading();
    
                let col = columns.filter(x => x.dataField),
                    columnRender = [];
    
                col.forEach((item) => {
                    const column = item.dataField;
                    const colSplit = column.split(".");
    
                    columnRender.push({
                        dataField: colSplit[0]
                    });
                });

                if(typeof(dataSource) === "object"){
                    if(dataSource.store){
                        dataSource.store(this);
                    }
                    else if(dataSource.customeStore){
                        class helper extends BaseHelper {};
                        const { url, parameter, methods, callback } =  dataSource.customeStore;
                        const defaultSort = columns.find(x => x.sort);
                        let loadParams = {
                            paging: {
                                limit: limit,
                                page: page
                            },
                            parameter: {
                                column: columns.filter(x => x.dataField).map(x => x.dataField),
                                criteria: filters,
                                filter: fixedFilter,
                                sort: Object.keys(sort).length ? sort : (defaultSort ? { [defaultSort.dataField] : defaultSort.sort } : {}),
                                ...parameter ? {...parameter(this) } : null
                            }
                        };
                        helper.request(methods || TypeRequestEnum.REQUEST_POST, url, loadParams, (status, data, response_message) => {
                            const { result, paging } = data || {};
                            if(callback) callback({ options: this, status, data, response_message })
                            if(caseback) caseback({ options: this, status, data, response_message })
                            loading();
                            if (status) {
                                let indexing = [];
                                const dt = jsonCopy(result);
                                dt.forEach((item) => {
                                    if(selectRowData.filter(j => j === item[keyData]).length){
                                        indexing.push(item[keyData]);
                                    }
                                })

                                this.setState({
                                    selectedRowKeys: indexing,
                                    mainDataSource: result,
                                    totalPage: paging.totalpage || 1,
                                    totalRecord: paging.totalrecord,
                                    componentError: []
                                });
                            } 
                            else {
                                this.setState({
                                    componentError: <Alert
                                        type="error"
                                        message={response_message || "Error"}
                                        showIcon
                                        closable
                                        className="mb-2"
                                    />
                                })
                            }

                            const { table } = this.refs;

                            setTimeout(() => {
                                resizableGrid(table._reactInternalFiber.alternate.return.stateNode.querySelector("table"));
                            }, 100)
                        });
                    }
                    else{
                        let dataSourceModification = dataSource;
                        const { pageSize, visible } = paging || {};
        
                        const sortKey = Object.keys(sort);
                        if(sortKey.length){
                            const sortValue = sort[sortKey[0]];
                            dataSourceModification = sorting[sortValue](dataSourceModification, sortKey[0]);
                        }
        
                        const filterKeys = Object.keys(filters);
                        if(filterKeys.length){
                            let dataMapping = [];
                            filterKeys.forEach((keyFilter, index) => {
                                const searchValue = filters[keyFilter].toLowerCase().replace(/%/g, "");
                                dataSourceModification
                                    .filter(item => 
                                        item[keyFilter] ? 
                                            getFieldValue(item, keyFilter).toLowerCase().search(searchValue) !== -1 
                                            : 0)
                                    .forEach(item => {
                                        const find = dataMapping.findIndex(x => getFieldValue(x, keyData) === getFieldValue(item, keyData));
                                        if(find === -1){
                                            dataMapping.push(item)
                                        };
                                    })
                            });
                            dataSourceModification = dataMapping;
                        }
        
                        const fixedFilterKeys = Object.keys(fixedFilter);
                        if(fixedFilterKeys.length){
                            let dataMapping = [];
                            fixedFilterKeys.forEach((keyFilter, index) => {
                                [fixedFilter[keyFilter]].forEach(dt => {
                                    const searchValue = dt.toLowerCase();
                                    dataSourceModification
                                        .filter(item => {
                                            return item[keyFilter] ? 
                                                getFieldValue(item, keyFilter).toLowerCase() === searchValue 
                                                : 0
                                        })
                                        .forEach(item => {
                                            const find = dataMapping.findIndex(x => getFieldValue(x, keyData) === getFieldValue(item, keyData));
                                            if(find === -1){
                                                dataMapping.push(item)
                                            };
                                        })
                                })
                            });
                            dataSourceModification = dataMapping;
                        }
        
                        let dataSourceModificationAfterLimit = dataSourceModification;
                        const limit = pageSize || 10;
                        if(visible){
                            dataSourceModificationAfterLimit = dataSourceModification.slice(page === 1 ? 0 :limit, page === 1 ? limit : parseInt(page * limit))
                        }
        
                        let indexing = [];
                        const dt = jsonCopy(mainDataSource);
                        dt.forEach((item, index) => {
                            if(selectRowData.filter(j => j === item[keyData]).length){
                                indexing.push(item[keyData]);
                            }
                        })

                        if(caseback) caseback({ options: this, status: true, data: { result: dataSourceModification }, response_message: "" })
        
                        this.setState({
                            selectedRowKeys: indexing,
                            totalPage: Math.round(dataSourceModification.length / limit) || 1,
                            totalRecord: dataSourceModification.length,
                            mainDataSource: dataSourceModificationAfterLimit,
                            componentError: [],
                        })

                        loading();
                    }
                }
            },
            handleExport: (e) => {
                const { exportToExcel } = this.methods;
                switch (e.key) {
                    case "1":
                        exportToExcel(true);
                        break;
                    case "2":
                        exportToExcel();
                        break;
                    default:
                        break;
                }
            },
            exportToExcel: (isAll = false) => {
                const { dataSource, columns, keyData, exports } = this.props;
                const { sort, fixedFilter, filters, selectRowData, columnsMap } = this.state;
                const { loading } = this.methods;

                loading();
    
                let col = columns.filter(x => x.dataField),
                    columnRender = [];
    
                col.forEach((item) => {
                    const column = item.dataField;
                    const colSplit = column.split(".");
    
                    columnRender.push({
                        dataField: colSplit[0]
                    });
                });

                if(typeof(dataSource) === "object"){
                    if(dataSource.customeStore){
                        class helper extends BaseHelper {};
                        const { url, parameter, methods, callback } =  dataSource.customeStore;
                        const defaultSort = columns.find(x => x.sort);
                        let loadParams = {
                            paging: {
                                limit: 9999999,
                                page: 1
                            },
                            parameter: {
                                column: columns.filter(x => x.dataField).map(x => x.dataField),
                                criteria: filters,
                                filter: !isAll ? { } : fixedFilter,
                                sort: Object.keys(sort).length ? sort : (defaultSort ? { [defaultSort.dataField] : defaultSort.sort } : {}),
                                ...parameter ? {...parameter(this) } : null
                            }
                        };
                        helper.request(methods || TypeRequestEnum.REQUEST_POST, url, loadParams, (status, data, response_message) => {
                            let { result } = data || {};
                            if(callback) callback({ options: this, status, data, response_message })
                            loading();
    
                            if (status) {
                                this.setState({
                                    componentExport: <Table className="d-none" id="tableExport" key="exportTable" rowKey={keyData} pagination={false} dataSource={!isAll ? result.filter(x => selectRowData.indexOf(x[keyData]) !== -1) : result} columns={columnsMap.filter(x => typeof x.allowExporting === "undefined" ? true : x.allowExporting)}></Table>,
                                    componentError: []
                                })
            
                                setTimeout(() => {
                                    const exportComponent = {
                                        uri: "data:application/vnd.ms-excel;base64,",
                                        template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                                        base64: function(s) {
                                            return window.btoa(unescape(encodeURIComponent(s)));
                                        },
                                        format: function(s, c) {
                                            return s.replace(/{(\w+)}/g, function(m, p) {
                                                return c[p];
                                            });
                                        }
                                    };

                                    const ctx = { worksheet: "Worksheet", table: document.getElementById("tableExport").querySelector("table").innerHTML };
                                    const url = exportComponent.uri + exportComponent.base64(exportComponent.format(exportComponent.template, ctx));
                
                                    var element = document.createElement('a');
                                    element.setAttribute('href', url);
                                    element.setAttribute('download', exports.fileName || "download");
                                    element.style.display = 'none';
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
            
                                    this.setState({
                                        componentExport: []
                                    })
                                }, 10);
                            } 
                            else {
                                this.setState({
                                    componentError: <Alert
                                        type="error"
                                        message={response_message || "Error"}
                                        showIcon
                                        closable
                                        className="mb-2"
                                    />
                                })
                            }
                        });
                    }
                    else{
                        loading();
                    }
                }

            },
            rowSelection: () => {
                const { keyData, allowSelection, columns, dataSource } = this.props;
                const { selectedRowKeys, selectRowData, mainDataSource, sort, fixedFilter, filters } = this.state;
                const { loading } = this.methods;
                
                const { enabled } = allowSelection || {};
    
                if(!(enabled)) return null
    
                return {
                    selectedRowKeys,
                    hideDefaultSelections: true,
                    onSelection: (selectedRowKeys) => { },
                    onChange: (selectedRowKeys, selectedRows) => { },
                    onSelect: (record, selected, selectedRows) => {
                        if(selected){
                            let newSelect = selectRowData;
                            newSelect.push(record[keyData]);
                            this.setState({
                                selectRowData: newSelect
                            })
                        }
                        else{
                            this.setState({
                                selectRowData: selectRowData.filter(x => x !== record[keyData])
                            })
                        }
    
                        var indexing = [];
                        mainDataSource.forEach((item, index) => {
                            if(selectRowData.filter(j => j === item[keyData]).length){
                                indexing.push(item[keyData]);
                            }
                        })
                        this.setState({
                            selectedRowKeys: indexing
                        })
                    },
                    onSelectAll: (selected, selectedRows, changeRows) => {
                        if(selected){
                            loading();
                            let col = columns.filter(x => x.dataField),
                                columnRender = [];
    
                            col.forEach((item, index) => {
                                const column = item.dataField;
                                const colSplit = column.split(".");
    
                                columnRender.push({
                                    dataField: colSplit[0]
                                });
                            });
    
                            if(typeof(dataSource) === "object"){
                                if(dataSource.customeStore){
                                    class helper extends BaseHelper {};
                                    const { url, parameter, methods } =  dataSource.customeStore;
                                    let loadParams = {
                                        paging: {
                                            limit: 99999,
                                            page: 1
                                        },
                                        parameter: {
                                            column: columns.filter(x => x.dataField).map(x => x.dataField),
                                            criteria: filters,
                                            filter: fixedFilter,
                                            sort: sort,
                                            ...parameter ? {...parameter(this) } : null
                                        }
                                    };
                                    helper.request(methods || TypeRequestEnum.REQUEST_POST, url, loadParams, (status, data, response_message) => {
                                        const { result } = data || {};
                                        loading();
                                        this.setState({ isSelectAll: true })
            
                                        if (status) {
                                            let indexing = [];
                                            const dt = jsonCopy(result);
            
                                            this.selectRowData = dt.map(item => {
                                                return item[keyData]
                                            });
            
                                            dt.forEach((item, index) => {
                                                indexing.push(item[keyData]);
                                            });
            
                                            this.setState({
                                                selectedRowKeys: indexing,
                                                componentError: []
                                            })
                                        } 
                                        else {
                                            this.setState({
                                                componentError: <Alert
                                                    type="error"
                                                    message={response_message || "Error"}
                                                    showIcon
                                                    closable
                                                    className="mb-2"
                                                />
                                            })
                                        }
                                    });
                                }
                            }
                        }
                        else{
                            this.setState({
                                selectRowData: [],
                                selectedRowKeys: []
                            })
                        }
                    },
                };
            },
            handleTableChange: (pagination, filters, sorter) => {
                const { refresh } = this.methods;
                let { sort, fixedFilter } = this.state;

                if (sorter) {
                    this.setState({ sort: {}});
                    if (sorter.field && sorter.order){
                        sort[sorter.field] = sorter.order === "ascend" ? "asc" : "desc";
                        this.setState({ sort });
                    } 
                }
    
                if (filters) {
                    Object.keys(filters).forEach(item => {
                        if (filters[item].length) {
                            fixedFilter[item] = filters[item];
                        } else {
                            delete fixedFilter[item];
                        }
                        
                        this.setState({ 
                            fixedFilter, 
                            page: 1,
                            keyPagination: uuidv1() 
                        });
                    });
                }
    
                setTimeout(() => {
                    refresh();
                }, 0)
            },
            handleGetFilter: (field) => {
                let {
                    fixedFilter,
                    filters,
                    columnsMap
                } = this.state;
                let {
                    dataSource,
                    keyData
                } = this.props;

                const findIndex = columnsMap.findIndex(i => i.dataIndex === field);
    
                let fxFilter = {};
                const filterKeys = Object.keys(fixedFilter);
                const findIndexKeys = filterKeys.findIndex(x => x === field);
    
                filterKeys.forEach((item, index) => {
                    if (index < findIndexKeys || findIndexKeys === -1) {
                        fxFilter[item] = fixedFilter[item];
                    }
                });
    
                if (findIndex !== -1) {
                    if(typeof(dataSource) === "object"){
                        if(dataSource.store){
                            dataSource.store(this);
                        }
                        else if(dataSource.customeStore){
                            class helper extends BaseHelper {};
                            const { url, parameter, methods } =  dataSource.customeStore;
                            let loadParams = {
                                paging: {
                                    limit: 9999999,
                                    page: 1
                                },
                                parameter: {
                                    column: columns.filter(x => x.dataField).map(x => x.dataField),
                                    criteria: filters,
                                    filter: fxFilter,
                                    sort: {
                                        [field]: "asc"
                                    },
                                    ...parameter ? {...parameter(this) } : null,
                                    group: columns.filter(x => x.dataField === field).map(x => x.dataField)
                                }
                            };
                            helper.request(methods || TypeRequestEnum.REQUEST_POST, url, loadParams, (status, data, response_message) => {
                                const { result } = data || {};
                                delete columnsMap[findIndex].filterDropdown;
                                if (status) {
                                    let dataFilter = [];
                                    dataFilter = result
                                        .filter(i => getFieldValue(i, field) && getFieldValue(i, field).toString().replace(/(\r\n|\n|\r)/gm, ""))
                                            .map(dt => {
                                                const { format, dataType } = columns.find(({ dataField }) => dataField === field) || {};
                                                const f = getFieldValue(dt, field);
                                                let text = f;
                                                if(dataType === "date" && format) text = moment(f).format(format);
                                                return {
                                                    text,
                                                    value: f
                                                };
                                            });
        
                                    columnsMap[findIndex].filters = dataFilter;
        
                                    this.setState({
                                        columnsMap,
                                        componentError: []
                                    })
                                }
                                else {
                                    this.setState({
                                        componentError: <Alert
                                            type="error"
                                            message={response_message || "Error"}
                                            showIcon
                                            closable
                                            className="mb-2"
                                        />
                                    })
                                }
                            });
                        }
                        else{
                            delete columnsMap[findIndex].filterDropdown;
                            let dataFilter = [];
        
                            var dataSourceModification = dataSource;
        
                            const filterKeys = Object.keys(filters);
                            if(filterKeys.length){
                                let dataMapping = [];
                                filterKeys.forEach((keyFilter, index) => {
                                    const searchValue = filters[keyFilter].toLowerCase().replace(/%/g, "");
                                    dataSourceModification
                                        .filter(item => 
                                            item[keyFilter] ? 
                                                getFieldValue(item, keyFilter).toLowerCase().search(searchValue) !== -1 
                                                : 0)
                                        .forEach(item => {
                                            const find = dataMapping.findIndex(x => getFieldValue(x, keyData) === getFieldValue(item, keyData));
                                            if(find === -1){
                                                dataMapping.push(item)
                                            }
                                        })
                                });
                                dataSourceModification = dataMapping;
                            }
        
                            const fixedFilterKeys = Object.keys(fxFilter);
                            if(fixedFilterKeys.length){
                                let dataMapping = [];
                                fixedFilterKeys.forEach((keyFilter) => {
                                    [fxFilter[keyFilter]].forEach(dt => {
                                        const searchValue = dt.toLowerCase();
                                        dataSourceModification
                                            .filter(item => 
                                                item[fixedFilterKeys] ? 
                                                    getFieldValue(item, fixedFilterKeys).toLowerCase() === searchValue 
                                                    : 0)
                                            .forEach(item => {
                                                const find = dataMapping.findIndex(x => getFieldValue(x, keyData) === getFieldValue(item, keyData));
                                                if(find === -1){
                                                    dataMapping.push(item)
                                                };
                                            })
                                    })
                                });
                                dataSourceModification = dataMapping;
                            }
        
                            dataFilter = dataSourceModification
                                .filter(i => getFieldValue(i, field) && getFieldValue(i, field).toString().replace(/(\r\n|\n|\r)/gm, ""))
                                    .map(dt => {
                                        const f = getFieldValue(dt, field);
                                        return {
                                            text: f,
                                            value: f
                                        };
                                    }); 
        
                            if(dataFilter.length){
                                columnsMap[findIndex].filters = sorting.asc(distinct(dataFilter, "value"),"value");
                                this.setState({
                                    columnsMap
                                })
                            }
                        }
                    }
                }
            },
            onSearch: (value, key) => {
                let { columns } = this.props;
                let { filters } = this.state;
                let { refresh } = this.methods;
                let col = columns.filter(x => x.dataField && typeof x.visible === "undefined" ? true : x.visible);
                this.setState({
                    page: 1,
                    keyPagination: uuidv1()
                });
    
                col.forEach(col => {
                    if (value) filters[col.dataField] = `%${value}%`;
                    else delete filters[col.dataField];
                    this.setState({ filters })
                });
    
                setTimeout(() => {
                    refresh();
                }, 0)
            },
            onChangeSearch: (e) => {
                let { refresh } = this.methods;
                if (!e.target.value) {
                    this.setState({ filters: {} });
                    setTimeout(() => {
                        refresh();
                    }, 0)
                }
            },
            handlePageChange: (pageNumber, pageSize) => {
                let { refresh } = this.methods;
                this.setState({
                    page : pageNumber
                })
                setTimeout(() => {
                    refresh();
                }, 0)
            },
            onShowSizeChange: (pageNumber, pageSize) => {
                let { refresh } = this.methods;

                this.setState({
                    page : 1,
                    limit: pageSize
                });

                setTimeout(() => {
                    refresh();
                }, 0)
            },
            columnChooserChange: (nextTargetKeys, direction, moveKeys) => {
                let { columns } = this.props;
                const { mappingColumn, resizableGrid } = this.methods;
                
                this.setState({
                    columnChooserTargetKeys: nextTargetKeys
                })
                
                if(direction === "left"){
                    columns = columns.map(x => {
                        return {
                            ...x,
                            visible: moveKeys.indexOf(x.dataField) !== -1 || typeof x.visible === "undefined" ? true : x.visible
                        }
                    })
                }
                else{
                    columns = columns.map(x => {
                        return {
                            ...x,
                            visible: moveKeys.indexOf(x.dataField) !== -1 ? false : typeof x.visible === "undefined" ? true : x.visible
                        }
                    })
                }
    
                this.setState({
                    columnsMap: mappingColumn(columns.filter(x => nextTargetKeys.indexOf(x.dataField) === -1))
                })
            
                //set table resize
                const { table } = this.refs;

                setTimeout(() => {
                    resizableGrid(table._reactInternalFiber.alternate.return.stateNode.querySelector("table"));
                }, 100)
            },
            columnChooserFilterOption: (inputValue, option) => {
                return option.key.indexOf(inputValue) > -1;
            },
            resizableGrid: (e) => {
                var t = e.getElementsByTagName("tr")[0],
                    n = t ? t.children : void 0;
                    
                
                const d = (e) => {
                    var t, n, i, o, r;
                    e.addEventListener("mousedown", (e) =>  {
                        n = e.target.parentElement;
                        i = n.nextElementSibling;
                        t = e.pageX;

                        var d = ((e) =>  {
                            if ("border-box" === l(e, "box-sizing")) return 0;
                            var t = l(e, "padding-left"),
                                n = l(e, "padding-right");
                            return parseInt(t) + parseInt(n)
                        })(n);
                        o = n.offsetWidth - d; 
                        i && (r = i.offsetWidth - d);
                    })
                    e.addEventListener("mouseover", function(e) {
                        e.target.style.borderRight = "3px solid #0000ff"
                    });
                    e.addEventListener("mouseout", function(e) {
                        e.target.style.borderRight = ""
                    });
                    document.addEventListener("mousemove", function(e) {
                        if (n) {
                            var d = e.pageX - t;
                            i && (i.style.width = r - d + "px"); 
                            n.style.width = o + d + "px"
                        }
                    });
                    document.addEventListener("mouseup", function(e) {
                        n = void 0;
                        i = void 0; 
                        t = void 0; 
                        r = void 0; 
                        o = void 0;
                    })
                }
                
                const s = (e) => {
                    var t = document.createElement("div");
                    t.style.top = 0; t.style.right = 0; t.style.width = "5px"; t.style.position = "absolute"; t.style.cursor = "col-resize"; t.style.userSelect = "none"; t.style.height = e + "px";
                    return  t
                }
                
                const l = (e, t) => {
                    return window.getComputedStyle(e, null).getPropertyValue(t)
                }

                if (n) {
                    e.style.overflow = "hidden";
                    for (var i = e.offsetHeight, o = 0; o < n.length; o++) {
                        var r = s(i);
                        if(!n[o].classList.contains("disabled-resizing")){
                            n[o].appendChild(r); 
                            n[o].style.position = "relative"; 
                            d(r);
                        } 
                    }
                }
            },
            cancelAction: (value) => {
                this.setState((prevState) => ({
                    isCancel: typeof value !== "undefined" ? value : !prevState.isCancel,
                }))
            },
            actionGrid: this.actionGrid.bind(this)
        }
        this.style ={
            inputSearch: {
                width:"75%",
                float:"right",
                maxWidth:250
            },
            pagination: {
                float:"right", 
                marginRight:-7
            },
            btnColumnChooser: {
                width:32,
                marginTop:0,
                paddingBottom:5,
                float:"right"
            },
            btnExports: {
                width:32,
                marginTop:0,
                padding:0,
                float:"right"
            }
        }
    }

    actionGrid  = async (type, value, row, index) => {
        const { editing, form, columns, keyData, onInitNewRow, onRowInserting, onRowInserted, onEditingStart, onRowUpdating, onRowUpdated, onRowRemoving, onRowRemoved } = this.props;
        let { mainDataSource, isNew, modeEdit, activeMode, tempMainDataSource } = this.state;
        let { cancelAction } = this.methods;

        const { mode } = editing || {};

        switch(type){
            case "add":
                if(modeEdit && activeMode !== -1 && mode === "batch"){
                    form.validateFields((err, values) => {
                        Object.keys(values).map(item => {
                            const { editorType, editorOptions } = columns.find(x => x.dataField === item) || {};
                            const { value } = editorOptions ? (editorOptions.format || {}) : {}
                            if(editorType) 
                                if(editorType === "date" && values[item]) values[item] = moment(values[item]).format(value);
                            return typeof values[item] === "undefined" ? values[item] = null : null;
                        });
    
                        console.log("values",values)
                        if(!err){
                            if(isNew) {
                                if(onRowInserting) onRowInserting({ data: values, index: activeMode, options: this, cancelAction })
                            }
                            else {
                                if(onRowUpdating) onRowUpdating({ data: values, oldData: mainDataSource[activeMode], index:activeMode, options: this, cancelAction })
                            }
    
                            setTimeout(() => {
                                let temp = jsonCopy(tempMainDataSource);
                                if(tempMainDataSource.length === 0){
                                    temp = jsonCopy(mainDataSource);
                                }

                                const oldData = jsonCopy(mainDataSource[activeMode]);
                                mainDataSource[activeMode] = values;
                                this.setState(prev => ({
                                    modeEdit: null,
                                    activeMode: -1,
                                    mainDataSource,
                                    isNew: false,
                                    tempMainDataSource: temp,
                                    isUpdate: !prev.isUpdate ? JSON.stringify(oldData) !== JSON.stringify(values) : true
                                }));
    
                                if(this.state.isCancel) {
                                    cancelAction(false);
                                    return false;
                                }
    
                                if(isNew) {
                                    if(onRowInserted) onRowInserted({ data: values, index: activeMode, options: this })
                                }
                                else {
                                    if(onRowUpdated) onRowUpdated({ data: values, index: activeMode, options: this })
                                }
                            }, 0)
                        
                            setTimeout(() => {
                                if(onInitNewRow) onInitNewRow({ options: this, cancelAction })

                                setTimeout(() => {
                                    if(this.state.isCancel || isNew) {
                                        cancelAction(false);
                                        return false;
                                    }
                    
                                    let col = {};
                                    columns.filter(x => x.dataField && typeof x.allowEdit === "undefined" ? true : x.allowEdit).forEach(item => {
                                        if(item.dataField === keyData) col[[item.dataField]] = " ";
                                        else col[[item.dataField]] = null;
                                    })
                                    mainDataSource.unshift(col)
                                    this.setState({
                                        modeEdit: "add",
                                        activeMode: 0,
                                        mainDataSource,
                                        isNew: true
                                    });
                                })
                            })
                        }
                    });
                }
                else{
                    if(modeEdit){
                        return false;
                    }

                    this.setState({
                        modeEdit: null,
                        activeMode: -1
                    });

                    if(onInitNewRow) await onInitNewRow({ options: this, cancelAction })

                    setTimeout(() => {
                        if(this.state.isCancel || isNew) {
                            cancelAction(false);
                            return false;
                        }
        
                        let col = {};
                        columns.filter(x => x.dataField && typeof x.allowEdit === "undefined" ? true : x.allowEdit).forEach(item => {
                            if(item.dataField === keyData) col[[item.dataField]] = " ";
                            else col[[item.dataField]] = null;
                        });

                        let temp = jsonCopy(tempMainDataSource);
                        if(tempMainDataSource.length === 0){
                            temp = jsonCopy(mainDataSource);
                        }

                        mainDataSource.unshift(col)
                        this.setState({
                            modeEdit: "add",
                            activeMode: 0,
                            mainDataSource,
                            isNew: true,
                            isUpdate: true,
                            tempMainDataSource: temp
                        });
                    }, 0)
                }

                break;
            case "edit":
                if(modeEdit && activeMode !== -1 && mode === "batch"){
                    form.validateFields((err, values) => {
                        Object.keys(values).map(item => {
                            const { editorType, editorOptions } = columns.find(x => x.dataField === item) || {};
                            const { value } = editorOptions ? (editorOptions.format || {}) : {}
                            if(editorType) 
                                if(editorType === "date" && values[item]) values[item] = moment(values[item]).format(value);
                            return typeof values[item] === "undefined" ? values[item] = null : null;
                        });
    
                        console.log("values",values)
                        if(!err){
                            if(isNew) {
                                if(onRowInserting) onRowInserting({ data: values, index: activeMode, options: this, cancelAction })
                            }
                            else {
                                if(onRowUpdating) onRowUpdating({ data: values, oldData: mainDataSource[activeMode], index:activeMode, options: this, cancelAction })
                            }
    
                            setTimeout(() => {
                                const oldData = jsonCopy(mainDataSource[activeMode]);
                                mainDataSource[activeMode] = values;
                                this.setState(prev => ({
                                    modeEdit: null,
                                    activeMode: -1,
                                    mainDataSource,
                                    isNew: false,
                                    isUpdate: !prev.isUpdate ? JSON.stringify(oldData) !== JSON.stringify(values) : true
                                }));
    
                                if(this.state.isCancel) {
                                    cancelAction(false);
                                    return false;
                                }
    
                                if(isNew) {
                                    if(onRowInserted) onRowInserted({ data: values, index: activeMode, options: this })
                                }
                                else {
                                    if(onRowUpdated) onRowUpdated({ data: values, index: activeMode, options: this })
                                }
                            }, 0)

                            setTimeout(() => {
                                if(onEditingStart) onEditingStart({ data: row, index, options: this, cancelAction })

                                setTimeout(() => {
                                    if(this.state.isCancel) {
                                        cancelAction(false);
                                        return false;
                                    }

                                    this.setState({
                                        modeEdit: "edit",
                                        activeMode: index,
                                        isNew: false
                                    });
                                }, 0)
                            })
                        }
                    });
                }
                else{
                    this.setState({
                        modeEdit: null,
                        activeMode: -1
                    });

                    if(onEditingStart) onEditingStart({ data: row, index, options: this, cancelAction })

                    setTimeout(() => {
                        if(this.state.isCancel) {
                            cancelAction(false);
                            return false;
                        }

                        this.setState({
                            modeEdit: "edit",
                            activeMode: index,
                            isNew: false
                        });
                    }, 0)
                }
                break;
            case "cancel":
                if(isNew) mainDataSource.splice(0, 1);
                this.setState({
                    modeEdit: null,
                    activeMode: -1,
                    isNew: false,
                    mainDataSource
                });
                break;
            case "save":
                form.validateFields((err, values) => {
                    Object.keys(values).map(item => {
                        const { editorType, editorOptions } = columns.find(x => x.dataField === item) || {};
                        const { value } = editorOptions ? (editorOptions.format || {}) : {}
                        if(editorType) 
                            if(editorType === "date" && values[item]) values[item] = moment(values[item]).format(value);
                        return typeof values[item] === "undefined" ? values[item] = null : null;
                    });

                    console.log("values",values)
                    if(!err){
                        if(isNew) {
                            if(onRowInserting) onRowInserting({ data: values, index, options: this, cancelAction })
                        }
                        else {
                            if(onRowUpdating) onRowUpdating({ data: values, oldData: mainDataSource[index], index, options: this, cancelAction })
                        }

                        setTimeout(() => {
                            let temp = jsonCopy(tempMainDataSource);
                            if(tempMainDataSource.length === 0){
                                temp = jsonCopy(mainDataSource);
                            }

                            mainDataSource[index] = values;
                            this.setState({
                                modeEdit: null,
                                activeMode: -1,
                                mainDataSource,
                                isNew: false,
                                isUpdate: true,
                                tempMainDataSource: temp
                            });

                            if(this.state.isCancel) {
                                cancelAction(false);
                                return false;
                            }

                            if(isNew) {
                                if(onRowInserted) onRowInserted({ data: values, index, options: this })
                            }
                            else {
                                if(onRowUpdated) onRowUpdated({ data: values, index, options: this })
                            }
                        }, 0)
                    }
                });
                break;
            case "relaod":
                this.setState({
                    mainDataSource: tempMainDataSource,
                    modeEdit: null,
                    activeMode: -1,
                    isUpdate: false,
                    isNew: false,
                })
                break;
            case "save-all":
                form.validateFields((err, values) => {
                    debugger
                    index = index === -1 ? 0 : index;
                    Object.keys(values).map(item => {
                        const { editorType, editorOptions } = columns.find(x => x.dataField === item) || {};
                        const { value } = editorOptions ? (editorOptions.format || {}) : {}
                        if(editorType) 
                            if(editorType === "date" && values[item]) values[item] = moment(values[item]).format(value);
                        return typeof values[item] === "undefined" ? values[item] = null : null;
                    });

                    console.log("values",values)
                    if(!err){
                        if(isNew) {
                            if(onRowInserting) onRowInserting({ data: values, index, options: this, cancelAction })
                        }
                        else {
                            if(onRowUpdating) onRowUpdating({ data: values, oldData: mainDataSource[index], index, options: this, cancelAction })
                        }

                        setTimeout(() => {
                            if(Object.keys(values).length) mainDataSource[index] = values;
                            this.setState({
                                modeEdit: null,
                                activeMode: -1,
                                mainDataSource,
                                isNew: false,
                                isUpdate: false,
                                tempMainDataSource: [],
                            });

                            if(this.state.isCancel) {
                                cancelAction(false);
                                return false;
                            }

                            if(isNew) {
                                if(onRowInserted) onRowInserted({ data: values, index, options: this })
                            }
                            else {
                                if(onRowUpdated) onRowUpdated({ data: values, index, options: this })
                            }
                        })
                    }
                })
                break;
            case "delete":
                if(onRowRemoving) onRowRemoving({ data: row, index, options: this, cancelAction })

                setTimeout(() => {
                    if(this.state.isCancel) {
                        cancelAction(false);
                        return false;
                    }
    
                    confirm({
                        title: 'Do you Want to delete these items?',
                        onOk: () => {
                            let temp = jsonCopy(tempMainDataSource);
                            if(tempMainDataSource.length === 0){
                                temp = jsonCopy(mainDataSource);
                            }
                            mainDataSource.splice(index, 1);
                            this.setState({
                                modeEdit: null,
                                activeMode: -1,
                                mainDataSource,
                                tempMainDataSource: temp,
                                isUpdate: true
                            });
                            if(onRowRemoved) onRowRemoved({ type, value, row, index: 0, options: this })
                        }
                    });
                }, 0)
                break;
            default:
                break;
        }
    }

    mappingColumn = (columns) => {
        const { editing } = this.props;
        const { allowEditing, allowDeleting, mode } = editing || {};
        const { actionGrid } = this;

        if(allowEditing || allowDeleting){
            const actionIndex = columns.findIndex(x => x.dataField === "action");
            if((!allowDeleting && mode === "batch") || (!allowDeleting && !allowEditing)){

            }
            else if(actionIndex === -1)
                columns.push({
                    caption: "Action",
                    dataField: "action",
                    width: 120,
                    aligned: "center",
                    showInColumnChooser: false,
                    allowExporting: false,
                    allowResizing: false,
                    cellTemplate: (value, row, index) => {
                        const { activeMode } = this.state;
                        const { actionGrid } = this.methods;
            // if(onRowPrepared) onRowPrepared();

                        return <div>
                                <BaseForm 
                                    key={index}
                                    isGrouping={true}
                                    form={this.props.form}
                                    items={[{
                                        className: "m-0 p-0",
                                        editorType: "buttongroup",
                                        editorOptions:{
                                            items:[{
                                                type: "link",
                                                className:"p-0 m-0 mr-2",
                                                text: "Edit",
                                                size: "small",
                                                visible: index !== activeMode && allowEditing && (typeof mode === "undefined" ? true : (mode === "row")),
                                                onClick: e => actionGrid("edit", value, row, index)
                                            }, {
                                                type: "link",
                                                className:"p-0 m-0",
                                                text: "Delete",
                                                size: "small",
                                                visible: (index !== activeMode || mode === "batch") && allowDeleting,
                                                onClick: e => actionGrid("delete", value, row, index)
                                            }, {
                                                type: "link",
                                                className:"p-0 m-0 mr-2",
                                                text: "Save",
                                                size: "small",
                                                visible: index === activeMode && (typeof mode === "undefined" ? true : (mode === "row")),
                                                onClick: e => actionGrid("save", value, row, index)
                                            }, {
                                                type: "link",
                                                className:"p-0 m-0",
                                                text: "Cancel",
                                                size: "small",
                                                visible: index === activeMode && (typeof mode === "undefined" ? true : (mode === "row")),
                                                onClick: e => actionGrid("cancel", value, row, index)
                                            }]
                                        }
                                    }]} />
                            </div>
                    }
                })
        }

        return columns
            .filter(x => (typeof x.visible === "undefined" ? true : x.visible))
            .map(x => {
                switch(x.dataType){
                    case "number":
                        x.cellTemplate = (value, row, index) => {
                            return formatCurrency(value)
                        }
                        break;
                    case "date":
                        x.cellTemplate = (value, row, index) => {
                            return moment(value).format(x.format || "DD MMM YYYY HH:mm")
                        }
                        break;
                    default:
                }
                const isWrap = typeof x.allowWrappingText === "undefined" ? true : x.allowWrappingText;

                return {
                    ...x,
                    dataIndex: x.dataField,
                    title: x.caption || x.dataField,
                    sorter: x.allowSorting || false,
                    key: x.dataField || uuidv1(),
                    align: x.aligned,
                    className: `${isWrap ? "truncate-text-table" : ""} ${typeof x.allowResizing === "undefined" ? "" : (!x.allowResizing ? "disabled-resizing" : "")}` ,
                    ...(x.allowFiltering
                    ? {
                        filters: x.filterValues || [{ text: "", value: "" }],
                        ...(!x.filterValues ? { 
                            onFilterDropdownVisibleChange: visible => {
                                const { columnsMap } = this.state;
                                const { handleGetFilter } = this.methods;

                                if (visible) {
                                    handleGetFilter(x.dataField);
                                } 
                                else {
                                    const findIndex = columnsMap.findIndex(i => i.dataIndex === x.dataField);
                                    if (findIndex !== -1) {
                                        columnsMap[findIndex].filterDropdown = ({
                                            setSelectedKeys,
                                            selectedKeys,
                                            confirm,
                                            clearFilters
                                        }) => (
                                            <div className="p-2 text-center">
                                                <Spin />
                                            </div>
                                        );
                                        columnsMap[findIndex].filters = [ { text: "", value: "" } ];
                                    }
                                }
                            },
                            filterDropdown: ({
                                setSelectedKeys,
                                selectedKeys,
                                confirm,
                                clearFilters
                            }) => (
                                <div className="p-2 text-center">
                                    <Spin />
                                </div>
                            ),
                        } : null)
                    }
                    : null),
                    render: (value, row, index) => {
                        const { activeMode, rowItemEditable } = this.state;
                        if(!rowItemEditable[index]) rowItemEditable[index] = [];

                        const findIndex = rowItemEditable[index].findIndex(i => i.dataField === x.dataField);
                        if(findIndex === -1 && x.dataField !== "action")
                            rowItemEditable[index].push({
                                editorType: x.dataType,
                                ...x
                            })

                        return x.dataField !== "action" && activeMode === index && (typeof x.allowEdit === "undefined" ? true : x.allowEdit)
                            ? 
                            <BaseForm 
                                key={x.dataField+index}
                                // isGrouping={true}
                                formData={row}
                                form={this.props.form}
                                items={rowItemEditable[index].map(item => {
                                    const isDefault = item.dataField === x.dataField;
                                    const type = ["input", "number", "hidden", "mask", "button", "textarea", "upload", "search"]
                                    return {
                                        ...item,
                                        editorOptions:{
                                            ...item.editorOptions,
                                            onPressEnter: () => {
                                                actionGrid("save", value, row, index)
                                            },
                                            ...item.editorType ? (type.indexOf(item.editorType) === -1 ? {
                                                onInputKeyDown: (val, e) => {
                                                    if(val.nativeEvent.keyCode === 13){
                                                        setTimeout(() => {
                                                            actionGrid("save", value, row, index)
                                                        })
                                                    }
                                                }
                                            } : null)
                                            : null
                                        },
                                        className: `m-0 p-0 ${isDefault ? "" : "d-none"}`
                                    }
                                })}/>
                            : (x.cellTemplate 
                                ? <span title={value || null}>{x.cellTemplate(value, row, index)}</span> 
                                : <div className="container-fluid p-0 m-0" onClick={e => {
                                    if(allowEditing && mode === "batch") actionGrid("edit", value, row, index)
                                }}>
                                    <span title={value || null}>{value}</span>
                                </div>)
                    },
                };
            })
    }

    componentDidMount(){
        const { refresh } = this.methods;
        refresh();
    }

    render() {
        const { keyTable, isUpdate, componentExport, columnChooserDataSource, columnChooserTargetKeys, mainDataSource, loading, columnsMap, componentError, selectedRowKeys, page, limit, totalRecord, keyPagination } = this.state;
        const { keyData, allowSearching, paging, allowColumnChooser, exports, editing } = this.props;
        const { inputSearch, pagination, btnColumnChooser, btnExports } = this.style;
        const { rowSelection, handleTableChange, onSearch, onChangeSearch, handlePageChange, onShowSizeChange, columnChooserChange, handleExport, actionGrid } = this.methods;

        const { visible, pageSize } = paging || {};
        const { enabled } = exports || {};
        const { allowAdding, mode } = editing || {};
        
        return (<div>
            <Row>
                <Col span={6}></Col>
                <Col span={18}>
                    {allowSearching ? 
                        <Input.Search
                            className="textbox-search"
                            style={inputSearch}
                            placeholder="Search..."
                            onSearch={onSearch}
                            onChange={onChangeSearch}
                        />
                    : null}
                    {allowColumnChooser ?
                        <Popover content={<div slot="content">
                            <Transfer
                                dataSource={columnChooserDataSource}
                                titles={['Showing', 'Hiding']}
                                render={ item => item.title}
                                targetKeys={columnChooserTargetKeys}
                                showSearch
                                onChange={columnChooserChange}
                                // filterOption={columnChooserFilterOption}
                            />
                        </div>} title="Column Chooser" trigger="click">
                            <Button
                                className="btn-chooser btn-default"
                                style={btnColumnChooser}
                                title="Column Chooser"
                            >
                                <Icon type="solution"/>
                            </Button>
                        </Popover>
                    : null}
                    {enabled ?    
                        <Dropdown 
                            overlay={<Menu onClick={handleExport}>
                                <Menu.Item key="1">
                                    <span className="mdi mdi-18px mdi-file-excel-box"></span>Export all data
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <span className="mdi mdi-18px mdi-file-excel"></span>Export selected rows
                                </Menu.Item>
                            </Menu>} 
                        >
                            <Button
                                className="btn-chooser btn-default mr-1"
                                style={btnExports}
                            >
                                <span className="mdi mdi-18px mdi-file-export"></span>
                            </Button>
                        </Dropdown>
                    : null}
                    {mode === "batch" ?
                        <div>
                            <Button
                                icon="reload"
                                className="mr-1"
                                style={btnColumnChooser}
                                title="Reload"
                                disabled={!isUpdate}
                                onClick={e => actionGrid("relaod", {}, {}, -1)}
                            >
                            </Button>
                            <Button
                                icon="save"
                                className="mr-1"
                                style={btnColumnChooser}
                                title="Save"
                                disabled={!isUpdate}
                                onClick={e => actionGrid("save-all", {}, {}, -1)}
                            >
                            </Button>
                        </div>
                    :null}
                    {allowAdding ?
                        <Button
                            icon="plus"
                            className="mr-1"
                            style={btnColumnChooser}
                            title="Add New"
                            onClick={e => actionGrid("add", {}, {}, 0)}
                        >
                        </Button>
                    :null}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {componentError}
                    <Table
                        key={keyTable}
                        rowKey={keyData}
                        ref="table"
                        rowSelection={rowSelection()}
                        selectedRowKeys={selectedRowKeys}
                        loading={loading}
                        size="small"
                        dataSource={mainDataSource}
                        pagination={false}
                        columns={columnsMap}
                        className="asyst-table mb-2"
                        bordered
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    { 
                        visible || (pageSize && visible)
                        ? <Pagination
                            key={keyPagination}
                            size="small"
                            showTotal={total => `Page ${page} of ${Math.ceil(totalRecord / limit)} (${total} items)`}
                            style={pagination}
                            showSizeChanger
                            defaultCurrent={page}
                            pageSize={limit}
                            total={totalRecord}
                            pageSizeOptions={['10', '25', '100']}
                            onChange={handlePageChange}
                            onShowSizeChange={onShowSizeChange}
                        />
                        : null
                    }
                </Col>
            </Row>
            {componentExport}
        </div>);
    }
}

export default Form.create()(Index);