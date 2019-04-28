import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div class="nav">
      <ul>
        <li><Link to="/">House</Link></li>
        <li>User</li>
      </ul>
    </div>
  )
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: '',
      gender: ''
    };
    this.searchUser = this.searchUser.bind(this);
  };

  searchUser() {
    let username = document.querySelector("input[name='username']");
    let user = username.value;
    let xhttp = new XMLHttpRequest();
    var component = this;

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let data = JSON.parse(this.responseText);
        if (data.length > 0) {
          component.setState({
            isLoggedIn: true,
            username: data[0].UserName,
            post: data[0].Post,
            gender: data[0].Gender
          });
        } else {
          component.setState({
            username: user
          });
        }
      }
    };
    xhttp.open("GET", "http://localhost:3002/user/" + user, true);
    xhttp.send();
  };
  render () {
    return (
      <div class="user">
        {this.state.username === '' ? (
          <div>
            Enter Username:<input type="text" name="username"/>
            <button type="button" onClick={this.searchUser}>login</button>
          </div>
        ) : (
          <div>
            {this.state.isLoggedIn ? (
              <div>
                <h2>Your Post</h2>
                <Posted name={this.state.username} post={this.state.post} gender={this.state.gender}/>
              </div>
            ) : (
              <Post name={this.state.username}/>
            )}
          </div>
        )}
      </div>
    )
  }
}; 
//show your post, if the you already posted
class Posted extends React.Component {
// function Posted(props) {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      renderPost: false,
      editing: false,
      oldHouse: {}
    };
    this.renderPost = this.renderPost.bind(this);
    this.edit = this.edit.bind(this);
    this.update = this.update.bind(this);
    this.del = this.del.bind(this);
    
  };
  // edit function
  edit = e => {
    this.setState({editing: true});
    let list = e.target.parentElement.parentElement.parentElement;
    let childs = list.children[1].children[0].children[0];
    let house = {
      "Address": childs.children[0].children[0].innerHTML,
      "Price": childs.children[1].children[0].innerHTML,
      "Type": childs.children[2].children[0].innerHTML,
      "Availability": childs.children[3].children[0].innerHTML,
      "img": childs.children[4].children[0].src,
      "Pet": childs.children[5].children[0].innerHTML,
      "Smoke": childs.children[6].children[0].innerHTML,
      "GenderAccept": childs.children[7].children[0].innerHTML
    };
    var editing = `
          <div class="list">
            <div>Address: <input type="text" name="edit-address" value="${house.Address}"/></div>
            <div>Price: <input type="number" name="edit-price" value="${house.Price}" /></div>
            <div>Type: <input type="text" name="edit-type"  placeholder="2B1B" value="${house.Type}" /></div>
            <div>Available Spaces: <input type="text" name="edit-available"  placeholder="2b" value="${house.Availability}" /></div>
            <div>Image: <input type="text" name="edit-img" value="${house.img}" /></div>
        </div>`;
    list.children[1].children[0].innerHTML = editing;
    this.setState({oldHouse: house});
  };
  //update
  done = () => {
    let house = {
      "Address": document.querySelector("input[name='edit-address']").value,
      "Price": document.querySelector("input[name='edit-price']").value,
      "Type": document.querySelector("input[name='edit-type']").value
    }
    return house;
  };

  update = () => {
    let newHouse = this.done();
    let House = {
      "newHouse": newHouse
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        // listAll();
      }
    };
    xhttp.open("POST", "http://localhost:3002/update/" + this.props.name, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(House));
    this.setState({editing: false});
  }

  //delete
  del = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        // listAll();
      }
    };
    xhttp.open("DELETE", "http://localhost:3002/delete/" + this.props.name, true);
    xhttp.send(null);
  };

  renderPost = () => {
    if (!this.state.renderPost) {
      let xhttp = new XMLHttpRequest();
      let obj = this;
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          let data = JSON.parse(this.responseText)[0];
          obj.setState({data: data});
          let result;
          if (obj.props.post === "sublease") {
            result = YourHouse(data);
          }
          if (obj.props.post === "roommate") {
            result = YourInfo(data);
          }
          document.getElementsByClassName("list")[0].innerHTML = result;
        }
      };
      if (this.props.post === "sublease") {
        xhttp.open("GET", "http://localhost:3002/house/" + this.props.name, true);
      }
      if (this.props.post === "roommate") {
        xhttp.open("GET", "http://localhost:3002/roommate/" + this.props.name, true);
      }
      xhttp.send();
      this.setState({renderPost: true});
    }
  }
  render() {
    this.renderPost();

    return (
      <div>
        <div class="list"></div>
        {!this.state.editing ? (
          <div>
            <button type="button" onClick={this.edit}>Edit</button>
            <button type="button" onClick={this.del}>Delete</button>
          </div>
        ) : (
          <div>
            <button type="button" onClick={this.update}>Done</button>
          </div>
        )}
        <div>
          <h2>Recommendation</h2>
              {this.props.post === "roommate" ? (
                <HouseRecommend data={this.state.data} gender={this.props.gender} name={this.props.name}/>
              ):(
                <PersonRecommend data={this.state.data} gender={this.props.gender} name={this.props.name}/>
              )}
        </div>
        <div>
          <h2>myFavorate</h2>
          <Favorate name={this.props.name}/>
        </div>
      </div>
    );
  }
};
function Favorate(props) {
  let dislike = (e) => {
    let owner = e.target.nextElementSibling.children[0].innerHTML;
    let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          // let data = JSON.parse(this.responseText);
        }
      };
      xhttp.open("DELETE", "http://localhost:3002/myfavorate/"+props.name, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      let myFavorate = {
        "UserName": props.name,
        "Owner": owner
      };
      xhttp.send(JSON.stringify(myFavorate));
  };
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let myfavorate = JSON.parse(this.responseText);
      let result = `${myfavorate.map(p => `
          <div>
            <button class="dislike">DisLike</button>
            <div>UserName: <span>${p.OwnerName}</span></div>
            <div>Owner Gender: <span>${p.Gender}</span></div>
            <div>Address: <span>${p.Address}</span></div>
            <div>Price: <span>${p.Price}</span></div>
            <div>Type: <span>${p.Type}</span></div>
            <div>Rooms Available: <span>${p.Availability}</span></div>
            <div>Pet allowed: <span>${p.Pet}</span></div>
            <div>Smoke allowed: <span>${p.Smoke}</span></div>
            <div>Gender accepted: <span>${p.GenderAccept}</span></div>
            <img src=${p.img} height="500" width="500"/>
          </div>`)}`;
      document.getElementsByClassName("myfavorate")[0].innerHTML = result;
      document.getElementsByClassName("myfavorate")[0].style.display = "flex";
      document.getElementsByClassName("myfavorate")[0].style.flexWrap = "wrap";
      let dislikebutton = document.getElementsByClassName("dislike");
      Array.prototype.map.call(dislikebutton, p=>p.addEventListener("click", dislike));
    }
  };
  xhttp.open("GET", "http://localhost:3002/myfavorate/" + props.name, true);
  xhttp.send();
  return (
    <div class="myfavorate"></div>
  );
};
//you're subleasing a house, show you house information
function YourHouse(data) {
  return (
    `<div class="list">
      <div>Address: <span>${data.Address}</span></div>
      <div>Price: <span>${data.Price}</span></div>
      <div>Type: <span>${data.Type}</span></div>
      <div>Rooms Available: <span>${data.Availability}</span></div>
      <div><img src=${data.img}/></div>
      <div>Pet allowed: <span>${data.Pet}</span></div>
      <div>Smoke allowed: <span>${data.Smoke}</span></div>
      <div>Gender accepted: <span>${data.GenderAccept}</span></div>
    </div>`)
}
//you're looking for house, show you person information
function YourInfo(data) {
  return (
    `<div class="list">
      <div>Price: <span>${data.PriceLower}~${data.PriceUpper}</span></div>
      <div>Personal Bathroom: <span>${data.Bathroom}</span></div>
      <div>Need:<span>${data.RoomNeed} Rooms</span></div>
      <div>Have Pet: <span>${data.Pet}</span></div>
      <div>Smoke: <span>${data.Smoke}</span></div>
      <div>Gender accepted: <span>${data.GenderAccept}</span></div>
    </div>`)
}
//house recommeded, if you're looking for a house
function HouseRecommend(props) {
  let like = (e) => {
    let owner = e.target.nextElementSibling.children[0].innerHTML;
    let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          // let data = JSON.parse(this.responseText);
        }
      };
      xhttp.open("POST", "http://localhost:3002/myfavorate", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      let myFavorate = {
        "UserName": props.name,
        "Owner": owner
      };
      xhttp.send(JSON.stringify(myFavorate));
  };
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let house = JSON.parse(this.responseText);
      let recommendHouse = filter(house, props.data, props.gender);
      let result = `${recommendHouse.map(p => `
          <div>
            <button class="like">Like</button>
            <div>UserName: <span>${p.UserName}</span></div>
            <div>Gender: <span>${p.Gender}</span></div>
            <div>Address: <span>${p.Address}</span></div>
            <div>Price: <span>${p.Price}</span></div>
            <div>Type: <span>${p.Type}</span></div>
            <div>Rooms Available: <span>${p.Availability}</span></div>
            <div>Pet allowed: <span>${p.Pet}</span></div>
            <div>Smoke allowed: <span>${p.Smoke}</span></div>
            <div>Gender accepted: <span>${p.GenderAccept}</span></div>
            <img src=${p.img} height="500" width="500"/>
          </div>`)}`;
      document.getElementsByClassName("house")[0].innerHTML = result;
      document.getElementsByClassName("house")[0].style.display = "flex";
      document.getElementsByClassName("house")[0].style.flexWrap = "wrap";
      let likebutton = document.getElementsByClassName("like");
      Array.prototype.map.call(likebutton, p=>p.addEventListener("click", like));
    }
  };
  xhttp.open("GET", "http://localhost:3002/housejoin", true);
  xhttp.send();
  return (
    <div class="house"></div>
  );
};

