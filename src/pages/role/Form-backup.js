import React, { Component } from 'react';
import { Link } from 'react-router-dom'
// import RequestService from '../../utilities/RequestService';
import Alert from '../../components/Alert';
// import Services from '../../config/Services';
import Loader from '../../components/Loader';
import ErrorGeneral from '../error/ErrorGeneral';
import Breadcrumb from '../../components/Breadcrumb';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';

// var getServices = new Services();
// var request = new RequestService();
var request = '';
var permissionList = _getUserPermission();
var menuname = 'role';

/*
NOTE ROLE:
[action save] save ROLE & save SETPERMIT beda action/button -DONE
[setpermit] susun parameter ketika save SETPERMIT -ONPROGRESS
[create & delete & update ROLE] confirm service update
*/

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Role',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            generalfielddisabled: false,
            menu: {},
            permissionDetail: [],
            status: null
        };
    }

    handleValidation(field) {
        let errors = {};
        let status = true;

        //name
        if (!field['name']) {
            errors['name'] = 'Required';
        } else if (!field['name'].match(/^[a-zA-Z\s]+$/)) {
            errors['name'] = 'Only letters and space';
        } else if (field['name'].length > 45) {
            errors['name'] = 'Maximum 45 characters';
        }

        //description
        if (field['description']) {
            if (!field['description'].match(/^[0-9a-zA-Z\s]+$/)) {
                errors['description'] = 'Only alphanumeric and space';
            } else if (field['description'].length > 255) {
                errors['description'] = 'Maximum 255 characters';
            }
        }

        //status
        if(field['satus']) {
            errors['status'] = 'Required';
        }

        if (Object.getOwnPropertyNames(errors).length > 0) {
            status = false;
        }

        this.setState({ errors: errors });
        return status;
    }

    checkPermission() {
        let id = Number.parseInt(this.props.match.params.ID, 0);
        if (id) {
            let titlepage = 'Edit Role';
            let actionspage = 'update';
            let generalfielddisabled = false;
            //role can't update action
            if (_checkPermission(permissionList, menuname, actionspage)) {
                titlepage = 'View Role';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ titlepage, actionspage, generalfielddisabled });
            // this.getDetail(id);
        } else {
            if (_checkPermission(permissionList, menuname, "create")) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.getMenu();
            }
        }
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            this.checkPermission();
        } else {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    getDetail(rolecode) {
        // let url = getServices.state.url.role.detail;
        let url = '';
        request.getDataDetail(url, { rolecode }).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0' && response.result) {
                let data = response.result;
                this.refs.name.value = data.rolename;
                this.refs.description.value = (typeof data.roledescription === "undefined") ? "" : data.roledescription;
                var permissionDetail = [];
                for (const field in data.rolepermission) {
                    for (const field2 in data.rolepermission[field].function) {
                        permissionDetail[data.rolepermission[field].menucode + "_" + data.rolepermission[field].function[field2].functioncode] = Number.parseInt(data.rolepermission[field].function[field2].grant, 0);;
                    }
                }
                this.setState({ permissionDetail }, this.getMenu());
            } else {
                this.setState(
                    {
                        responseCode: response.status.responsecode,
                        responseMessage: response.status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const formData = {};
        const { actionspage } = this.state;
        for (const field in this.refs) {
            if (field.substring(0, 4) === "user") {
                formData[field] = this.refs[field].checked;
            } else {
                if (this.refs[field].value) {
                    formData[field] = this.refs[field].value.trim();
                }
            }
        }

        //remapping for parameter set role permission
        var formRoleData = [];
        for (const field in formData) {
            var grant = (formData[field]) ? 1 : 0;
            if (field.substring(0, 4) === "user") {
                var menucode = field.split("_")[1];
                var functioncode = field.split("_")[2];

                if (typeof formRoleData[menucode] === "undefined") {
                    formRoleData[menucode] = {}
                    formRoleData[menucode]["menucode"] = "";
                }
                if (typeof formRoleData[menucode]["functionlist"] === "undefined") {
                    formRoleData[menucode]["functionlist"] = []
                }
                if (typeof formRoleData[menucode]["functionlist"][functioncode] === "undefined") {
                    formRoleData[menucode]["functionlist"][functioncode] = {}
                }

                formRoleData[menucode]["menucode"] = Number.parseInt(menucode, 0);
                formRoleData[menucode]["functionlist"][functioncode] = {
                    "functioncode": Number.parseInt(functioncode, 0),
                    "grant": grant
                }
            }
        }

        //remapping key array parameter setpermission
        var key = 0;
        var roleInput = [];
        for (const field_1 in formRoleData) {
            var key_2 = 0;
            roleInput[key] = {};
            roleInput[key]["functionlist"] = [];
            roleInput[key]["menucode"] = formRoleData[field_1].menucode;
            for (const field_2 in formRoleData[field_1].functionlist) {
                roleInput[key]["functionlist"][key_2] = formRoleData[field_1].functionlist[field_2];
                key_2++;
            }
            key++;
        }

        if (this.handleValidation(formData)) {
            //call loader
            this.setState({ loading: true });
            //define parameter
            let rolename = formData.name;
            let roledescription = formData.description;

            let parameter = {};
            let message = '';
            let url = '';
            if (actionspage === 'create') {
                message = 'New data has been created';
                // url = getServices.state.url.role.create;
                url = '';
                parameter = { rolename, roledescription };
            } else {
                message = 'Data has been updated';
                // url = getServices.state.url.role.update;
                url = '';
                let rolecode = Number.parseInt(this.props.match.params.ID, 0);
                parameter = { rolecode, rolename, roledescription };
            }

            var requestData = request.saveData(url, parameter);
            if (requestData) {
                requestData.then((response) => {
                    if (response.status.responsecode.substring(0, 1) === '0') {
                        let parameterSetPermission = {
                            "rolecode": response.result.rolecode,
                            "rolepermission": roleInput
                        };
                        // let urlSetPermission = getServices.state.url.role.set;
                        let urlSetPermission = '';
                        var setPermission = request.saveData(urlSetPermission, parameterSetPermission);
                        setPermission.then((responseSetPermission) => {
                            const { responsecode, responsemessage } = responseSetPermission.status;
                            if (responsecode.substring(0, 1) === '0') {
                                message = (responsemessage) ? responsemessage : message;
                                Alert.success(message);
                                this.props.history.push('/role/form/' + response.result.rolecode);
                                this.checkPermission();
                            } else {
                                Alert.error(responsemessage);
                                this.setState({ loading: false });
                            }
                        })
                        this.setState({ loading: false });
                    } else {
                        Alert.error(response.status.responsemessage);
                        this.setState({ loading: false });
                    }
                })
            }
        }
    };

    getMenu() {
        // let url = getServices.state.url.menu.getall;
        let url = '';
        request.getDataDetail(url, {}).then((response) => {
            this.setState({
                menu: response.result
            });
        })
    }

    sortMenu(datas) {
        var myData = {};
        if (datas.length > 0) {
            myData = [...datas];
            myData.sort((a, b) => a.menuname > b.menuname);
            myData.map((item, i) => {
                return item;
            }
            );
        }
        return myData;
    }

    render() {
        const { titlepage, actionspage, formrender, errors, loading, generalfielddisabled } = this.state;
        const { menu, permissionDetail } = this.state;
        const sortedMenu = this.sortMenu(menu);
        if (sortedMenu.length) {
            var listMenu =
                sortedMenu.map((val_1, key_1) =>
                    <div className="col-md-3 mb-3" key={key_1}>
                        <h4>{val_1.menuname}</h4>
                        {
                            val_1.function.map((val_2, key_2) =>
                                <label className="custom-control border-switch" key={key_2}>
                                    <input ref={"user_" + val_1.menucode + "_" + val_2.functioncode} value="1" className="border-switch-control-input" type="checkbox" defaultChecked={(permissionDetail[val_1.menucode + "_" + val_2.functioncode]) ? "checked" : ""} disabled={generalfielddisabled} />
                                    <span className="border-switch-control-indicator"></span>
                                    <span className="border-switch-control-description">{val_2.functionname}</span>
                                </label>
                            )
                        }
                    </div>
                );
        }

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " | Loyalty Management System";
            //render form
            return (
                <div className="container-fluid">
                    <Breadcrumb path="User Management / Role" />
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">{titlepage}</h1>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-sm-12">
                                <form className="clearfix position-relative" onSubmit={(e) => this.saveAction(e)} autoComplete="off">
                                    <Loader value={loading} />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="name-view">Role Name <span className="form-asterisk"><i className="mdi mdi-asterisk"></i> </span></label>
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" id="name-view" ref="name" maxLength="45" disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["name"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group row">
                                                <label className="col-sm-4 col-form-label" htmlFor="description-view">Description </label>
                                                <div className="col-sm-8">
                                                    <textarea rows="3" className="form-control" type="text" id="description-view" ref="description" maxLength="255" disabled={generalfielddisabled} />
                                                    <span className="text-danger">{errors["description"]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="mt-0" />
                                    <div className="row">
                                        {listMenu}
                                    </div>
                                    <div className="box-footer text-center">
                                        {
                                            (actionspage !== 'view') ? <button type="submit" className="btn btn-outline-dark normal">Save</button> : ""
                                        }
                                        &nbsp;&nbsp;
		                                <Link to="/role" ref="cancel" className="btn btn-outline-dark normal">Back</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;