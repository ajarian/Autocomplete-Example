import React from 'react';

import '../styles/Autocomplete.scss';
import { JSONPUtil } from '../resources/JSONPUtil';
import searchIcon from '../resources/search.svg';

export default class Autocomplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            queryString: null,
            results: null,
            showSuggestions: false,
            suggestions: null,
            targetSuggestion: 0
        };

        this.boldQuerystring = this.boldQuerystring.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.populateSuggestions = this.populateSuggestions.bind(this);
        this.showHideSuggestions = this.showHideSuggestions.bind(this);
    }

    // maybe componentWillUpdate to check for prop changes

    boldQuerystring(schoolName) {
        // Expression matches only the first instance of string, disregards case
        let regExp1 = new RegExp(`${this.state.queryString}`, 'i');
        return schoolName.replace(regExp1, `<b>$&</b>`);
    }

    onInputChange(event) {
        let queryString = event.target.value,
            searchURL = 'http://niche-recruiting-autocomplete.appspot.com/search/?query=';

        // Necessary to pass component context to callback
        let self = this;

        // Utility makes request with input field text as query
        // Only acts on the data if results are returned
        JSONPUtil.LoadJSONP(searchURL + queryString, function (response, context) {
            if (response.results) {
                self.setState({ results: response.results });
            }
        });
    
        this.setState({ queryString });
    }

    onKeyDown(event) {
        if (this.state.results) {
            const targetSuggestion = this.state.targetSuggestion,
                totalSuggestions = this.state.results.length - 1;

            // Enter - close box, select item, navigate to URL
            if (event.keyCode === 13) {
                this.setState({ showSuggestions: false });
                window.location.href = this.state.results[targetSuggestion].url;
            } 
            // Up
            else if (event.keyCode === 38) {
                // No further navigation, top of the list
                if (targetSuggestion === 0) {
                    return;
                }

                this.setState({ targetSuggestion: targetSuggestion - 1 });
            } 
            // Down 
            else if (event.keyCode === 40) {
                // No further navigation, bottom of the list
                if (targetSuggestion === totalSuggestions) {
                    return;
                }

                this.setState({ targetSuggestion: targetSuggestion + 1 });
            }
        }
    }

    populateSuggestions(results) {
        let suggestions = [];

        results.forEach((resultObject, index) => {
            // Check to see if user has navigated to item via keyboard
            let classNames = index === this.state.targetSuggestion ? 'suggestion target-suggestion' : 'suggestion';
            console.log('populate');
            suggestions.push(
                <li onClick={() => window.location.href = resultObject.url } 
                    className={classNames} key={index}>
                    <div className="school-name">
                        <span dangerouslySetInnerHTML={{__html:this.boldQuerystring(resultObject.name)}}/>
                    </div><br/>
                    <div className="school-location">{resultObject.location}</div>
                </li>
            );
        });

        return suggestions;
    }

    showHideSuggestions() {
        this.setState({
            showSuggestions: !this.state.showSuggestions,
            targetSuggestion: 0
        });
    }
    
    render() {
        let suggestions = [];
        console.log('render');
        console.log(this.state.targetSuggestion);
        if (this.state.results) {
            console.log('suggestions');
            suggestions = this.populateSuggestions(this.state.results);
        }

        return (
            <div className="autocomplete-field">
                <input className="search-input" 
                    onBlur={this.showHideSuggestions}
                    onChange={this.onInputChange}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.showHideSuggestions}/>
                <img className="search-icon" src={searchIcon} alt="searchglass"/>
                { this.state.showSuggestions &&
                <div className="suggestions-block">
                    <ul className="suggestions-list">
                        {suggestions}
                    </ul>
                </div>
                }
            </div>
        );
    }
}