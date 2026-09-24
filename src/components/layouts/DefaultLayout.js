import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

class App extends React.Component {

    render() {
        const width = window.innerWidth;

        const isMobile = width <= 576;
        const isTablet = width > 576 && width <= 768;

        return (
            <Layout>
                <Content
                    style={{
                        borderRadius: isMobile ? '8px' : '16px',
                        margin: isMobile ? '12px 0' : isTablet ? '24px 0' : '48px 0',
                        padding: isMobile ? '12px' : isTablet ? '16px' : '24px',
                        minHeight: isMobile ? 'auto' : 500,
                        background: '#fff',
                        boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)',
                    }}
                >
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}

export default App;