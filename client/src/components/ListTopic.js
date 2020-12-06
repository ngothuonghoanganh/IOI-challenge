import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import ResponsiveContainer from './ResponsiveContainer';
import axios from "axios" 
import Cookies from 'js-cookie'
import socketIOClient from "socket.io-client"
import bg  from "../asset/img/backgroundcover.jpg"
import config from '../config/config.js'

class ListTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
          socket: socketIOClient(`${config.basic_BE_domain}`),
          _id: "",
          nickname: Cookies.get("username"),
          redirectTopicJoin: false,
          games: [],
          endpoint: `${config.basic_BE_domain}`,

          }

    }
    componentDidMount(){
      this.state.socket.emit('get game list');
      // wait for player list update
      this.state.socket.on('update game list' , (game) => {
        console.log(game)
        this.updateGameList(game)
      })

      // axios.get(`${config.BE_Domain}/session/sessions`).then(res => {
      //   console.log(res.data)
      //   this.setState({ games: res.data });
      //   })
    }
    updateGameList = (game) => {
      this.setState({ games:  game});
    }

    handleJoinList(_id){
      console.log(_id)
      // event.preventDefault();
      // if(this.state.nickname){
        this.setState({redirectTopicJoin:true, _id: _id});
      // } else {

      // }
    }
    render() { 
      if(this.state.redirectTopicJoin){
        return <Redirect to={{
          pathname:`/list`,
          state: {topic: this.state._id}
        }} />
      }
        return ( 
        <ResponsiveContainer>
          <div className="boxRoom container">
            <div className="row">
          <div className="col-lg-2">
          <div class="card text-center"  style={{marginBottom: '20px'}}>
            <div class="card-header">
              Leaderboard
            </div>
            <div class="card-body">
              <h5 class="card-title">Special title treatment</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
          </div>
          </div>
          <div className="col-lg-8">

          {this.state.games.map((game) =>
          <div className="card" style={{width: '100%', marginBottom: '10px'}} key={game._id}>
            <div className="card-body">
              <h5 className="card-title">ID room: {game.name}</h5>
            <img className="card-img-top" src={bg} alt="Card image cap" />
          <p className="card-text">{game.description}</p>
          <b>Total room: {game.roomCount}</b>
          <br/>
              <Button style={{marginTop: '1em'}} type="submit" className="btnJoin" onClick={() => this.handleJoinList(game._id)}>
                Join
              </Button>
            </div>
          </div>
          )}
          </div>
          <div className="col-lg-2">
          <div class="card text-center" style={{marginBottom: '20px'}}>
            <div class="card-header">
                Ranking
              </div>
              <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
            </div>
            <div class="card text-center"  style={{marginBottom: '20px'}}>
            <div class="card-header">
                Friend Online
              </div>
              <div class="card-body">
                <ul>
                  <li>Lorem.</li>
                  <li>Distinctio!</li>
                  <li>Autem.</li>
                  <li>Quo!</li>
                  <li>Cumque.</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
          </div>
        </ResponsiveContainer>
         );
    }
}
 
export default ListTopic;