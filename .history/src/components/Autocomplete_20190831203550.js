import React from 'react';

export default class Autocomplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestions: null
        };
    }

    componentDidMount() {
        // initialize suggestion grab
    }
    
    render() {
        return (
            <div class="autocomplete-field">
                <input><img src=""></img></input>
            </div>
        );
    }
}