import React, { Component } from 'react';
import FormManualPrice from './manual/Form';
// import FormFixedAirPrice from './fixed_air/Form';
import FormFixedNonAirPrice from './fixed_nonair/Form';
import IndexDerivedPrice from './derived/Index';
import FormDerivedPrice from './derived/Form';
import ErrorGeneral from '../../error/ErrorGeneral';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';

var permissionList = _getUserPermission();
var menuname = 'awardprice';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            errors: {},
            titlepage: 'Award Price',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            specialfielddisabled: false,
            generalfielddisabled: false,
            pricingby: null,
            categorytype: null,
            optionsPricingBy: [
                { value: 'Manual', label: 'Manual' },
                { value: 'Fixed', label: 'Fixed' },
                { value: 'Derived', label: 'Derived' }
            ],
            awardcode: props.id,
            displayformpage: 'index',
            pricederivedcode: null,
            categorycode: null,
            targetSection: ''
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            pricingby: props.getStore().pricingby,
            categorytype: props.getStore().categorytype,
            targetSection: props.getStore().targetSection,
            categorycode: props.getStore().categorycode
        });
    }

    componentDidMount() {
        if (!_checkPermission(permissionList, menuname, "access")) {
            if (_checkPermission(permissionList, menuname, "create")) this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
        } else this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
    }

    getStore() {
        return this.state;
    }

    updatePage(value) {
        this.setState(value);
    }

    render() {
        const { formrender } = this.state;
        const { pricingby, displayformpage, pricederivedcode, categorycode, targetSection } = this.state;

        //categorytype === 1 for Air Awards
        //categorytype === 2 for Non Air Awards
        if (formrender) {
            //render form
            return (
                <div>
                    {(pricingby === 'MANUAL' && targetSection === 'price') ? <FormManualPrice awardcode={this.props.id} /> :
                        // (pricingby === 'FIXED' && categorytype === 1 && targetSection === 'price') ? <FormFixedAirPrice awardcode={this.props.id} /> :
                        (pricingby === 'FIXED' && targetSection === 'price') ? <FormFixedNonAirPrice awardcode={this.props.id} /> :
                            (pricingby === 'DERIVED' && displayformpage === 'index' && targetSection === 'price') ? <IndexDerivedPrice awardcode={this.props.id} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} /> :
                                (pricingby === 'DERIVED' && displayformpage === 'form' && targetSection === 'price') ? <FormDerivedPrice awardcode={this.props.id} pricederivedcode={pricederivedcode} categorycode={categorycode} updatePage={(u) => (this.updatePage(u))} getStore={() => (this.getStore())} /> : ''}
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

export default Layout;