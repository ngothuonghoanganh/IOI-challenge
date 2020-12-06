import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import ResponsiveContainer from './ResponsiveContainer';
import axios from "axios" 
import Cookies from 'js-cookie'
import socketIOClient from "socket.io-client"
import bg  from "../asset/img/backgroundcover.jpg"
import config from '../config/config.js'

class ListRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
          socket: socketIOClient(`${config.basic_BE_domain}`),
          roomPIN: "",
          nickname: Cookies.get("username"),
          redirectPlayJoin: false,
          rooms: [],
          endpoint: `${config.basic_BE_domain}`,
          newQuizsetID: '',
          redirectHost: false
          }

    }
    componentDidMount(){
      console.log(this.props)
      this.state.socket.emit('get room list',  this.props.location.state.topic);
      // wait for player list update
      this.state.socket.on('update room list' , (messages) => {
        console.log("aaaaaaa")
        this.updateRoomList(messages)
      })

      // axios.get(`${config.BE_Domain}/session/sessions`).then(res => {
      //   console.log(res.data)
      //   this.setState({ rooms: res.data });
      //   })
    }
    updateRoomList = (messages) => {
      this.setState({ rooms:  messages});
    }
    addPlayer(roomPIN) {
      axios.post(`${config.BE_Domain}/session/add-player`, {
        roomPIN:roomPIN, player: this.state.nickname
      }).then(res => {
        console.log(res);
          console.log(res.data);
  
          const socket = socketIOClient(this.state.endpoint);
  
          // Signaling app.js to broadcast updated player list
          socket.emit('get player list', this.state.roomPIN);
      })
    }
    handleJoinList(roomPIN){
      console.log(roomPIN)
      // event.preventDefault();
      // if(this.state.nickname){
        this.setState({redirectPlayJoin:true, roomPIN: roomPIN});
        this.addPlayer(roomPIN)
      // } else {

      // }
    }
    handleHost(event) {
      const {nickname} = this.state;
      if (nickname == null || nickname === "" ) {
        this.props.handleModalShow()
      } else {
        axios.post(`${config.BE_Domain}/quizset/create-quizset`, {
          }).then(res=> {
            this.setState({newQuizsetID:res.data.quizsetID,
              redirectHost:true
            })
          })
  
      }
    }
    render() { 
      if(this.state.redirectHost){
        console.log("Redirecting to host")
        return <Redirect to={{
          pathname:`/create`,
          state: {id: this.state.newQuizsetID, nickname: this.state.nicknameroom}
        }}/>    
      }
      if(this.state.redirectPlayJoin){
        console.log("Redirecting to play")
  
        return <Redirect to={{
          pathname:`/play/${this.state.roomPIN}/${this.state.nickname}`,
          state: {nickname: this.state.nickname}
        }} />
      }
        return ( 
        <ResponsiveContainer>
          <div className="boxRoom container">
          <div className="row boxListRoomCreate">
            <div className="col-4">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
            <div className="col-lg-6 alighBtn">
            <Button onClick={()=>{this.handleHost()}} className="btnJoin" style={{marginTop: '1em'}}>
              Create Room
            </Button>
            </div>
          </div>

          {this.state.rooms.map((room) =>
          <div className="card" style={{width: '100%', marginBottom: '10px'}} key={room._id}>
            <div className="card-body">
              <h5 className="card-title">ID room: {room.roomPIN}</h5>
            <img className="card-img-top" src={bg} alt="Card image cap" />
              {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
              <Button style={{marginTop: '1em'}} type="submit" className="btnJoin" onClick={() => this.handleJoinList(room.roomPIN)}>
                Enter
              </Button>
            </div>
          </div>
          )}
          </div>
        </ResponsiveContainer>
         );
    }
}
 
export default ListRoom;