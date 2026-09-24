import React from 'react';
import ReactModal from 'react-responsive-modal';
import Alert from '../../../components/Alert';
import RequestService from '../../../utilities/RequestService';
import Services from '../../../config/Services';
// import CreateStatementText from './Create';
// import UpdateStatementText from './Update';
import StatementTextForm from './Form';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var getServices = new Services();
var request = new RequestService();
var permissionList = _getUserPermission();
var menuname = 'statementtext';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    //handle open modal
    handleOpenModal = (code) => {
        this.setState({ showModal: true, statementtextid: code });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
        this.props.closeModalRefresh();
    }

    deleteData(statementtextid) {
        let url = getServices.state.url.statementtext.delete;
        let parameter = { statementtextid };
        var deleteData = request.deleteData(url, parameter);
        if (deleteData) {
            deleteData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let message = 'Selected data has been deleted';
                    if (response.status.responsemessage) {
                        message = response.status.responsemessage;
                    }
                    Alert.success(message);
                } else {
                    Alert.error(response.status.responsemessage);
                }
                this.props.closeModalRefresh();
            })
        }
    }

    render() {
        const { showModal } = this.state;
        var dataList = this.props.dataList;
        var body = '';
        if (dataList.length) {
            var editLabel = !_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View";
            var editIcon = !_checkPermission(permissionList, menuname, 'update') ? "mdi-lead-pencil" : "mdi-file";
            var statusDelete = _checkPermission(permissionList, menuname, 'delete');

            body = <div>
                {dataList.map((val, i) =>
                    <div className="main-panel mb-3" key={i}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Statement Text</label>
                                    <div className="col-sm-9">{val.statementtext}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Correction Text</label>
                                    <div className="col-sm-9">{val.correctiontext}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Channel</label>
                                    <div className="col-sm-9">{val.channel}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Language</label>
                                    <div className="col-sm-9">{val.langcode}</div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Is Default</label>
                                    <div className="col-sm-9">{val.isdefault ? 'Yes' : 'No'}</div>
                                </div>
                                <div className="box-footer text-right">
                                    <button onClick={() => this.handleOpenModal(val.statementtextid)} className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</button>
                                    &nbsp;&nbsp;
                                    <button onClick={() => this.deleteData(val.statementtextid)} className={"btn btn-outline-dark btn-sm " + statusDelete}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>;
        } else {
            body = <label className="col-sm-12 col-form-label text-center">No data to display</label>;
        }

        return (
            <div>
                <div className="content-title flex-hr mb-3">
                    <h4 className="title-has-control mt-2">&nbsp;</h4>
                    <button onClick={() => this.handleOpenModal('')} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>Add New</button>
                </div>
                {body}
                <ReactModal open={showModal} onClose={this.handleCloseModal} center>
                    <div className="modal-lg">
                        {/* {this.state.statementtextid ?
                            <UpdateStatementText statementid={this.props.statementid} statementtextid={this.state.statementtextid} closeModalRefresh={this.handleCloseModalRefresh} />
                            :
                            <CreateStatementText statementid={this.props.statementid} closeModalRefresh={this.handleCloseModalRefresh} />
                        } */}
                        <StatementTextForm statementid={this.props.statementid} statementtextid={this.state.statementtextid} closeModalRefresh={this.handleCloseModalRefresh} />
                    </div>
                </ReactModal>
            </div>
        )
    }
}

export default Layout;