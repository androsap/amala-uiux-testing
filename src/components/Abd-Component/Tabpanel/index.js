import React, { Component } from 'react';
import { Tabs } from 'antd'
import BaseForm from '../Form/BaseForm'
import DefaultForm from '../Form';

const { TabPane } = Tabs;

export class Index extends Component {
    render() {
        const { items, onChange, key, form } = this.props;

        return (<Tabs key={key} {...this.props} onChange={(e) => {
                if(onChange) onChange(e);
            }}>
            {items ? items.map(item => {
                return <TabPane forceRender={true} tab={item.title} key={item.key} {...item} >
                    {form 
                        ? <BaseForm {...item.form} form={form} isGrouping={true} />
                        : <DefaultForm  {...item.form} /> }
                </TabPane>
            }) : null}
        </Tabs>);
    }
}

export default Index;