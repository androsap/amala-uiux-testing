import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

class Layout extends Component {

    componentDidMount() {
        const { urltemplate, voucher, number } = this.props;
        this.generateCanvas(voucher, urltemplate, "canvas" + number);
    }

    generateCanvas(vouchertext, voucherimage, targetcanvas) {
        var imageCanvas = new Image();
        const base_image = new Image();
        imageCanvas.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            const canvas = document.getElementById(targetcanvas);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imageCanvas, 0, 0);
            var temp1 = vouchertext;
            var qrcode = temp1 === undefined ? '' : (temp1.find(o => o.vouchertext.includes('qr-')) === undefined) ? '' : temp1.find(o => o.vouchertext.includes('qr-'));
            function make_base() {
                base_image.src = `data:image/jpeg;base64,${qrcode.vouchertext.split('-')[1]}`;
                base_image.onload = function () {
                    ctx.drawImage(base_image, 40, 40, 170, 170, qrcode.positionx, qrcode.positiony, 100, 100);
                }
            }
            for (const keyTemp1 in temp1) {
                var posx = temp1[keyTemp1].positionx;
                var posy = (temp1[keyTemp1].positiony * 1) + 19;
                var text = temp1[keyTemp1].vouchertext;
                var color = temp1[keyTemp1].color;
                var font = temp1[keyTemp1].font;
                var size = temp1[keyTemp1].size;
                if (text.includes('qr-')) {
                    make_base();
                }
                ctx.font = size + 'px ' + font;
                ctx.fillStyle = color;
                ctx.fillText((text.includes('qr-') ? '' : text), posx, posy);
            }
        };
        imageCanvas.src = voucherimage;
    }

    render() {
        const { urltemplate, voucher, number } = this.props;
        this.generateCanvas(voucher, urltemplate, "canvas" + number);

        return (
            <Card title="Voucher Preview" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
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