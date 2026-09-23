import React from 'react';
import imageLoader from '../assets/images/loader.gif';
import '../assets/css/loader.css';

const Loader = ({ ...props }) => (
    (props.value) ? <div className="overlay"><i><img alt="" src={imageLoader} style={{width:"auto"}} /></i></div> : ''
);

export default Loader;