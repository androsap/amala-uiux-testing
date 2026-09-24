import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Form } from 'antd';
import MergingAccountSteps from '../../components/Steps/MergingAccountSteps';

import PersonalInformation from './profile/information/Index';
import Address from './profile/address/Index';
import Account from './profile/account/Index';
import Alias from './profile/alias/Index';

import Tier from './membership/tier/Index';
import Card from './membership/card/Index';
import Cobrand from './membership/cobrand/Index';

import Activity from './activity/Index';
import RetroClaim from './retro_claim/Index';
import Transaction from './transaction/Index';

const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 'personal-information',
            current: 0,
            profile: 0,
            membership: 0,
            oricardnumber: null,
            descardnumber: null,
            memberOri: [],
            memberDes: [],
            isLoading: false
        }
    }

    componentDidMount() {
        document.title = 'Member Management | Loyalty Management System';
    }

    handleMenuCallback = (menu, type, value, profile, membership) => {
        if (menu.choosen === undefined) {
            if (menu === 'personal-information') { this.setState({ profile }) };
            if (menu === 'member-tier') { this.setState({ profile, membership }) };
            if (menu === 'activity') { this.setState({ profile, membership }) };
            this.setState({ menu, [type]: value });
        } else {
            this.setState({
                menu: menu.choosen,
                current: menu.current === undefined ? 0 : menu.current,
                profile: menu.profile === undefined ? 0 : menu.profile,
                membership: menu.membership === undefined ? 0 : menu.membership
            });
        }
    }

    getRetrieveOri = (oricardnumber, memberOri) => {
        this.setState({ isLoading: true, oricardnumber, memberOri })
    }

    getRetrieveDes = (descardnumber, memberDes) => {
        this.setState({ descardnumber, memberDes, isLoading: false })
    }

    render() {
        const { menu, current, profile, membership, memberOri, memberDes } = this.state;
        const { memberOrigin, memberDestination } = this.props;

        return (
            <Content style={{ minHeight: 500, background: '#fff' }}>
                <Layout style={{ background: '#fff' }}>
                    <MergingAccountSteps {...this.props} handleMenu={this.handleMenuCallback} current={current} profile={profile} membership={membership}></MergingAccountSteps>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {
                            (menu === 'personal-information') ? <PersonalInformation {...this.props} memberOrigin={memberOrigin} memberDestination={memberDestination} getRetrieveOri={this.getRetrieveOri} getRetrieveDes={this.getRetrieveDes} handleMenuCallback={this.handleMenuCallback} /> :
                                (menu === 'address') ? <Address {...this.props} memberOrigin={memberOri.memberaddress} memberDestination={memberDes.memberaddress} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                    (menu === 'account') ? <Account {...this.props} memberOrigin={memberOri.memberaccount} memberDestination={memberDes.memberaccount} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                        (menu === 'alias') ? <Alias {...this.props} memberOrigin={memberOri.memberalias} memberDestination={memberDes.memberalias} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                            (menu === 'member-tier') ? <Tier {...this.props} memberOrigin={memberOri.membertiers} memberDestination={memberDes.membertiers} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                                (menu === 'member-card') ? <Card {...this.props} memberOrigin={memberOri.membercards} memberDestination={memberDes.membercards} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                                    (menu === 'member-cobrand') ? <Cobrand {...this.props} memberOrigin={memberOri.membercobrands} memberDestination={memberDes.membercobrands} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                                        (menu === 'activity') ? <Activity {...this.props} memberOrigin={memberOrigin} memberDestination={memberDestination} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                                            (menu === 'retro-claim') ? <RetroClaim {...this.props} memberOrigin={memberOrigin} memberDestination={memberDestination} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} /> :
                                                                <Transaction {...this.props} memberOrigin={memberOrigin} memberDestination={memberDestination} handleMenuCallback={this.handleMenuCallback} memberidOri={memberOrigin} memberidDes={memberDestination} />
                        }
                    </Content>
                </Layout>
            </Content>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));