import React from 'react';
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
const { Title } = Typography;

class App extends React.Component {

    componentDidMount() {
        document.title = "Manage Relation Bonus | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.relationbonus.list,
            columns: [
                { type: 'field', title: 'Tier ID', dataIndex: 'tierid', sorter: true },
                { type: 'field', title: 'Parent Award Miles Factor', dataIndex: 'parentfactormiles', sorter: true },
                { type: 'field', title: 'Child Award Miles Factor', dataIndex: 'childfactormiles', sorter: true },
                { type: 'field', title: 'Parent Tier Miles Factor', dataIndex: 'parentfactortier', sorter: true },
                { type: 'field', title: 'Child Tier Miles Factor', dataIndex: 'childfactortier', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => {
                        return ((value) ? moment(value).format('DD/MM/YYYY') : '-')
                    }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => {
                        return ((value) ? moment(value).format('DD/MM/YYYY') : '-')
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/relation-bonus/form/' + row.tierrelationbonusid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Tier ID", datafield: "tierid", type: 'text', placeholder: 'Tier ID', showDefaultSearch: true },
            { labeltext: "Parent Award Miles Factor", datafield: "parentfactormiles", type: 'text', placeholder: 'Parent Award Miles Factor', showDefaultSearch: true },
            { labeltext: "Child Award Miles Factor", datafield: "childfactormiles", type: 'text', placeholder: 'Child Award Miles Factor', showDefaultSearch: true, },
            { labeltext: "Parent Tier Miles Factor", datafield: "parentfactortier", type: 'text', placeholder: 'Parent Tier Miles Factor', showDefaultSearch: true },
            { labeltext: "Child Tier Miles Factor", datafield: "childfactortier", type: 'text', placeholder: 'Child Tier Miles Factor', showDefaultSearch: false },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false }
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Relation Bonus</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/relation-bonus/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);