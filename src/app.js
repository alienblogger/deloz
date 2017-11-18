//Import NPM Packages
import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";

//Import Modules & Components
import Card from "./components/card.js";
import SortingFields from "./containers/sorting-fields.js";

//Main
class App extends Component {
  //Init base url
  constructor(props) {
    super(props);
    this.baseUrl = "https://api.github.com";
  }

  //Define State
  state = {
    searchTerm: "",
    searchError: "",
    cardData: [],
    nothingReceived:false,
    availSort: ["stars", "forks", "updated"],
    makeSort: ["name", "created_at", "score", "watchers"],
    loading: false,
    sortField: "name",
    sortOrder: {
      name: "asc"
    },
    page:1
  };

  //Handle Search Bar Input
  handleInput = e => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      searchTerm: value
    });
  };

  //Handle Key Press for Enter Key
  handleEnter = e => {
    if (e.key === "Enter") {
      this.search(this.state.searchTerm);
    }
    return;
  };

  //Get data from URL, and send Data to CB
  axget = (url, cb) => {
    let data = [];
    this.setState({
      loading: true,
      nothingReceived:false
    });
    const self = this;
    axios
      .get(url)
      .then(function(resp) {
        if(resp.data.items.length===0){
          self.setState({
            nothingReceived:true
          });
        }
        data = resp.data.items;
        cb(data);
      })
      .catch(function(err) {
        self.setState({
          loading: false,
          cardData: [],
          searchError: err.message,
          nothingReceived:false
        });
      });
  };

  //Execute Search
  search = () => {
    const {
      searchTerm,
      sortField,
      availSort,
      makeSort,
      sortOrder,
      page
    } = this.state;
    let url = this.baseUrl + "/search/repositories?page="+page+"&q=" + searchTerm;
    const self = this;
    if(!searchTerm){
      return;
    }
    if (availSort.includes(sortField)) {
      url += "&sort=" + sortField + "&order=" + sortOrder[sortField];
    } else if (makeSort.includes(sortField)) {
      this.manualSort(url, sortField, sortOrder[sortField]);
      return;
    } else {
      return;
    }
    this.axget(url, function(data) {
      self.setState({
        cardData:data,
        loading:false
      });
    });
  };

  //Manual Sort non Github API parameters

  manualSort = (url, sort, order) => {
    let sorted = [];
    self = this;
    this.axget(url, function(data) {
      sorted = data.sort((a, b) => {
        if (typeof a[sort] === "string" && typeof b[sort] === "string") {
          return a[sort].toLowerCase() - b[sort].toLowerCase();
        }
        return a[sort] - b[sort];
      });
      if (order === "asc") {
        self.setState({
          cardData:sorted,
          loading:false
        });
      } else {
        self.setState({
          cardData:sorted.reverse(),
          loading:false
        });
      }
    });
  };

  //Set Sorting State
  sortBy = e => {
    const target = e.target;
    const value = this.getSortType(target.innerHTML);
    this.setState(
      {
        sortField: value,
        sortOrder: {
          [value]:
            this.state.sortOrder[value] && this.state.sortOrder[value] === "asc"
              ? "desc"
              : "asc"
        }
      },
      function() {
        this.search();
      }
    );
  };

  //Load Next set of data
  changePage = (op) => {
    let val = op==="add"?this.state.page+=1:this.state.page-=1;
    this.setState({
      page:val
    });
    this.search();
  }

  //Get the Sorting Field value for Search Query

  getSortType = str => {
    if (str === "Created Date") {
      let a = str.split(" ");
      a[1] = "at";
      a = a.join("_");
      return a.toLowerCase();
    }
    let words = str.split(" ");
    let sortType = "";
    if (words[1] === "Date") {
      words[1] = "";
    }
    sortType = words.join("");
    return sortType.toLowerCase();
  };

  render() {
    const { cardData,nothingReceived, searchError, loading, sortOrder, sortField } = this.state;
    console.log(nothingReceived);
    let cards = [];
    if (cardData && cardData.length > 0) {
      cards = cardData.map(card => <Card key={card.id} data={card} />);
    }

    //Card Container Elem
    const cardContainer = <div className="card-container flex-3">{cards}</div>;

    //Sorting Arrow Icons
    const upArrow = <i className="fa fa-arrow-up"></i>
    const downArrow = <i className="fa fa-arrow-down"></i>;

    //No Response/Error Received
    const nonRecv = <div className="fourOFour">{searchError?searchError:"Nothing to show"}</div>

    //Sorting Fields Container
    const sortContainer = (
      <div className="sort-container flex flex-1 margin-top-26 flex-col">
        <div className="sort-element">
          <span>{sortOrder[sortField]==='asc'?downArrow:upArrow}</span><span className="font-700 margin-left-4">Sort</span>{" "}
        </div>
        <SortingFields
          data={[
            "Name",
            "Stars",
            "Watchers",
            "Created Date",
            "Updated Date",
            "Score"
          ]}
          styleClass="sort-element hover-black"
          activeItem={this.state.sortField}
          activeClass="sort-item-active"
          order={sortOrder}
          onClickHandler={this.sortBy}
        />
      </div>
    );

    //Progress Spinner
    const loader = (
      <div className="loading">
        <i className="fa fa-spin fa-spinner" />
      </div>
    );

    //Pagination
    const pagination = (
      <div className="pagination flex">
          <div onClick={()=>this.changePage('sub')}>
            {this.state.page>1?<i className="fa fa-chevron-left"></i>:null}
          </div>
          <div className="page-number">
            {this.state.page}
          </div>
          <div onClick={()=>this.changePage('add')}>
            {cardData.length===30?<i className="fa fa-chevron-right"></i>:null}
          </div>
        </div>
      )

    return (
      <div className="app-container">
        <div className="searchbar">
          <input
            type="text"
            onKeyPress={this.handleEnter}
            onChange={this.handleInput}
            value={this.state.searchTerm}
            placeholder="Search for a Repo"
          />
        </div>
        {!loading && cardData.length>0?pagination:null}
        <div className="container">
          {cardData.length > 0 ? sortContainer : null}
          {loading ? loader : cardContainer}
        </div>
        {searchError||nothingReceived?nonRecv:null}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
