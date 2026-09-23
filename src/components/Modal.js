import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from "react-redux";

// const defaultClassName = 'btn btn-outline-dark btn-sm';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isrender: true
        }
    }

    render() {
        let { isrender } = this.state;
        // let htmlType = this.props.htmlType;
        let visible = this.props.visible;
        let title = (this.props.title) ? this.props.title : '';
        // let className = (this.props.className) ? this.props.className : defaultClassName;
        // let icon = this.props.icon;
        let label = this.props.label;
        let size = this.props.size;
        // let type = (this.props.type) ? this.props.type : 'default';
        let onClick = this.props.onClick;
        let onOk = this.props.onOk;
        let onCancel = this.props.onCancel;
        let footer = this.props.footer;
        // let menucode = this.props.menucode;
        // let prefixmenuname = this.props.prefixmenuname;
        // let actioncode = this.props.actioncode;
        // let functioncode = prefixmenuname + "_" + actioncode;

        //CHECK PERMISSION 
        // if (menucode !== undefined && prefixmenuname !== undefined && actioncode !== undefined) {
        //     if ((this.props.permission.usermenu[menucode] && this.props.permission.usermenu[menucode][prefixmenuname + "_ACCESS"])) {
        //         isrender = this.props.permission.usermenu[menucode][functioncode];
        //     } else {
        //         isrender = false;
        //     }
        // }

        if (isrender) {
            return (
                <Button size={size} onClick={onClick} label={label} />,
                <Modal
                    visible={visible}
                    title={title}
                    onOk={onOk}
                    onCancel={onCancel}
                    footer={footer}
                    // footers={[
                    //     <Button key="back" onClick={this.handleCancel}>Return</Button>,
                    //     <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>Submit</Button>,
                    // ]}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            );
        } else {
            return (null);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);