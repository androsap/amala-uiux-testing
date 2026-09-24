import React from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Form, Row, Col } from 'antd';
import { Alert } from '../../../components/Base/BaseComponent';
import { jsCapitalEachWord } from '../../../utilities/Helpers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {}
        }
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        let memberid = this.props.duplicatewith;

        RetrieveRequest(api.url.member.list, { memberid }).then((response) => {
            let { status = {}, result } = response;
            if (result && status.responsecode === '0000') {
                this.setState({ result: result[0] });
            } else Alert.error('Duplicate member not found');
        })
    };

    render() {
        const { cardnumber, name } = this.state.result || undefined;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <React.Fragment>
                <Form {...formItemLayout}>
                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} >
                            <Form.Item label='Cardnumber'>
                                <span className="ant-form-text">{cardnumber ? cardnumber : '-'}</span>
                            </Form.Item>
                            <Form.Item label='Member Name'>
                                <span className="ant-form-text">{name ? jsCapitalEachWord(name) : '-'}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
