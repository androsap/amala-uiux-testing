import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';
import packageJson from '../../package.json';
global.appVersion = packageJson.version;

const { Footer } = Layout;
const FooterComponent = () => (
	<Footer style={{ textAlign: 'center' }}>AMALA {global.appVersion} - PT. Aero Systems Indonesia ({moment().format("YYYY")})</Footer>
);

export default FooterComponent;