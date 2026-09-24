import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button } from '../../components/Base/BaseComponent';
import { Row, Typography, Icon, Spin } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errors: {},
            responseCode: '0',
            responseMessage: '',
            image: '',
            title: '',
            content: '',
            effectivedate: ''
        };
    }

    componentDidMount() {
        document.title = "News | Loyalty Management System";
        let id = this.props.match.params.ID;
        this.getDetail(id);
    }

    getDetail(id) {
        let url = api.url.communication.detail;
        let data = { id };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    loading: false,
                    id: result.id,
                    referencenum: result.referencenum,
                    title: result.title,
                    content: result.content,
                    image: result.image,
                    effectivedate: result.effectivedate
                });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage
                    }
                );
            }
        });
    }

    render() {
        const { loading } = this.state;
        const { title, content, image, effectivedate } = this.state;

        //title bar on browser
        document.title = "News | Loyalty Management System";
        //render form
        return (
            <React.Fragment>
                <Spin spinning={loading}>
                    <img alt="News" src={image} className="news-entry-detail" />
                    <Title level={2} strong>{title}</Title>
                    <Text type="secondary"><Icon type="calendar" /> {moment(effectivedate).format("DD/MM/YYYY")}</Text>
                    <Paragraph>{ReactHtmlParser(content)}</Paragraph>
                    <Row type="flex" justify="center" style={{ marginTop: 30 }}>
                        <Button url="/news" htmlType="link" type="default" label="Back" />
                    </Row>
                </Spin>
            </React.Fragment>
        )
    }
}

export default Layout;