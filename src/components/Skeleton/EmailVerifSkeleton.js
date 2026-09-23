import React from "react";
import { Row, Col } from "antd";

const shimmer = {
    background: "linear-gradient(90deg, #eae9e4 25%, #deded8 37%, #eae9e4 63%)",
    backgroundSize: "400% 100%",
    animation: "asyst-skeleton-loading 1.4s ease infinite",
    borderRadius: 8,
};

class EmailVerifSkeleton extends React.Component {
    render() {
        return (
            <div style={{ minHeight: "100vh", background: "#f4f3ef", display: "flex", flexDirection: "column", padding: "40px 24px", boxSizing: "border-box" }}>
                <style>{`@keyframes asyst-skeleton-loading { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }`}</style>

                {/* Header: logo top-left */}
                <Row style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ ...shimmer, width: "clamp(120px, 20vw, 180px)", height: "clamp(32px, 5vw, 48px)" }} />
                </Row>

                {/* Main content centered */}
                <Row type="flex" justify="center" align="middle" style={{ flex: 1, marginTop: "clamp(40px, 8vw, 80px)" }}>
                    <Col xs={22} sm={16} md={12} lg={8} xl={7} style={{ textAlign: "center" }}>

                        {/* Illustration */}
                        <Row type="flex" justify="center" style={{ marginBottom: "clamp(24px, 5vw, 40px)" }}>
                            <div style={{ ...shimmer, width: "clamp(160px, 28vw, 240px)", height: "clamp(160px, 28vw, 240px)", borderRadius: 16 }} />
                        </Row>

                        {/* Eyebrow: dot + label */}
                        <Row type="flex" justify="center" align="middle" style={{ marginBottom: 20, gap: 8 }}>
                            <div style={{ ...shimmer, width: 8, height: 8, borderRadius: "50%", flexShrink: 0 }} />
                            <div style={{ ...shimmer, width: "clamp(100px, 20vw, 140px)", height: 14, borderRadius: 6 }} />
                        </Row>

                        {/* Title */}
                        <Row type="flex" justify="center" style={{ marginBottom: 12 }}>
                            <div style={{ ...shimmer, width: "clamp(240px, 55vw, 420px)", height: "clamp(40px, 7vw, 60px)", borderRadius: 10 }} />
                        </Row>

                        {/* Subtitle line 1 */}
                        <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <div style={{ ...shimmer, width: "clamp(200px, 50vw, 380px)", height: "clamp(14px, 2.5vw, 20px)", borderRadius: 6 }} />
                        </Row>

                        {/* Subtitle line 2 */}
                        <Row type="flex" justify="center" style={{ marginBottom: "clamp(28px, 5vw, 40px)" }}>
                            <div style={{ ...shimmer, width: "clamp(160px, 40vw, 300px)", height: "clamp(14px, 2.5vw, 20px)", borderRadius: 6 }} />
                        </Row>

                        {/* Button */}
                        <Row type="flex" justify="center">
                            <div style={{ ...shimmer, width: "clamp(180px, 35vw, 260px)", height: "clamp(48px, 7vw, 60px)", borderRadius: 12 }} />
                        </Row>
                    </Col>
                </Row>

                {/* Footer */}
                <Row type="flex" justify="center" style={{ marginTop: "auto", paddingTop: 48 }}>
                    <Col xs={24} style={{ textAlign: "center" }}>
                        <Row type="flex" justify="center" style={{ marginBottom: 20 }}>
                            <div style={{ height: 1, width: 240, background: "rgba(32, 45, 92, 0.15)" }} />
                        </Row>
                        <Row type="flex" justify="center" align="middle" style={{ gap: 8, marginBottom: 32 }}>
                            <div style={{ ...shimmer, width: 160, height: 12, borderRadius: 6 }} />
                            <div style={{ ...shimmer, width: 60, height: 16, borderRadius: 4 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EmailVerifSkeleton;
