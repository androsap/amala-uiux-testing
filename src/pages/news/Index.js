import React from 'react';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button } from '../../components/Base/BaseComponent';
import { Form, Row, notification, Typography, Icon, Divider, Col, Spin, Empty } from 'antd';
import moment from 'moment';
import htmlToText from 'html-to-text';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

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
        document.title = "News | Loyalty Management System";
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
                <Row gutter={24} key={key} className="news-entry-index">
                    <Col span={10}>
                        <img alt="News" src={val.image} className="news-thumbnail-index" />
                    </Col>
                    <Col span={14}>
                        {/* <Title level={3}><Link to={'/news/' + val.id}>{val.title}</Link></Title> */}
                        <Title level={2} strong>{val.title}</Title>
                        <Text type="secondary"><Icon type="calendar" /> {moment(val.effectivedate).format("DD/MM/YYYY")}</Text>
                        <Paragraph>{htmlToText.fromString(val.content).length > 350 ? htmlToText.fromString(val.content).substring(0, 350) + '...' : htmlToText.fromString(val.content)}</Paragraph>
                    </Col>
                    <Col align="right">
                        <Link to={'/news/' + val.id} className="btn-custom-transparent">Read More<Icon type="right" /></Link>
                    </Col>
                    <Divider style={{ marginBottom: 0 }} />
                </Row>
            );
        } else {
            newsList =
                <Row gutter={24} className="news-entry-index">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No News today</span>} style={{ paddingBlockStart: 180 }} />
                </Row>
        }
        return (
            <React.Fragment>
                <Spin spinning={this.state.loading}>
                    <Row>
                        <Title level={3}>News</Title>
                    </Row>
                    <div style={{ overflow: 'scroll', height: 500 }}>
                        {newsList}
                    </div>
                    <Row type="flex" justify="center" style={{ marginTop: 30 }}>
                        <Button url="/" htmlType="link" type="default" label="Back" />
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);