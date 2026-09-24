import React from 'react';
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm, LegendSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            logid: null,
        }
    }

    componentDidMount() {
        document.title = "Legends | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    render() {
        const configurationSearchForm = [
            { labeltext: "Module", datafield: "module", type: 'component', placeholder: 'Module', component: LegendSelect, showDefaultSearch: true, specialSearch: false },
            { labeltext: "Key", datafield: "key", type: 'text', placeholder: 'Key', showDefaultSearch: true }
        ];

        const configurationTable = {
            url: api.url.userlog.legendlist,
            sort: { module: 'asc' },
            columns: [
                {
                    type: 'html', title: 'Module', dataIndex: 'module', sorter: true, width: '50%',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Key', dataIndex: 'key', sorter: true,  width: '45%',
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Legends</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                {/* <Row gutter={24} type="flex" justify="center" style={{ margin: 10 }}>
                    <Button url="/user-log" htmlType="link" type="default" label="Back" />
                </Row> */}
            </React.Fragment>
        );
    }
}

export default Form.create()(App);