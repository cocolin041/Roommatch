import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class House extends Component {
  //get
  listAll = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        var result = `${data.map(p => `
          <div class="list">
            <div>Address: <span>${p.Address}</span></div>
            <div>Price: <span>${p.Price}</span></div>
            <div>Type: <span>${p.Type}</span></div>
            <div>Rooms Available: <span>${p.Availability}</span></div>
            <div>Pet allowed: <span>${p.Pet}</span></div>
            <div>Smoke allowed: <span>${p.Smoke}</span></div>
            <div>Gender accepted: <span>${p.Gender}</span></div>
            <img src=${p.img} height="500" width="500"/>
          </div>`)}`;
        document.getElementById("listAll").innerHTML = result;
        document.getElementById("listAll").style.display = "flex";
        document.getElementById("listAll").style.flexWrap = "wrap";
      }
    };
    //get
    xhttp.open("GET", "http://localhost:3002/house", true);
    xhttp.send();
  };
  //search
  search = () => {
    let price = document.querySelectorAll("input[name='range']");
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      // document.getElementById("result").innerHTML = this.responseText;
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        var result = `${data.map(p => `
          <div class="result">
            <div>Address: <span>${p.Address}</span></div>
            <div>Price: <span>${p.Price}</span></div>
            <div>Type: <span>${p.Type}</span></div>
            <div>Rooms Available: <span>${p.Availability}</span></div>
            <div>Pet allowed: <span>${p.Pet}</span></div>
            <div>Smoke allowed: <span>${p.Smoke}</span></div>
            <div>Gender accepted: <span>${p.Gender}</span></div>
            <img src=${p.img} height="500" width="500"/>
          </div>`)}`;
        document.getElementById("resultAll").innerHTML = result;
        document.getElementById("resultAll").style.display = "flex";
        document.getElementById("resultAll").style.flexWrap = "wrap";
      }
    };
    xhttp.open("POST", "http://localhost:3002/search", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let searchPrice = {
      "from": price[0].value, 
      "to": price[1].value
    };
    xhttp.send(JSON.stringify(searchPrice));
  };

  //searchGender
  searchGender = () => {
    let gender = document.getElementsByClassName("gender")[0];
    let genderAccept = document.getElementsByClassName("gender-accept")[0];
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        var result = `${data.map(p => `
          <div class="result">
            <div>UserName: <span>${p.UserName}</span></div>
            <div>Gender: <span>${p.Gender}</span></div>
            <div>GenderAccepted: <span>${p.GenderAccept}</span></div>
            <div>Price: <span>${p.PriceLower}~${p.PriceUpper}</span></div>
            <div>Require Private BathRoom: <span>${p.Bathroom}</span></div>
            <div>RoomNeed: <span>${p.RoomNeed}</span></div>
            <div>Smoke: <span>${p.Smoke}</span></div>
            <div>Pet: <span>${p.Pet}</span></div>
          </div>`)}`;
        document.getElementById("genderresult").innerHTML = result;
        document.getElementById("genderresult").style.display = "flex";
        document.getElementById("genderresult").style.flexWrap = "wrap";
      }
    };
    xhttp.open("POST", "http://localhost:3002/searchGender", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let searchGender = {
      "gender": gender.value, 
      "genderAccept": genderAccept.value
    };
    xhttp.send(JSON.stringify(searchGender));
  };

  render() {
    this.listAll();
    return (
      <div>
        <div class="nav">
          <ul>
            <li>House</li>
            <li><Link to="/user">User</Link></li>
          </ul>
        </div>
        <div>
          <div class="search">
            <h2>Search Apartment by price...</h2>
            <div>From<input type="number" name="range" />To<input type="number" name="range"/></div>
            <button type="button" onClick={this.search}>Search!</button>
            <div id="resultAll"></div>
          </div>

          <div class="search">
            <h2>Search roommate by Gender...</h2>
            <select class="gender">
              Roommate Gender
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <select class="gender-accept">
              His/Her Accept Gender
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="N">Male/Female</option>
            </select>
            <button type="button" onClick={this.searchGender}>Search!</button>
            <div id="genderresult"></div>
          </div>

          <div class="house-info">
            <h2>See All House Information</h2>
            <div id="listAll">
                <button type="button" onClick={this.listAll}>Get data</button>
            </div>
          </div>

        </div>
      </div>
    )
  }

}

export default House
