import React from 'react';

import '../styles/Autocomplete.scss';
import { JSONPUtil } from '../resources/JSONPUtil';
import searchIcon from '../resources/search.svg';
import { strict } from 'assert';

export default class Autocomplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            queryString: null,
            showSuggestions: false,
            suggestions: null
        };

        this.boldQuerystring = this.boldQuerystring.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.populateSuggestions = this.populateSuggestions.bind(this);
        this.showHideSuggestions = this.showHideSuggestions.bind(this);
    }

    // maybe componentWillUpdate to check for prop changes

    populateSuggestions(results) {
        let suggestions = [];

        results.forEach((resultObject, index) => {
            suggestions.push(
                <li onClick={() => window.location.href = resultObject.url } className="suggestion" key={index}>
                    <div className="school-name">{this.boldQuerystring(resultObject.name)}</div><br/>
                    <div className="school-location">{resultObject.location}</div>
                </li>
            );
        });

        this.setState({ suggestions });
    }

    boldQuerystring(schoolName) {
        let regEx = new RegExp(this.state.queryString, 'g');
        return schoolName.replace(regEx, `<b>${this.state.queryString}</b>`);
    }

    onInputChange(event) {
        let queryString = event.target.value,
            searchURL = 'http://niche-recruiting-autocomplete.appspot.com/search/?query=';

        // Necessary to pass component context to callback
        let self = this;

        JSONPUtil.LoadJSONP(searchURL + queryString, function (response, context) {
            if (response.results) {
                self.populateSuggestions(response.results);
            }
        });
    
        this.setState({ queryString });
    }

    showHideSuggestions() {
        console.log('show hide');
        this.setState({
            showSuggestions: !this.state.showSuggestions
        });
    }
    
    render() {
        return (
            <div className="autocomplete-field">
                <input className="search-input" 
                    onBlur={this.showHideSuggestions}
                    onChange={this.onInputChange}
                    onFocus={this.showHideSuggestions}/>
                <img className="search-icon" src={searchIcon} alt="searchglass"/>
                <div className="suggestions-block">
                    { true &&
                        <ul className="suggestions-list">
                            {this.state.suggestions}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}