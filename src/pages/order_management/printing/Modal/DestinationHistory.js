import React from 'react';
import { Form, Row, Table, } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';

const { Column } = Table;

class App extends React.Component {
    render() {
        const { trackingstatus } = this.props;

        return (
            <React.Fragment >
                <Row>
                    <div>
                        <Table dataSource={trackingstatus} size='middle' pagination={false} >
                            <Column title='No' dataIndex='createdBy' key='createdBy' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                            <Column title='Date' dataIndex='date' key='date' className='nowrap' render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                            <Column title='Send to' dataIndex='reordernumber' key='reordernumber' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                            <Column title='Address' dataIndex='reordernumber' key='reordernumber' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                            <Column title='State' dataIndex='notes' key='notes' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                            <Column title='Country' dataIndex='notes' key='notes' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                            <Column title='Postal Code' dataIndex='notes' key='notes' className='nowrap' render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                        </Table>
                    </div>
                </Row>
            </React.Fragment >
        );
    }
}
export default Form.create()(App);