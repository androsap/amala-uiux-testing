import React from 'react';
import List from './List';
import View from './View';
import Cancel from './cancel/Index';
import Update from './update/Index';
import ErrorGeneral from '../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

import { connect } from "react-redux";
import { loadDataMemberHeader } from "../../../utilities/actions/MemberActions";

var permissionList = _getUserPermission();
var menuname = 'membercobrand';

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberid: props.memberid,
            cardnumber: props.cardnumber,
            certificateid: null,
            awardcategory: null,
            typepage: null,
            displayactivitypage: 'INDEX',
            cobrandid: null,
            statuscobrand: null,
            // targetSection: ''
        }
    }

    getStore() {
        return this.state;
    }

    updatePage(value) {
        this.setState(value);
    }

    componentDidMount() {
        this.setState({
            memberid: this.props.memberid,
            cardnumber: this.props.cardnumber,
            certificateid:this.props.certificateid,
            awardcategory: this.props.awardcategory
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            memberid: props.memberid,
            cardnumber: props.cardnumber,
            certificateid: props.certificateid,
            awardcategory: props.awardcategory
        });
    }

    render() {
        const { memberid, displayactivitypage, certificateid, awardcategory, cardnumber } = this.state;

        if (!_checkPermission(permissionList, menuname, 'access')) {
            return (
                (displayactivitypage === 'INDEX') ? <List updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} memberid={memberid} /> :
                    (displayactivitypage === 'VIEW') ? <View updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} certificateid={certificateid} /> :
                        (displayactivitypage === 'CANCEL') ? <Cancel {...this.props} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} certificateid={certificateid} awardcategory={awardcategory} cardnumber={cardnumber} /> :
                            (displayactivitypage === 'UPDATE') ? <Update {...this.props} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} certificateid={certificateid} awardcategory={awardcategory} cardnumber={cardnumber} /> : null
            );
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    loadDataMemberHeader: (id, type) => dispatch(loadDataMemberHeader(id, type))
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);