function filter(house, data, gender) {
  let roomNeed = Number(data.RoomNeed);
  let recommendHouse = [];
  house.map(p=>{
    let room = Number((p.Type).charAt(0));
    let available = Number((p.Availability).charAt(0));
    let fill = room - available;
    let bathroomAvg = Number((p.Type).charAt(2)) / room;

    // check room space and gender
    if (available >= roomNeed) {
      if (p.GenderAccept === 'N' || p.GenderAccept === gender) {
        //no one live inside
        if (fill === 0) {
          p.available = true;
        } else {
          if (data.GenderAccept === 'N' || data.GenderAccept === p.Gender) {
            p.available = true;
          }
        }
      }
    }
    // check bathroom
    if (p.available) {
      //no need personal bathroom
      if (data.Bathroom === 0 || (data.Bathroom === 1 && bathroomAvg >= 1)) {
        p.available = true;
      } else {
        p.available = false;
      }
    }
    //check price range
    if (p.available) {
      if (p.Price <= data.PriceUpper) {
        p.available = true;
      } else {
        p.available = false;
      }
    }
    // check pet and smoke
    if (p.available) {
      if (data.Pet === 0 || data.Pet === p.Pet) {
        if (data.Smoke === 0 || data.Smoke === p.Smoke) {
          p.available = true;
          recommendHouse.push(p);
        } else {
          p.available = false;
        }
      } else {
        p.available = false;
      }
    }
  });
  return recommendHouse;
}
//people recommeded, if you have a house
function PersonRecommend(props) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let roommate = JSON.parse(this.responseText);
      let result = `${roommate.map(data => `
          <div>
            <div>UserName: <span>${data.UserName}</span></div>
            <div>Price: <span>${data.PriceLower}~${data.PriceUpper}</span></div>
            <div>Personal Bathroom: <span>${data.Bathroom}</span></div>
            <div>Need:<span>${data.RoomNeed} Rooms</span></div>
            <div>Have Pet: <span>${data.Pet}</span></div>
            <div>Smoke: <span>${data.Smoke}</span></div>
            <div>Gender accepted: <span>${data.GenderAccept}</span></div>
            <button type="button" onClick={edit}>Edit</button>
            <button type="button" onclick="del(event)">Delete</button>
          </div>`)}`;
      document.getElementsByClassName("roommate")[0].innerHTML = result;
    }
  };
  xhttp.open("GET", "http://localhost:3002/roommate", true);
  xhttp.send();
  return (
    <div class="roommate"></div>
  );
};

