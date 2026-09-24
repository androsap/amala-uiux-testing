import React, { Component } from 'react';
import { Steps, Popover } from 'antd';

const { Step } = Steps;

class MergingAccountSteps extends Component {

    onChange = (type, value) => {
        switch (type) {
            case 'current':
                switch (value) {
                    case 0:
                        this.props.handleMenu('validation', type, value);
                        break;
                    case 1:
                        this.props.handleMenu('deletion-charges', type, value);
                        break;
                    case 2:
                        this.props.handleMenu('confirmation', type, value);
                        break;
                    case 3:
                        this.props.handleMenu('completed', type, value);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <div>
                <Steps
                    current={this.props.current}
                    size="small"
                    style={{
                        padding: 20,
                        marginBottom:
                            (this.props.current !== 0 && this.props.current !== 1)
                                ? 10
                                : 0
                    }}
                >
                    <Step title="Validation" onClick={() => this.onChange('current', 0)} />
                    <Step title="Deletion Charges" onClick={() => this.onChange('current', 1)} />
                    <Step title="Confirmation" onClick={() => this.onChange('current', 2)} />
                    <Step title="Completed" onClick={() => this.onChange('current', 3)} />
                </Steps>
            </div>
        );
    }
}

export default MergingAccountSteps;