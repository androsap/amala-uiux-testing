import React from 'react';
import { Card, Icon, Button, Modal } from 'antd';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal : false,
            visible: false

        };        
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        return (
            <Card   title={this.props.title} 
                    style={{boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)'}} 
                    extra={<a>
                        <Modal title={this.props.title} visible={this.state.visible} onCancel={this.handleCancel} footer={null} width={960} destroyOnClose={true}>
                        <div>
                            {this.props.children}
                        </div>
                        </Modal>
                        <Button type="" shape="" opacity="0.5" onClick={this.showModal}><Icon type="arrows-alt"/></Button>
                       </a>}>
                <div>
                    {this.props.children}
                </div>
            </Card>
        )
    }
}



export default Layout;