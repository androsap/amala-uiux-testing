import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { Form, Row, Col, Card } from 'antd';
import { DetailRequest } from '../../../utilities/RequestService';
import moment from 'moment';

class MilesInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expiredawardmiles: undefined
        };
    }

    componentDidMount() {
        this.getDetail()
    };

    getDetail = () => {
        DetailRequest(api.url.membertransaction.detail, { certificateid: this.props.certificateid }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                const expiredawardmiles = result.expiredawardmiles;

                this.setState({ expiredawardmiles });
            }
        });
    };

    render() {
        const { expiredawardmiles } = this.state;

        return (
            <Card title="Miles Information" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                <Row>
                    <Col xs={24} lg={10} >
                        <Form.Item label={<label style={{ color: 'red' }}>Expired Award Miles :</label>} style={{ margin: 0 }} colon={false}>
                            <span className="ant-form-text">{
                                (expiredawardmiles !== undefined) ? <span><strong style={{ color: 'red' }}>{expiredawardmiles}</strong>  ( view at {moment().format('DD/MM/YYYY')} ) </span> : '-'
                            }</span>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default MilesInformation;