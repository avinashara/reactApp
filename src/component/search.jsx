import React, { Component } from "react";
import "./search.css";
import axios from "axios";
import Autosuggest from 'react-autosuggest';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      suggestions: []
    };
  }

  handleSearchTextChange =(event, { newValue }) => {
    this.setState({
      searchText: newValue
    });
  };

  fetchSuggestion=data =>{
    let value=data.value.toLowerCase();
    if (value.length >= 2) {      
      axios.get("http://localhost:3000/sug").then(rec => {
        let fetchedData=rec.data.filter(rec=>{
          return rec.suggestion.toLowerCase().indexOf(value)>=0?true:false;
        });
        this.setState({ suggestions: fetchedData });
      });
    }
  }
  getSuggestionValue=data=>{
    let value=data.suggestion;
    this.props.searchText(value);
    return value.toString();
  }
  clearSuggestions = () => {this.setState({suggestions: []})};
  renderSuggestion =(data) => {return (<span>{data.suggestion}</span>)};
  render() {
    let {searchText, suggestions}=this.state;  
    const inputProps = {
      placeholder: 'Search',
      value:searchText,
      onChange: this.handleSearchTextChange
    };
    return (
      <section className="search">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.fetchSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionsClearRequested={this.clearSuggestions}
        inputProps={inputProps}
      />    
      <button className="search_btn"
          onClick={() => this.props.searchText(this.state.searchText)}>
          <span className="search_text_btn">Search &ensp; > </span>
        </button>
      </section>
    );
  }
}
export default Search;
