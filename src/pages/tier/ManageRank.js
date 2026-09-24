import React from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, MembershipSelect } from '../../components/Base/BaseComponent';
import { Spin, Form, Table, Row, Col, InputNumber, Popconfirm, Input } from 'antd';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            editingKey: '',
            fieldValue: {
                membershipid: null
            }
        };

        this.columns = [
            {
                title: 'Membership',
                dataIndex: 'membershipname',
                editable: true,
            },
            {
                title: 'Tier Name',
                dataIndex: 'tiername',
                editable: true,
            },
            {
                title: 'Rank',
                dataIndex: 'rank',
                editable: true,
            },
            {
                title: 'Action',
                dataIndex: 'action',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a onClick={() => this.save(form, record.tierid)} style={{ marginRight: 8 }} > Save </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.number)}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (<a disabled={editingKey !== ''} onClick={() => this.edit(record.number)}> Edit </a>);
                },
            },
        ]
    }


    isEditing = record => record.number === this.state.editingKey;

    edit(key) {
        this.setState({ editingKey: key });
    }

    componentDidMount() {
        document.title = "Manage Manage Tier Rank | Loyalty Management System";
        this.componentMembershipSelect.retrieveData();
    }

    getList(membershipid) {
        if (membershipid) {
            let url = api.url.tier.list;
            let paging = { page: 1, limit: -1 };
            let criteria = { membershipid };

            this.setState({ isLoading: true });
            RetrieveRequest(url, criteria, paging, [], {}).then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let dataList = response.result.map((obj, key) => { return ({ number: key, ...obj }) });

                    RetrieveRequest(api.url.tierrank.list, {}, paging).then((response) => {
                        dataList.forEach(a => {
                            response.result.forEach(b => {
                                if (a.tierid === b.tierid) { a.rank = b.rank }
                            });
                        });
                        dataList.sort((a, b) => a.rank > b.rank);
                        this.setState({ dataList, isLoading: false });
                    })

                } else {
                    Alert.error(response.status.responsemessage);
                }
            });
        } else {
            this.setState({ dataList: [] });
        }
    }

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, tierid) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.dataList];
            const index = newData.findIndex(item => tierid === item.tierid);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ isLoading: false, dataList: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ isLoading: false, dataList: newData, editingKey: '' });
            }
        });
    }

    saveManageRank(e) {
        e.preventDefault();
        this.props.form.validateFields((error, input) => {
            this.setState({ isLoading: true });
            if (error) {
                return;
            }
            let data = this.state.dataList.map((obj, key) => {
                return { tierid: obj.tierid, rank: (obj.rank !== undefined) ? obj.rank : null }
            });

            let message = 'Data has been updated';
            let url = api.url.tierrank.create;
            SaveRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);

                    this.props.handleCancel();
                } else {
                    Alert.error(responsemessage);
                }
                //hide loader
                this.setState({ isLoading: false, editingKey: '' });
            })
        });
    }

    handleChangeMembership = (membershipid) => {
        this.getList(membershipid);
        this.setState({ fieldValue: { ...this.state.fieldValue, membershipid } })
    }

    render() {
        const { dataList, isLoading } = this.state;
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'rank' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <EditableContext.Provider value={this.props.form}>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} labelAlign="left" onSubmit={(e) => this.saveManageRank(e)}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                <MembershipSelect ref={(e) => { this.componentMembershipSelect = e }} form={this.props.form} labeltext="Membership" datafield="membershipid" onChange={this.handleChangeMembership} validationrules={['required']} />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 30 }}>
                            <Table components={components} rowKey={record => record.titlecode} columns={columns} dataSource={dataList} size="middle" pagination={false} isLoading={isLoading} />
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" />
                        </Row>
                    </Form>
                </Spin>
            </EditableContext.Provider>
        );
    }
}

export default Form.create()(App);