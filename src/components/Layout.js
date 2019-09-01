import React from 'react';

import Autocomplete from './Autocomplete';
import '../styles/Layout.scss';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="layout">
                <h2>Discover schools that are right for you.</h2>
                <Autocomplete></Autocomplete>
            </div>
        );
    }
}