import React from 'react';
// import Main from './pages/Main';
import MainLayout from './components/layouts/MainLayout';
import { ToastContainer, Flip } from 'react-toastify';
import './assets/css/react-toastify.css';
import './assets/css/react-modal.css';
import 'antd/dist/antd.css';
import './custom.css';
import './screenmobile.css'; //max 480px
import './screentablet.css'; //max 576px
import './screentablet2.css'; //max 768px
import './screenlaptop.css'; //max 1024px
import './screendesktop.css'; //max 1200px

class Layout extends React.Component {
	render() {
		return (
			<React.Fragment>
				<ToastContainer autoClose={false}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange={false}
					draggable
					pauseOnHover={false}
					transition={Flip}
					position="top-right" />
				{/* <Main /> */}
				<MainLayout />
			</React.Fragment>
		)
	}
}

export default Layout;