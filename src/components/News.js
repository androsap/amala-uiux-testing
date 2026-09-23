import React from 'react';
import { RetrieveRequest } from '../utilities/RequestService';
import { api } from '../config/Services';
import { Form, Row, notification, Typography, Icon, Divider, Col, Spin, Empty } from 'antd';
import moment from 'moment';
import htmlToText from 'html-to-text';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 5,
            dataList: [],
            criteria: {
                accessdate: moment(new Date()),
                active: true
            },
            sort: {
                // effectivedate: 'desc'
            },
            loading: false
        };
    }

    componentDidMount() {
        document.title = "Dashboard | Loyalty Management System";
        this.getList();
    }

    getList() {
        const { criteria, sort } = this.state;
        let url = api.url.communication.list;
        let column = [];
        let paging = { page: this.state.current, limit: this.state.pageSize };
        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { paging } = response;
            if (response.status.responsecode.substring(0, 1) === '0') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalrecord, loading: false });
            } else {
                notification['error']({ message: 'Error Service', description: response.status.responsemessage, duration: null });
            }
        });
    }

    render() {
        let newsList = '';
        if (this.state.dataList.length) {
            newsList = this.state.dataList.map((val, key) =>
                <Row gutter={24} key={key} className="news-entry-dashboard">
                    <Col span={8}>
                        <img alt="News" src={val.image} className="news-thumbnail-dashboard" />
                    </Col>
                    <Col span={16}>
                        <Title level={4} strong><Link to={'/news/' + val.id}>{val.title}</Link></Title>
                        <Text type="secondary"><Icon type="calendar" /> {moment(val.effectivedate).format("DD/MM/YYYY")}</Text>
                        <p>{htmlToText.fromString(val.content).length > 90 ? htmlToText.fromString(val.content).substring(0, 90) + '...' : htmlToText.fromString(val.content)}</p>
                    </Col>
                    <Divider style={{ marginBottom: 0 }} />
                </Row>
            );
        } else {
            newsList =
                <Row gutter={24} className="news-entry-dashboard">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No News today</span>} style={{ paddingBlockStart: 180 }} />
                </Row>
        }

        return (
            <React.Fragment>
                <Spin spinning={this.state.loading}>
                    <div style={{ overflow: 'scroll', height: 500 }}>
                        {newsList}
                    </div>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);