//fill in post information, if the you haven't posted
class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      houseAns: undefined
    };
    this.myFunction = this.myFunction.bind(this);
  };
  //show you house form / roommate form
  myFunction = () => {
    let houseYes = document.getElementById("houseYes").checked;
    let houseNo = document.getElementById("houseNo").checked;
    if (houseYes) {
      this.setState({houseAns: true});
      if (houseNo) {
        document.getElementById("houseYes").checked = false;
        this.setState({houseAns: false});
      }
    }
    if (houseNo) {
      this.setState({houseAns: false});
      if (houseYes) {
        document.getElementById("houseNo").checked = false;
        this.setState({houseAns: true});
      }
    } 
  }
  //if you're posting a house...
  posthouse = () => {
    let address = document.querySelector("input[name='address']");
    let img = document.querySelector("input[name='img']");
    let gender = document.getElementsByClassName("gender")[0];
    let price = document.querySelector("input[name='price']");
    let type = document.querySelector("input[name='type']");
    let available = document.querySelector("input[name='available']");
    let pet = document.getElementById("pet");
    let smoke = document.getElementById("smoke");
    let genderAccept = document.getElementById("genderAccept");
  
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let data = JSON.parse(this.responseText);
        var posted = `
          <div class="list">
            <div>Your Gender: <span>${data.Gender}</span></div> 
            <div>Address: <span>${data.Address}</span></div>
            <div>Price: <span>${data.Price}</span></div>
            <div>Type: <span>${data.Type}</span></div>
            <div>Rooms Available: <span>${data.Availability}</span></div>
            <div><img src=${data.img}/></div>
            <div>Pet allowed: <span>${data.Pet}</span></div>
            <div>Smoke allowed: <span>${data.Smoke}</span></div>
            <div>Gender accepted: <span>${data.GenderAccept}</span></div>
            <button type="button" onClick={edit(event)">Edit</button>
            <button type="button" onclick="del(event)">Delete</button>
          </div>`;
        document.getElementsByClassName("insert")[0].innerHTML = posted;
      }
    };
    xhttp.open("POST", "http://localhost:3002/house/" + this.props.name, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let newHouse = {
      "Address": address.value, 
      "Price": price.value, 
      "Type": type.value,
      "Gender": gender.value,
      "Availability": available.value,
      "img": img.value,
      "Pet": pet.value, 
      "Smoke": smoke.value, 
      "GenderAccept": genderAccept.value, 
      "UserName": this.props.name
    };
    xhttp.send(JSON.stringify(newHouse));
  };
  //if you're posting your information
  findhouse = () => {
    let gender = document.getElementsByClassName("gender")[0];
    let priceLower = document.querySelector("input[name='priceLower']");
    let priceUpper = document.querySelector("input[name='PriceUpper']");
    let bathroom = document.getElementsByClassName("bathroom")[0];
    let roomNeed = document.querySelector("input[name='roomNeed']");
    let pet = document.getElementsByClassName("pet")[0];
    let smoke = document.getElementsByClassName("smoke")[0];
    let genderAccept = document.getElementsByClassName("genderAccept")[0];
  
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        var posted = `
          <div class="list">
            <div>Your Gender: <span>${data.Gender}</span></div>
            <div>Price: <span>${data.PriceLower}~${data.PriceUpper}</span></div>
            <div>Personal Bathroom: <span>${data.Bathroom}</span></div>
            <div>Need:<span>${data.RoomNeed} Rooms</span></div>
            <div>Have Pet: <span>${data.Pet}</span></div>
            <div>Smoke: <span>${data.Smoke}</span></div>
            <div>Gender accepted: <span>${data.GenderAccept}</span></div>
            <button type="button" onClick={edit(event)">Edit</button>
            <button type="button" onclick="del(event)">Delete</button>
          </div>`;
        document.getElementsByClassName("insert")[0].innerHTML = posted;
      }
    };
    xhttp.open("POST", "http://localhost:3002/roommate/" + this.props.name, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    let newPerson = {
      "Gender": gender.value, 
      "Bathroom": bathroom.value, 
      "PriceLower": priceLower.value,
      "PriceUpper": priceUpper.value,
      "Pet": pet.value, 
      "Smoke": smoke.value, 
      "RoomNeed": roomNeed.value,
      "GenderAccept": genderAccept.value, 
      "UserName": this.props.name
    };
    xhttp.send(JSON.stringify(newPerson));
  };

  render() {
    return (
      <div class="insert">
        <h2>Hello {this.props.name}</h2>
        {this.state.houseAns === undefined ? (
        //ask if you have a house
        <div>
          Do you have a house? 
          Yes<input type="checkbox" id="houseYes" onClick={this.myFunction}/>
          No<input type="checkbox" id="houseNo" onClick={this.myFunction}/>
        </div>
        ) : (
          <div>
            <div>
              Do you have a house? 
              Yes<input type="checkbox" id="houseYes" onClick={this.myFunction}/>
              No<input type="checkbox" id="houseNo" onClick={this.myFunction}/>
            </div>
          {this.state.houseAns ? (
            //subleasing house
            <div>
              <div>
                <span>Your gender</span>
                <select class="gender">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>Address: <input type="text" name="address"/></div>
              <div>Price: <input type="number" name="price"/></div>
              <div>Type: <input type="text" name="type"  placeholder="2B1B"/></div>
              <div>Available Spaces: <input type="text" name="available"  placeholder="2b"/></div>
              <div>Image: <input type="text" name="img"/></div>
              <div>
                <span>Pet Allowed?</span>
                <select id="pet">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <span>Smoke Allowed?</span>
                <select id="smoke">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <span>Gender Acceptance</span>
                <select id="genderAccept">
                  <option value="N">Male/Female</option>
                  <option value="F">Female Only</option>
                  <option value="M">Male Only</option>
                </select>
              </div>
              <button type="button" onClick={this.posthouse}>Post!</button>
            </div>
          ) : (
            //looking for house
            <div>
              <div>
                <span>Your gender</span>
                <select class="gender">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>PriceRange:<input type="number" name="priceLower"/>~<input type="number" name="PriceUpper"/></div>
              <div>
                <span>Do you need personal bathroom?</span>
                <select class="bathroom">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>Room Needed: <input type="number" name="roomNeed"/></div>
              <div>
                <span>Have Pet?</span>
                <select class="pet">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <span>Smoke?</span>
                <select class="smoke">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <span>roommates' gender accepted</span>
                <select class="genderAccept">
                  <option value="M">Male Only</option>
                  <option value="F">Female Only</option>
                  <option value="N">Male/Female</option>
                </select>
              </div>
              <button type="button" onClick={this.findhouse}>Post!</button>
            </div>
          )}
          </div>
        )}
        
      </div>
      )
    }
}





class User extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Login />
      </div>
    )
  }

}

export default User;


