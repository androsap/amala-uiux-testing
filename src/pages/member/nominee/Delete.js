import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Form } from 'antd';
import DeleteNomineeStepsSteps from '../../../components/Steps/DeleteNomineeSteps';

import Confirmation from './confirmation/Index';
import Deletion from './deletion/Index';
import Validation from './validation/Index';
import Complete from './complete/Index';

const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: props.type === "force" ? "deletion-charges" : "validation",
            current: props.type === "force" ? 1 : 0,
            profile: 0,
            membership: 0,
            oricardnumber: null,
            descardnumber: null,
            memberOri: [],
            memberDes: [],
            isLoading: false,
            selectedOption: "MILES",
            selectedCurrency: "IDR",
            changefee: 0,
            membersince: this.props.membersince,
            paymentreference: ""
        }
    }

    componentDidMount() {
        document.title = 'Member Management | Loyalty Management System';
    }

    handleMenuCallback = (menu) => {
        this.setState(prev => ({
            menu: menu.choosen || prev.menu,
            current: menu.current !== undefined ? menu.current : prev.current,
            selectedOption: menu.selectedOption || prev.selectedOption,
            selectedCurrency: menu.selectedCurrency || prev.selectedCurrency,
            changefee: menu.changefee !== undefined ? menu.changefee : prev.changefee,
            paymentreference: menu.paymentreference || prev.paymentreference
        }));
    }

    getRetrieveOri = (oricardnumber, memberOri) => {
        this.setState({ isLoading: true, oricardnumber, memberOri })
    }

    getRetrieveDes = (descardnumber, memberDes) => {
        this.setState({ descardnumber, memberDes, isLoading: false })
    }

    render() {
        const { menu, current, profile, membership, selectedOption, changefee, selectedCurrency, membersince } = this.state;

        return (
            <Content style={{ minHeight: 500, background: '#fff' }}>
                <Layout style={{ background: '#fff' }}>
                    <DeleteNomineeStepsSteps {...this.props} handleMenu={this.handleMenuCallback} current={current} profile={profile} membership={membership}></DeleteNomineeStepsSteps>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {
                            (menu === 'validation') ? <Validation {...this.props} handleMenuCallback={this.handleMenuCallback} /> :
                                (menu === 'deletion-charges') ? <Deletion {...this.props} handleMenuCallback={this.handleMenuCallback} onCancel={this.props.handleCancel} /> :
                                    (menu === 'confirmation') ? <Confirmation {...this.props} selectedOption={selectedOption} selectedCurrency={selectedCurrency} changefee={changefee} membersince={membersince} handleMenuCallback={this.handleMenuCallback} /> :
                                        (menu === 'complete') ? <Complete {...this.props} selectedOption={selectedOption} selectedCurrency={selectedCurrency} changefee={changefee} membersince={membersince} handleMenuCallback={this.handleMenuCallback} onCancel={this.props.handleCancel} onOk={this.props.handleOk} paymentreference={this.state.paymentreference}/>
                                            : null
                        }
                    </Content>
                </Layout>
            </Content>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));