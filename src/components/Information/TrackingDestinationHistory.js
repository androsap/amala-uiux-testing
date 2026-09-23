import React from 'react';
import { Row, Table, Tooltip, Tag } from 'antd';
import moment from 'moment';

const { Column } = Table;

class TrackingDestinationHistory extends React.Component {
    render() {
        let { mailingorderdestination } = this.props;

        let number = 0;
        mailingorderdestination = (mailingorderdestination) ? mailingorderdestination.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) : [];

        return (
            <React.Fragment >
                <Row>
                    <div>
                        <Table dataSource={mailingorderdestination} size='middle' pagination={false} >
                            <Column title='No' dataIndex='number' key='number' className='nowrap' render={(value, record) => (value) ? value : '-'} />
                            <Column title='Date' dataIndex='createdDate' key='createdDate' className='nowrap' render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                            <Column title='Send to' dataIndex='sendto' key='sendto' className='nowrap' render={(value, record) => (value) ? (value === 'BO') ? 'Branch Office' : value : '-'} />
                            <Column title='Address' dataIndex='address' key='address' className='nowrap' render={
                                (value, record) => {
                                    const { branchcode, ticketoffice, city, state, country, postalcode } = record || {};

                                    if (record.sendto === 'BO') {
                                        return `${(branchcode) ? branchcode : '-'} ${(ticketoffice) ? ticketoffice : '-'} ${value}`
                                    } else return `${value} ${(city) ? city : ''} ${(state) ? state : ''} ${(country) ? country : ''} ${(postalcode) ? postalcode : ''}`
                                }
                            } />
                            <Column title='' dataIndex='info' key='information' className='nowrap' render={
                                (value, record) => {
                                    const { isdefault, status } = record || {};

                                    return <Row>
                                        {(isdefault) ? <Tooltip title='First Destination Address' ><Tag color='magenta'>Return</Tag></Tooltip> : null}
                                        {(status) ? <Tooltip title='Current Destination Address' ><Tag color='green'>Reorder</Tag></Tooltip> : null}
                                    </Row>
                                }
                            } />
                        </Table>
                    </div>
                </Row>
            </React.Fragment >
        );
    }
}
export default TrackingDestinationHistory;