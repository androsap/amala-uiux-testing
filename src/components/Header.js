import React from 'react';
import { Layout } from 'antd';
import { Menu } from './Base/BaseComponent';

const { Header } = Layout;
const App = () => (
	<Header style={{ width: '100%', zIndex: '10', justifyContent: 'space-between', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)', padding: (window.innerWidth < 768) ? 0 : 'unset' }}>
		<div className="logo">
			<img src="/assets/images/logo.png" alt="amala" style={{ maxWidth: '100%', objectFit: 'cover', height: '35px' }} />
		</div>
		<Menu />
	</Header>
);

export default App;