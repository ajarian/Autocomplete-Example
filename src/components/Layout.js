import React from 'react';

import Autocomplete from './Autocomplete';
import '../styles/Layout.scss';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styleOneEnabled: true,
            styleTwoEnabled: false
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            styleOneEnabled: !this.state.styleOneEnabled,
            styleTwoEnabled: !this.state.styleTwoEnabled
        });
    }

    render() {
        let styleEnabled = this.state.styleOneEnabled ? 'Show Style 2' : 'Show Style 1';

        return (
            <div className="layout">
                <h2>Discover the schools that are right for you.</h2>
                <div className="button-section">
                    <button className="button" onClick={this.onClick}>{ styleEnabled }</button>
                </div>
                <Autocomplete
                    styleOne={this.state.styleOneEnabled}
                    styleTwo={this.state.styleTwoEnabled}/>
            </div>
        );
    }
}
