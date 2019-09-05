import React from 'react';

import Autocomplete from './Autocomplete';
import '../styles/Layout.scss';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styleTwoEnabled: false
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            styleTwoEnabled: !this.state.styleTwoEnabled
        });
    }

    render() {
        let styleEnabled = this.state.styleTwoEnabled ? 'Show Style 1' : 'Show Style 2',
            buttonClassNames = this.state.styleTwoEnabled ? 'button' : 'button alternate-styling';

        return (
            <div className="layout">
                <h2>Discover the schools that are right for you.</h2>
                <div className="button-section">
                    <button className={buttonClassNames} onClick={this.onClick}>{ styleEnabled }</button>
                </div>
                <Autocomplete
                    styleTwoEnabled={this.state.styleTwoEnabled}/>
            </div>
        );
    }
}
