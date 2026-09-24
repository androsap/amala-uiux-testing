import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

class Layout extends Component {

    componentDidMount() {
        const { urltemplate, voucher, number } = this.props;
        this.generateCanvas(voucher, urltemplate, "canvas" + number);
    }

    generateCanvas(vouchertext, voucherimage, targetcanvas) {
        var imageCanvas = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById(targetcanvas);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);
            var temp1 = vouchertext;
            for (const keyTemp1 in temp1) {
                var posx = temp1[keyTemp1].positionx;
                var posy = (temp1[keyTemp1].positiony * 1) + 19;
                var text = temp1[keyTemp1].vouchertext;
                var color = temp1[keyTemp1].color;
                var font = temp1[keyTemp1].font;
                var size = temp1[keyTemp1].size;

                ctx.font = size + 'px ' + font;
                ctx.fillStyle = color;
                ctx.fillText(text, posx, posy);
            }
        };
        imageCanvas.src = voucherimage;
    }

    render() {
        const { urltemplate, voucher, number } = this.props;
        this.generateCanvas(voucher, urltemplate, "canvas" + number);

        return (
            <Card title="Voucher Preview" bordered={false} style={{ marginBottom: 10 }}>
                <Row style={{ textAlign: 'center' }}>
                    <Col>
                        <canvas key={"canvas" + number} id={"canvas" + number}></canvas>
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default Layout;