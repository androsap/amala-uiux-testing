import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;
class App extends React.Component {

    render() {
        return (
            <Layout>
                <Content style={{ margin: '16px 0', padding: '24px', minHeight: 500}}>
                    <div>
                        {this.props.children}
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default App;
