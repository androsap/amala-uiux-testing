import React from 'react';
import SLAList from './List';
import SLAForm from './Form';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'index',
            slaid: null
        }
    }

    changePage(value) {
        this.setState(value);
    }

    render() {
        const { page, slaid } = this.state;
        return (
            <div>
                {
                    (page === 'index') ? <SLAList {...this.props} changePage={(e) => this.changePage(e)} vendorcode={this.props.vendorcode} /> :
                        (page === 'form') ? <SLAForm {...this.props} changePage={(e) => this.changePage(e)} vendorcode={this.props.vendorcode} slaid={slaid} /> : ''
                }
            </div>
        )
    }
}

export default Layout;