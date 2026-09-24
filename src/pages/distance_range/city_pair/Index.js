import React from 'react';
import { Link } from 'react-router-dom';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from '../../../components/Alert';
import Breadcrumb from '../../../components/Breadcrumb';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
import ErrorGeneral from '../../error/ErrorGeneral';

var permissionList = _getUserPermission();
var menuname = 'citypairrange';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distancerangeid: (this.props.location.state && this.props.location.state.distancerangeid) ? this.props.location.state.distancerangeid : null,
            distancerangename: (this.props.location.state && this.props.location.state.distancerangename) ? this.props.location.state.distancerangename : null,
            dataList: [],
            isLoaded: false,
            route: null,
            bottomrange: null,
            upperrange: null,
            airlinecode: null
        };
    }

    componentDidMount() {
        let route = (this.props.location.state && this.props.location.state.route) ? this.props.location.state.route : null;
        let bottomrange = (this.props.location.state && this.props.location.state.bottomrange) ? this.props.location.state.bottomrange : null;
        let upperrange = (this.props.location.state && this.props.location.state.upperrange) ? this.props.location.state.upperrange : null;
        let airlinecode = (this.props.location.state && this.props.location.state.airlinecode) ? this.props.location.state.airlinecode : null;
        this.setState(
            {
                route, bottomrange, upperrange, airlinecode,
                isLoaded: false
            },
            () => (!_checkPermission(permissionList, menuname, 'access')) ? this.getList() : ""
        );
        document.title = "Manage Distance Range City Pair | Loyalty Management System";
    }

    getList() {
        let route = (this.props.location.state && this.props.location.state.route) ? this.props.location.state.route : null;
        let bottomrange = (this.props.location.state && this.props.location.state.bottomrange) ? this.props.location.state.bottomrange : null;
        let upperrange = (this.props.location.state && this.props.location.state.upperrange) ? this.props.location.state.upperrange : null;
        let airlinecode = (this.props.location.state && this.props.location.state.airlinecode) ? this.props.location.state.airlinecode : null;
        let url = api.url.accrualruleod.getcitypairbydistancerange;
        let data = { route, bottomrange, upperrange, airlinecode };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    dataList: response.result,
                    isLoaded: true
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    render() {
        const { distancerangeid } = this.state;
        if (distancerangeid) {
            const { dataList, isLoaded } = this.state;
            const { distancerangename } = this.state;
            var number = 0;
            var body = '';
            if (!isLoaded) {
                body = <tbody>
                    <tr>
                        <td colSpan="99" className="text-center">Loading . . .</td>
                    </tr>
                </tbody>;
            } else {
                if (dataList.length) {
                    body = <tbody>
                        {dataList.map((val, i) =>
                            <tr key={i}>
                                <td className="text-center">{++number}</td>
                                <td className="text-center">{val.originairport}</td>
                                <td className="text-center">{val.destinationairport}</td>
                                <td className="text-center">{val.airlinecode}</td>
                            </tr>
                        )}
                    </tbody>;
                } else {
                    body = <tbody>
                        <tr>
                            <td colSpan="99" className="text-center">No data to display</td>
                        </tr>
                    </tbody>;
                }
            }

            if (!_checkPermission(permissionList, menuname, 'access')) {
                return (
                    <div className="container-fluid">
                        <Breadcrumb path="Data Management / Partner Management / Distance Range / City Pair" />
                        <div className="main-panel">
                            <div className="content-title flex-hr mb-0 title-description">
                                <h1 className="title-has-control mt-2">
                                    <Link to="/distance-range" className="mdi mdi-arrow-left-bold-circle-outline" style={{ color: '#003D7A' }}></Link>
                                    Manage Distance Range City Pair - {distancerangename}</h1>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>No</th>
                                            <th>First Airport Code</th>
                                            <th>Second Airport Code </th>
                                            <th>Airline Code</th>
                                        </tr>
                                    </thead>
                                    {body}
                                </table>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
            }
        } else {
            return (<ErrorGeneral message={'Distance Range Id not detected, please do not use tab'} />);
        }
    }
}

export default Layout;