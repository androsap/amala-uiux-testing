import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import '../assets/css/react-datepicker.css';

class Datepicker extends Component {
    render() {
        return (
            <DatePicker
                id={this.props.id}
                className={this.props.className}
                selected={this.props.selected}
                onChange={this.props.onChange}
                dateFormat={this.props.dateFormat}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                selectsStart={this.props.selectsStart}
                selectsEnd={this.props.selectsEnd}
                // showMonthDropdown={this.props.showMonthDropdown}
                // showYearDropdown={this.props.showYearDropdown}
                placeholderText={this.props.placeholderText}
                disabled={this.props.disabled}
                isClearable={false}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                autoComplete="true"
                showMonthDropdown
                showYearDropdown />
        );
    }
}

export default Datepicker;