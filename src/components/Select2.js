import React, { Component } from 'react';
import Select from 'react-select';
import '../assets/css/react-select.css';

class Select2 extends Component {
    render() {
        return (
            <Select
                id={this.props.id}
                ref={this.props.reference}
                className={this.props.className}
                value={this.props.value}
                onChange={this.props.onChange}
                options={this.props.options}
                placeholder={this.props.placeholder}
                name={this.props.name}
                isMulti={this.props.multi}
                isDisabled={this.props.disabled}
                isLoading={this.props.isLoading}
                isClearable={true}
            />
        );
    }
}

export default Select2;