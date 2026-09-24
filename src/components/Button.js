import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

const defaultClassName = 'btn btn-outline-dark btn-sm';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isrender: true
        }
    }

    render() {
        let { isrender } = this.state;
        let htmlType = this.props.htmlType;
        let url = (this.props.url) ? this.props.url : '';
        let title = (this.props.title) ? this.props.title : '';
        let className = (this.props.className) ? this.props.className : defaultClassName;
        let shape = this.props.shape;
        let icon = this.props.icon;
        let label = this.props.label;
        let size = this.props.size;;
        let style = this.props.style;
        let type = (this.props.type) ? this.props.type : 'default';
        let onClick = this.props.onClick;
        let menucode = this.props.menucode;
        let prefixmenuname = this.props.prefixmenuname;
        let actioncode = this.props.actioncode;
        let functioncode = prefixmenuname + "_" + actioncode;
        let custommenu = this.props.custommenu;
        let ghost = this.props.ghost;
        const { visible = true } = this.props;

        if (!visible) return null;

        //CHECK PERMISSION 
        if (menucode !== undefined && prefixmenuname !== undefined && actioncode !== undefined) {
            if ((this.props.permission.usermenu[menucode] && this.props.permission.usermenu[menucode][prefixmenuname + "_ACCESS"])) {
                if (actioncode === 'UPDATE') {
                    if ((this.props.permission.usermenu[menucode] && !this.props.permission.usermenu[menucode][functioncode])) {
                        icon = (icon) ? 'eye' : '';
                        label = (label) ? 'View' : '';
                        title = (title) ? 'View' : '';
                        isrender = true;
                    }
                } else {
                    isrender = this.props.permission.usermenu[menucode][functioncode];
                }
            } else {
                if ((this.props.permission.usermenu[menucode] && ((this.props.permission.usermenu[menucode][prefixmenuname + "_UPDATE"] && custommenu) || (this.props.permission.usermenu[menucode][prefixmenuname + "_REQUPDTE"] && custommenu) ||
                    this.props.permission.usermenu[menucode][prefixmenuname + "_CANCEL"] || (this.props.permission.usermenu[menucode][prefixmenuname + "_REQCNCLE"] )))) {
                    isrender = this.props.permission.usermenu[menucode][functioncode];
                } else {
                    isrender = false;
                }
            }
        }

        if (isrender) {
            if (htmlType === 'submit' || htmlType === 'button') {
                return (<Button ghost={ghost} htmlType={htmlType} size={size} type={type} title={title} className={className} onClick={onClick} style={style} icon={icon} shape={shape} disabled={this.props.disabled} block={this.props.block}>{label}</Button>);
            } else {
                return (
                    <Link to={url} title={title} disabled={this.props.disabled}>
                        <Button ghost={ghost} type={type} size={size} icon={icon} shape={shape} style={style} className={className} disabled={this.props.disabled} block={this.props.block}>{label}</Button>
                    </Link>
                );
            }
        } else {
            return (null);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);