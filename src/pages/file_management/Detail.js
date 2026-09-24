import React from 'react';
import GeneralDetails from './detail/General';
import TerminateFile from './detail/TerminateFile';
// import TransferPoint from './detail/TransferPoint';

class App extends React.Component {
    render() {
        const { filetype } = this.props;

        if (filetype === 'TERMINATE' || filetype === 'TERMINATE_OUT') {
            return (<TerminateFile {...this.props} />)
        } else return (<GeneralDetails {...this.props} />);
        // } else if (filetype === 'TRANSFER_POINT') {
        //     return (<TransferPoint {...this.props} />)
        // } else {
        //     return (<GeneralDetails {...this.props} />)
        // }
    }
}

export default App;
