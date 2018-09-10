import React, { Component } from "react";
import "./accodion.css";

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      filters: []
    };
  }
  selectFold = foldNum => {
    const current = this.state.active === foldNum ? -1 : foldNum;
    this.setState(() => ({ active: current }));
  };
  handleSetFilter=flt=> {
    this.setState({ filters: flt }, () => {
      this.props.filters(flt);
    });
  }
  handleClearFilter=(name, prop)=> {
    if ((typeof name === "string" || name instanceof String) && name) {
      let filterArray = this.state.filters.filter(rec => {
        return !(rec.name === name && rec.filterName === prop);
      });
      this.setState({ filters: filterArray }, () => {
        this.props.filters(this.state.filters, 1);
      });
    } else {
      this.setState({ filters: [] }, () => {
        this.props.filters(this.state.filters, 1);
      });
    }
  }
  render =()=> {
    let data = this.props.data;
    let refinedSection = null;
    if (this.state.filters.length > 0) {
      refinedSection = (
        <div className="filter-accordion_filter">
          <div className="filter-accordion_filter_refined">Refined By:</div>
          {this.state.filters.map((rec, i) => {
            return (
              <span key={i} className="filter-accordion_filter_text">
                {rec.filterName}
                <span onClick={() =>this.handleClearFilter(rec.name, rec.filterName)}
                  className="filter-accordion_filter_cross">
                  x
                </span>
              </span>
            );
          })}
          <span
            className="filter-accordion_filter_clear" onClick={this.handleClearFilter}>
            CLEAR FILTERS
          </span>
        </div>
      );
    }

    return (
      <section className="filter-accordion">
        <div>{refinedSection}</div>
        <div className="filter-accordion_accordion-content">
          {data.map((record, i) => {
            return (
              <Fold
                key={i}
                content={record}
                handle={() => this.selectFold(i)}
                active={i === this.state.active}
                setFilter={p => this.handleSetFilter(p)}
                filters={this.state.filters}
              />
            );
          })}
        </div>
      </section>
    );
  }
}

class Fold extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: props.content,
      filters:props.filters
    };
  }
  
  handleSetFilter(name, filter) {
    let filters = this.state.filters;
    filters.push({ name: name, filterName: filter });
    this.props.setFilter(filters);
    this.setState();
  }
  render() {
    let data = this.state.data;
    let list = null;
    if (this.props.active) {
      list = data.facet.map((rec, i) => {
        return (
          <li key={i}>
            <button
              onClick={() => this.handleSetFilter(data.name, rec.key)}
              className="filter-accordion_fold_btn filter-accordion_fold_text"
            >
              {" "}
              {rec.key} ({rec.count})
            </button>
          </li>
        );
      });
    }

    return (
      <div className="filter-accordion_fold">
        <button
          className={`filter-accordion_fold_trigger ${this.props.active ? "open" : ""}`}
          onClick={this.props.handle} >
          {data.name}
        </button>
        <div
          key="content"
          className={`filter-accordion_fold_content ${this.props.active ? "open" : ""}`}>
          <ul className="filter-accordion_fold_ul">{list}</ul>
        </div>
      </div>
    );
  }
}

export default Accordion;
