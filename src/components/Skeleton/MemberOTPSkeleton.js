import React from "react";
import { Row, Col } from "antd";

const shimmer = {
    background: "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%)",
    backgroundSize: "400% 100%",
    animation: "asyst-skeleton-loading 1.4s ease infinite",
    borderRadius: 8,
};

class MemberOTPSkeleton extends React.Component {
    render() {
        return (
            <Row type="flex" justify="center" align="middle" style={{ minHeight: "100vh", padding: "24px 16px", textAlign: "center" }}>
                <style>{`@keyframes asyst-skeleton-loading { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }`}</style>

                <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                    <Row type="flex" justify="center" align="middle" gutter={[24, 24]} style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
                        <Col>
                            <div style={{ ...shimmer, width: "clamp(100px, 30vw, 200px)", height: "clamp(40px, 8vw, 56px)" }} />
                        </Col>
                        <Col>
                            <div style={{ ...shimmer, width: "clamp(100px, 30vw, 200px)", height: "clamp(40px, 8vw, 56px)" }} />
                        </Col>
                    </Row>

                    <Row type="flex" justify="center" style={{ marginBottom: "clamp(32px, 6vw, 48px)" }}>
                        <div style={{ ...shimmer, width: "clamp(140px, 36vw, 240px)", height: "clamp(140px, 36vw, 240px)", borderRadius: "50%" }} />
                    </Row>

                    <Row type="flex" justify="center" style={{ marginBottom: 24 }}>
                        <div style={{ ...shimmer, width: "clamp(200px, 50vw, 320px)", height: "clamp(36px, 7vw, 52px)" }} />
                    </Row>

                    <Row type="flex" justify="center" style={{ marginBottom: 12 }}>
                        <div style={{ ...shimmer, width: "clamp(220px, 55vw, 360px)", height: "clamp(14px, 3vw, 18px)" }} />
                    </Row>

                    <Row type="flex" justify="center">
                        <div style={{ ...shimmer, width: "clamp(160px, 40vw, 260px)", height: "clamp(14px, 3vw, 18px)" }} />
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default MemberOTPSkeleton;