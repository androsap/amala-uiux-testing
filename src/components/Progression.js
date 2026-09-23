import React from 'react';
import { DetailRequest } from '../utilities/RequestService';
import { Progress } from 'antd';

class Progression extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0
        }
    }

    componentDidMount() {
        if (this.props.request === undefined) {
            this.setState({ percent: this.props.percent });
        } else {
            this.retrieveData();
        }
    }

    retrieveData() {
        DetailRequest(this.props.request.url, this.props.request.data).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === "0000") {
                this.setState({ percent: result.percentage });
            } else {
                this.props.emptydata('No Data');
            }
        });
    }

    render() {
        return (<Progress
            {...this.props}
            type={this.props.type}
            strokeColor={{
                '0%': this.props.startcolor === undefined ? '#108ee9' : this.props.startcolor,
                '100%': this.props.endcolor === undefined ? '#108ee9' : this.props.endcolor,
            }}
            percent={this.state.percent}
        />)
    }

}

export default Progression;