import React,{Component} from 'react';
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line} from 'recharts';

class Chart extends Component{
    render(){
        let body = "";
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        switch (this.props.type){
            case "pie":
                body = <PieChart width={this.props.width} height={this.props.height} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                    <Pie data={this.props.data} cx={200} cy={130} dataKey="value" nameKey="name" innerRadius={0} outerRadius={90} fill="#8884d8" label>
                    {
                    	this.props.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                    </Pie>
                    <Tooltip/>
                    <Legend />
                </PieChart>;
            break;
            case "line":
                body = <LineChart width={this.props.width} height={this.props.height} data={this.props.data} margin={{top: 5, right: 0, left: 0, bottom: 5}}>
                	<XAxis dataKey="name"/>
                	<YAxis/>
                	<CartesianGrid strokeDasharray="3 3"/>
                	<Tooltip/>
                	<Legend />
                	<Line type="monotone" dataKey="Amala Member" stroke="#003D7A" activeDot={{r: 8}}/>
                </LineChart>;
            break;
            case "line2":
                body = <LineChart width={this.props.width} height={this.props.height} data={this.props.data} margin={{top: 5, right: 0, left: 0, bottom: 5}}>
                	<XAxis dataKey="name"/>
                	<YAxis/>
                	<CartesianGrid strokeDasharray="3 3"/>
                	<Tooltip/>
                	<Legend />
                	<Line type="monotone" dataKey="Airline Redemmption" stroke="#972AEA" activeDot={{r: 8}}/>
                	<Line type="monotone" dataKey="Non Airline Redemmption" stroke="#03A9F4"/>
                </LineChart>;
            break;
            default : break;
        }
        return (
        	<React.Fragment>
                {body}
            </React.Fragment>
        );
    }
}

export default Chart;