import React, { Component } from 'react'
import {
  Grid,
  Segment,
  Header,
  Statistic,
  Button,
  Icon,
  List,
} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import axios from "axios"
import config from '../config/config.js'


/**
 * Show all the players in the lobby with certain game PIN.
 * Props:
 * socket: the sokect to interact with backend
 * changeView: the state lifting up handler to change view of the parent component
 * roomPIN: the game PIN for this quizset
 * quizsetName: the name of this quizset
 * isHost: true on GameHostPage, false on GamePlayPage
 */
class LobbyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerList: [],
      redirect: false,
    };
    this.updatePlayerList = this.updatePlayerList.bind(this);
    this.startGame = this.startGame.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
    this.handleWindowClose = this.handleWindowClose.bind(this);
    // window.addEventListener("beforeunload", (ev) => {  
    //   ev.preventDefault();
    //   return this.handleWindowClose();
    // });
  }

  // update player playerNumber
  updatePlayerList = (newPlayerList) => {
    console.log("updatePlayerList")
    this.setState({
      playerList: newPlayerList.map(player => player.nickname),
    })
  }

  // Execute when user closes the browser tab
  // Notify backend that the user is leaving
  handleWindowClose() {
    console.log("leave game pin " + this.props.roomPIN);
    this.props.socket.emit('player leave', {
      roomPIN: this.props.roomPIN,
      nickname: this.props.nickname
    })
  }

  // host send start game signal to back end
  startGame(event) {
    console.log("start game pin " + this.props.roomPIN);
    this.props.socket.emit('start game', this.props.roomPIN);
    event.preventDefault();
  }

  // Client send leave game signal to back-end
  // If player is disconnecting, remove player
  // If host is disconnecting, remove game session and redirect all players
  leaveGame(event) {
    console.log("Leaving game pin " + this.props.roomPIN);
    if (this.props.isHost) {
      this.props.socket.emit('host leave', {
        roomPIN: this.props.roomPIN
      })
      axios.post(`${config.BE_Domain}/session/remove-session?roomPIN=${this.props.roomPIN}`).then(res => {
        this.props.socket.emit('get room list');
        this.props.socket.emit('get room list allow season');
        console.log(res)
      })
    } else {
      this.props.socket.emit('player leave', {
        roomPIN: this.props.roomPIN,
        nickname: this.props.nickname
      })
    }
    event.preventDefault();
    this.setState({redirect: true});

    
  }
 
  componentDidMount() {
    // get player list before mount
    this.props.socket.emit('get player list', this.props.roomPIN);
    // wait for player list update
    this.props.socket.on('update player list' + this.props.roomPIN, (playerList) => {
      this.updatePlayerList(playerList);
    })

    console.log("socket on for: ", "host left" + this.props.roomPIN)
    this.props.socket.on("host left" + this.props.roomPIN, (info)=> {
      console.log("Host has left")
      this.setState( {
        redirect: true
      })
    })
  }

  render() {
    // Handles player leaving the page
    console.log(this.props)
    if(this.state.redirect){
      console.log("Redirecting")

      return <Redirect to={{
        pathname:`/`,
      }} />
    }
    return (
      <Segment>
        <Grid centered>
          <Grid.Row verticalAlign='middle' className="rowInQuiz" >
            <Grid.Column width={2} textAlign='center'>
              <Statistic color='teal'>
                <Statistic.Value>{this.state.playerList.length}</Statistic.Value>
                <Statistic.Label>Players</Statistic.Label>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign='center' width={12}>
              <Header as='h1' color='teal'>
                {this.props.quizsetName}
                <Header.Subheader>
                  Lobby {this.props.roomPIN}
                </Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column textAlign='right' width={2}>
                  <Button color='teal' animated='fade' onClick={this.leaveGame}>
                    <Button.Content visible>Leave</Button.Content>
                    <Button.Content hidden>
                      <Icon name='arrow right' />
                    </Button.Content>
                  </Button>
            </Grid.Column>

          </Grid.Row>

          <Grid.Row centered verticalAlign='middle'>
            <Grid.Column>
              <Segment>
                {this.props.isHost
                  ?
                    <Header as='h1' color='grey' textAlign='center'>
                      Join with Game PIN: {this.props.roomPIN}
                    </Header>
                  :
                    <Header as='h1' color='grey' textAlign='center'>
                      Waiting for host to start game...
                    </Header>
                }
                <Header as='h2' color='grey' textAlign='center'>
                  Players in the lobby:
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row >
            <Grid.Column>
              <Segment size='large' >
                <List 
                    items={this.state.playerList}
                    size='large'
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>

          {this.props.isHost
            ?
            <Grid.Row centered >

              <Grid.Column centered textAlign='middle' width={5}>
                    <Button color='teal' animated='fade' onClick={this.startGame}>
                      <Button.Content visible>Start Game!</Button.Content>
                      <Button.Content hidden>
                        <Icon name='arrow right' />
                      </Button.Content>
                    </Button>
              </Grid.Column>

            </Grid.Row>
            :
            <Grid.Row ></Grid.Row>
          }
          
          
          
        </Grid>
      </Segment>
    );
  }
}

export default LobbyView