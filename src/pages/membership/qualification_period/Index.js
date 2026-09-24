import React from 'react';
import PeriodList from './List';
import PeriodForm from './Form';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'index',
            qualificationid: null
        }
    }

    changePage(value) {
        this.setState(value);
    }

    render() {
        const { page, qualificationid } = this.state;
        return (
            <div>
                {
                    (page === 'index') ? <PeriodList {...this.props} changePage={(e) => this.changePage(e)} membershipid={this.props.membershipid} /> :
                        (page === 'form') ? <PeriodForm {...this.props} changePage={(e) => this.changePage(e)} membershipid={this.props.membershipid} qualificationid={qualificationid} /> : ''
                }
            </div>
        )
    }
}

export default Layout;