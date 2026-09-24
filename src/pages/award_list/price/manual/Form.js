import React, { Component } from 'react';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'pricemanual';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            errors: {},
            titlepage: 'Create Price Manual',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            generalfielddisabled: false
        }
    }

    componentDidMount() {
        if (_checkPermission(permissionList, menuname, "access")) {
            this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        }
    }

    render() {
        const { formrender } = this.state;
        if (formrender) {
            //render form
            return (
                <div className="main-panel">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-2">Manage Price</h1>
                    </div>
                    <hr className="mt-0" />
                    <div className="col-sm-12">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h4 className="title-has-control mt-2">Manual Price</h4>
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