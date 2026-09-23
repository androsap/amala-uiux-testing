import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;
class App extends React.Component {

    render() {
        return (
            <Layout>
                <Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}

export default App;
