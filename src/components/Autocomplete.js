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
            showAltStyle: props.styleTwoEnabled,
            showSuggestions: false,
            targetSuggestion: 0
        };

        this.boldQuerystring = this.boldQuerystring.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.populateSuggestions = this.populateSuggestions.bind(this);
        this.showHideSuggestions = this.showHideSuggestions.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.styleTwoEnabled !== prevProps.styleTwoEnabled) {
            this.setState({ showAltStyle: this.props.styleTwoEnabled })
        }
    }

    boldQuerystring(schoolName) {
        // Expression matches only the first instance of string, disregards case
        const regExp1 = new RegExp(`${this.state.queryString}`, 'i');
        return schoolName.replace(regExp1, `<b>$&</b>`);
    }

    onInputChange(event) {
        const queryString = event.target.value,
              searchURL = 'http://niche-recruiting-autocomplete.appspot.com/search/?query=';

        // Necessary to pass component context to callback
        const self = this;

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
            let targetSuggestion = this.state.targetSuggestion;
            const totalSuggestions = this.state.results.length - 1;

            // Enter key - close box, select item, navigate to URL
            if (event.keyCode === 13) {
                this.setState({ showSuggestions: false });
                this.onSelect(targetSuggestion);
            } 
            // Up key
            else if (event.keyCode === 38) {
                // No further navigation, top of the list
                if (targetSuggestion === 0) {
                    return;
                }

                targetSuggestion = targetSuggestion - 1;
                this.setState({ targetSuggestion });
            } 
            // Down key
            else if (event.keyCode === 40) {
                // No further navigation, bottom of the list
                if (targetSuggestion === totalSuggestions) {
                    return;
                }

                targetSuggestion = targetSuggestion + 1;
                this.setState({ targetSuggestion });
            }

            // If there are suggestions, adjust scroll of list if necessary
            if (this.refs[`suggestion${targetSuggestion}`]) {
                const liHeight = this.refs[`suggestion${targetSuggestion}`].clientHeight,
                      suggestionsBlock = this.refs.suggestionsBlock;

                // Represents the y value at which the block ends 
                const blockEnd = suggestionsBlock.scrollTop + suggestionsBlock.clientHeight;
                // Multiplying the current target by height provides y value of element
                const suggestionPosition = liHeight * targetSuggestion;

                // If element is positioned above or below the view the top of the block
                // should be set to the position of that element
                if (suggestionPosition < suggestionsBlock.scrollTop || (suggestionPosition + (liHeight*2)) > blockEnd) {
                    suggestionsBlock.scrollTop = suggestionPosition;
                }
            }
        }
    }

    onMouseOver(index) {
        // Allows target suggestion to be updated if mouse hovers over element
        this.setState({ targetSuggestion: index });
    }
    
    onSelect(index) {
        // Navigate to URL on selection
        window.location.href = this.state.results[index].url;
    }

    populateSuggestions(results) {
        let suggestions = [];

        results.forEach((resultObject, index) => {
            // Check to see if user has navigated to item via keyboard
            const classNames = index === this.state.targetSuggestion ? 'suggestion target-suggestion' : 'suggestion',
                  id = 'suggestion' + index;
      
            suggestions.push(
                <li ref={id}
                    onMouseDown={() => this.onSelect(index)} 
                    onMouseOver={() => this.onMouseOver(index)} 
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
            showSuggestions: !this.state.showSuggestions
        });
    }
    
    render() {
        let suggestions = [];
        const classNames = this.state.showAltStyle ?  'autocomplete-field alternate-styling' : 'autocomplete-field';

        if (this.state.results) {
            suggestions = this.populateSuggestions(this.state.results);
        }

        return (
            <div className={classNames}>
                <input className="search-input" 
                    onBlur={this.showHideSuggestions}
                    onChange={this.onInputChange}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.showHideSuggestions}/>
                <img className="search-icon" src={searchIcon} alt="searchglass"/>
                { this.state.showSuggestions && suggestions.length > 0 &&
                <div ref="suggestionsBlock" className="suggestions-block">
                    <ul className="suggestions-list">
                        {suggestions}
                    </ul>
                </div>
                }
            </div>
        );
    }
}