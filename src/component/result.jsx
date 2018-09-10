import React, { Component } from "react";
import "./result.css";
class Result extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      limit: this.props.results.summary.limit,
      sort: "rel",
      pages: 10,
      active: 1,
      results: []
    };
  }
  handleLimitChange=e=> {
    let limit=e.target.value
    this.setState({ limit: limit });
    this.props.limitChange({
      limit: limit,
      pageNo: this.state.active,
      sort: this.state.sort
    });
  }
  handleSort=type=> {
    this.setState({ sort: type });
    this.props.limitChange({
      limit: this.state.limit,
      pageNo: this.state.active,
      sort: type
    });
  }
  createPagination=()=> {
    let pages = [],
      summary = this.props.results.summary,
      activePage = this.state.active,
      limit = this.state.limit;
    let start = 1;
    if (activePage * limit <= summary.total) {
      if (activePage >= 10) {
        start = activePage - 20 > 0 ? activePage - 8 : activePage - 4;
      }
    }
    let end = Math.ceil(summary.total / summary.limit);
    if (end > start - 1 + 10) {
      end = start - 1 + 10;
    }
    for (let i = start; i <= end; i++) {
      pages.push(
        <section key={i} className={i === this.state.active?"search-pagination_yes":"search-pagination_no"}
          onClick={this.handlePageChanges}>
          {i}
        </section>
      );
    }
    return pages;
  }
  handlePageChanges=page=> {
    this.setState({ active: +page["target"].innerText }, () => {
      this.props.limitChange({
        limit: this.state.limit,
        pageNo: this.state.active,
        sort: this.state.sort
      });
    });
  }
  handlePrevious=pre=> {
    let newActive = pre ? this.state.active - 1 : this.state.active + 1;
    this.setState({ active: newActive });
    this.props.limitChange({
      limit: this.state.limit,
      pageNo: newActive,
      sort: this.state.sort
    });
  }
  render =()=> {
    let result = this.props.results;
    let start = (this.state.active - 1) * this.state.limit + 1;
    let end = start - 1 + result.results.length;
    return (
      <React.Fragment>
        <section className="search-filter">
          <section className="search-filter_sort">
            <span>
              Sort By:
              <span onClick={() => this.handleSort("rel")}
                  className={this.state.sort === "rel" ? "search-filter_sort_true" : null}>
                {" "} Relevance
              </span>{" "}|
              <span
                onClick={() => this.handleSort("asc")}
                className={this.state.sort === "asc" ? "search-filter_sort_true" : null}>
                {" "}Newest
              </span>{" "}|
              <span onClick={() => this.handleSort("desc")}
                className={this.state.sort === "desc" ? "search-filter_sort_true" : null}>
                {" "}Oldest
              </span>
            </span>
          </section>
          <section className="search-filter_rec-limit">
            <select value={this.state.limit}
              onChange={this.handleLimitChange}
              className="search-filter_res-sel">
              <option value="20">20 Results Per Page</option>
              <option value="100">100 Results Per Page</option>
              <option value="All">All Results Per Page</option>
            </select>
          </section>
          <section className="search-filter_page-no">
            <div style={{ width: "max-content" }}>
              {start} - {end} of {result.summary.total} Results
            </div>
          </section>
        </section>

        <hr className="search-seperator" />

        <div className="jp-featureItem__desktop">
          {result.results.map((ele, i) => {
            return (
              <React.Fragment key={i}>
                <div className="jp-featureItem__container">
                  <a href={ele.url}>
                    <div className="jp-featureItem__container__iconarea">
                      <img
                        src="${contentImage}"
                        className="jp-featureItem__container__image"
                      />
                      <i className="jp-featureItem__container__iconimage circleButtonGrey" />
                    </div>
                  </a>
                  <div className="jp-featureItem__container__data">
                    <a
                      className="jp-featureItem__container__data__title"
                      href={ele.url}
                    >
                      {ele.title}
                    </a>
                    <div className="jp-featureItem__container__data__contributor">
                      <a href={ele.url} />
                    </div>
                    <p className="jp-featureItem__container__data__date">
                      {ele.date}
                    </p>
                    <p className="jp-featureItem__container__data__content">
                      {ele.description}
                    </p>
                  </div>
                  <div className="jp-featureItem__container__breadcrumb">
                    <li>
                      <span className="jp-featureItem__container__breadcrumb__emailIcon" />
                      <a
                        href="${mailToLink}"
                        className="jp-featureItem__container__breadcrumb__data"
                      />
                    </li>

                    <li>
                      <span className="jp-featureItem__container__breadcrumb__downloadIcon" />
                      <a
                        href="${contentPath}"
                        download="${downloadName}"
                        className="jp-featureItem__container__breadcrumb__data"
                      />
                    </li>

                    <li>
                      <span className="jp-featureItem__container__breadcrumb__lockIcon" />
                      <a
                        href="#"
                        className="jp-featureItem__container__breadcrumb__data"
                      />
                    </li>
                    <li>
                      <span className="jp-featureItem__container__breadcrumb__lockIcon" />
                      <a
                        href="#"
                        className="jp-featureItem__container__breadcrumb__data"
                      />
                    </li>
                  </div>
                </div>
                <hr className="jp-featureItem__horrizontalRow" />
              </React.Fragment>
            );
          })}
        </div>
        <section className="search-pagination">
          <div
            className={this.state.active > 1? "search-pagination_no": "search-pagination_no disable"}
            onClick={() => this.handlePrevious(true)}>
            <span>&#60;</span>
          </div>
          {this.createPagination()}
          <div
            className={this.state.active <Math.ceil(result.summary.total / result.summary.limit)? "search-pagination_no": "search-pagination_no disable"}
            onClick={() => this.handlePrevious(false)}>
            <span>&#62;</span>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Result;
