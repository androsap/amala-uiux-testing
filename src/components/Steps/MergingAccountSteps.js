import React, { Component } from 'react';
import { Steps, Popover } from 'antd';

const { Step } = Steps;

class MergingAccountSteps extends Component {

    onChange = (type, value) => {
        switch (type) {
            case 'current':
                switch (value) {
                    case 0:
                        this.props.handleMenu('personal-information', type, value, 0);
                        break;
                    case 1:
                        this.props.handleMenu('member-tier', type, value, 3, 0);
                        break;
                    case 2:
                        this.props.handleMenu('activity', type, value, 3, 2);
                        break;
                    case 3:
                        this.props.handleMenu('retro-claim', type, value);
                        break;
                    case 4:
                        this.props.handleMenu('transaction', type, value);
                        break;
                    default:
                }
                break;
            case 'profile':
                switch (value) {
                    case 0:
                        this.props.handleMenu('personal-information', type, value);
                        break;
                    case 1:
                        this.props.handleMenu('address', type, value);
                        break;
                    case 2:
                        this.props.handleMenu('account', type, value);
                        break;
                    case 3:
                        this.props.handleMenu('alias', type, value);
                        break;
                    default:
                }
                break;
            case 'membership':
                switch (value) {
                    case 0:
                        this.props.handleMenu('member-tier', type, value);
                        break;
                    case 1:
                        this.props.handleMenu('member-card', type, value);
                        break;
                    case 2:
                        this.props.handleMenu('member-cobrand', type, value);
                        break;
                    default:
                }
                break;
            default:
        }
    };

    render() {

        const customDot = (dot, { status }) => (
            <Popover
                content={
                    <span>
                        Status: {status}
                    </span>
                }
            >
                {dot}
            </Popover>
        );

        return (
            <div>
                <Steps current={this.props.current} size='small' onChange={value => this.onChange('current', value)} style={{ padding: 20, marginBottom: (this.props.current !== 0 && this.props.current !== 1) ? 10 : 0 }}>
                    <Step title='Profile' />
                    <Step title='Membership' />
                    <Step title='Activity' />
                    <Step title='Retro Claim' />
                    <Step title='Transaction' />
                </Steps>
                {this.props.current === 0 ?
                    <Steps current={this.props.profile} size='small' progressDot={customDot} onChange={value => this.onChange('profile', value)} style={{ padding: 10 }}>
                        <Step title='Information' />
                        <Step title='Address' />
                        <Step title='Account' />
                        <Step title='Alias' />
                    </Steps> : this.props.current === 1 ? <Steps current={this.props.membership} size='small' progressDot={customDot} onChange={value => this.onChange('membership', value)} style={{ padding: 10 }}>
                        <Step title='Member Tier' />
                        <Step title='Member Card' />
                        <Step title='Member Cobrand' />
                    </Steps> : ''
                }
            </div>
        );
    }
}


export default MergingAccountSteps