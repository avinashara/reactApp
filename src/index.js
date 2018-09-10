import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Accordion from './component/accodion';
import Search from './component/search';
import Result from './component/result';
import axios from 'axios';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      facets: [],
      summary: {},
      filters: [],
      results: [],
      pageNo: 1,
      limit: 20
    };
  }

  handleBackend=query=> {
    axios.get(`http://localhost:3000/searchResult?${query}`).then(res => {
      let data = res.data;
      this.setState({
        facets: data.facets,
        summary: data.resultsSummary,
        results: data.results
      })
    });
  }
  handleSearch=prop=> {
    let query = '',state=this.state;
    this.state.filters.forEach(data => {
      query += `${data.name}=${data.filterName}&`;
    });
    query += `pageNo=${state.pageNo}&limit=${state.limit}&text=${prop}`;
    this.handleBackend(query);
    this.setState({
      searchText: prop
    });
  }
  handleFilters=(filters, clear)=> {
    let query = '',state=this.state;
    filters.forEach(data => {
      query += `${data.name}=${data.filterName}&`;
    });
    query += `pageNo=${state.pageNo}&limit=${state.limit}&text=${state.searchText}`;
    this.handleBackend(query);
    this.setState({
      filters
    });
  }
  handleLimitChange =obj=> {
    let query = '',state=this.state;
    state.filters.forEach(data => {
      query += `${data.name}=${data.filterName}&`;
    });
    query += `pageNo=${obj.pageNo}&limit=${obj.limit}&text=${state.searchText}&sort=${obj.sort}`;
    this.handleBackend(query);
    this.setState({
      pageNo: obj.pageNo,
      limit: obj.limit
    });
  }
  render=()=> {
    let searchResult = null,state=this.state;
    if (state.facets.length > 0) {
      searchResult = <React.Fragment>
        <section className = "filter-area" >
        <Accordion data = {this.state.facets}
      filters = {
        (p, q) => this.handleFilters(p, q)
      }/>
       </section >
      <section className = "search-result" >
        <Result results = {{
                  summary: state.summary,
                  results: state.results
                }}
                limitChange = {(limit) => this.handleLimitChange(limit)}/>
        </section >
        </React.Fragment>
    }
    return ( <section className = "search-container" >
                <section className = "search-header" >
                    <Search searchText = {(p) => this.handleSearch(p)}/> 
                </section > 
                  {searchResult}
              </section>)
  }
}
ReactDOM.render( <App /> , document.getElementById('root'));