import React from 'react';
import VoucherTextList from './List';
import VoucherTextForm from './Form';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'index',
            awardvouchercode: null
        }
    }

    changePage(value) {
        this.setState(value);
    }

    render() {
        const { page, awardvouchercode } = this.state;
        return (
            <div>
                {
                    (page === 'index') ? <VoucherTextList {...this.props} changePage={(e) => this.changePage(e)} awardcode={this.props.awardcode} /> :
                        (page === 'form') ? <VoucherTextForm {...this.props} changePage={(e) => this.changePage(e)} awardcode={this.props.awardcode} awardvouchercode={awardvouchercode} categorycode={this.props.categorycode} /> : ''
                }
            </div>
        )
    }
}

export default Layout;