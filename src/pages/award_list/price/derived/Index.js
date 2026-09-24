import React, { Component } from 'react';

import List from './List';
import Form from './Form';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayformpage: 'index', 
            pricederivedcode: null
        };
    }

    getStore() {
        return this.state;
    }

    changePage(value) {
        this.setState(value);
    }

    render() {
        const { displayformpage, pricederivedcode } = this.state;
        return (
            <React.Fragment>
                {
                    (displayformpage === 'index') ?
                        <List {...this.props} changePage={(e) => this.changePage(e)} /> :
                        (displayformpage === 'form') ?
                            <Form {...this.props} changePage={(e) => this.changePage(e)} pricederivedcode={pricederivedcode}/> : null
                }
            </React.Fragment>
        )
    }
}

export default Layout;