import React from "react";
import AsyncSelect from "react-select/lib/Async";

// Import self-designed component
import history from "@/components/History";

// Import self-designed css style
import cssobj from "@/stylesheet/search-cmpt.scss";

// Search bar component
export default class SearchCmpt extends React.Component {
    constructor(props) {
        super(props);

        // Initialize the state
        this.state = {
            inputValue: ""
        };
    }

    handleInputChange = (newValue) => {
        const inputValue= newValue.replace(/\W/g, "");
        this.setState({ 
            inputValue
        });
        return inputValue;
    };

    handleChange = (newValue) => {
        if (!this.isArray(newValue)) {
            history.push({
                pathname: '/search',
                search: `?q=${newValue.value}`
            });
        }
    }

    // Remove the undefined search query
    isArray(query){
        return (Object.prototype.toString.call(query) === "[object Array]");
    }


    // Render the search bar component
    render() {
        return (
            <AsyncSelect
                className={cssobj["search-bar"]}
                loadOptions={this.loadOptions}
                onInputChange={this.handleInputChange}
                onChange={this.handleChange}
                placeholder={this.props.value? this.props.value: "Enter keyword ..."}
                value={this.props.value}
                noOptionsMessage={() => "No match"}
            />
        );
    }
    
    loadOptions = (inputValue, callback) => {
        if (inputValue === "") {
            return callback([]);
        }
        // Auto suggest
        this.requestAutoSuggest(inputValue, function (options) {
            // Remove the repeated element that is same as the inputValue
            let autoSuggestOptions = [{value: inputValue, label: inputValue}];
            options.forEach((item, index) => {
                if (item.value !== inputValue) {
                    autoSuggestOptions.push(item);
                }
            });

            callback(autoSuggestOptions);
        })
    };

    requestAutoSuggest = (value, callback) => {
        try {
            fetch(
                `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=${value}`, 
                { 
                    headers: { 
                        "Ocp-Apim-Subscription-Key": "f04230ca181441d1b0a65238010943df"
                    }
                }
            ).then((response) => {
                return response.json();
            })
            .then((data) => {
                const rawResults = data.suggestionGroups[0].searchSuggestions;
                const options = rawResults.map((option) => {
                    return {value: option.displayText, label: option.displayText};
                })
                
                callback(options);
            })
        } 
        catch (error) {
            console.error(`Error: Fetching auto-suggest ${value}`);
        }
    }
}