import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import { Redirect} from 'react-router-dom'
import axios from "axios"
import {
  Grid,
  Icon,
  Segment,
  Button,
  Form,
  Header,
  Message
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import Cookies from 'js-cookie'
import { Container, Row, Col } from 'reactstrap';
import HomeContent from './HomeContent'
import config from '../config/config.js'
import ModalSignIn from './ModalSignIn'

class EnterroomPINForm extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${config.basic_BE_domain}`,
      roomPIN: "",
      nickname: Cookies.get("username"),
      nicknameroom: Cookies.get("username"),
      newQuizsetID: "",
      redirectPlay: false,
      redirectHost: false,
      message:"",
      messageroom:""
    };

    this.handleroomPIN = this.handleroomPIN.bind(this);
    this.handleNickname = this.handleNickname.bind(this);
    this.handleNicknameRoom = this.handleNicknameRoom.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleHost = this.handleHost.bind(this);
  }

  handleroomPIN(event) {
    this.setState({roomPIN: event.target.value});
  }

  handleNickname(event) {
    this.setState({nickname: event.target.value});
  }
  handleNicknameRoom(event) {
    this.setState({nicknameroom: event.target.value});
  }

  addPlayer() {
    // POST to express API to add a player to current game session
    // NOTE: socket emit should be inside this function to prevent
    //    loading outdated data
    axios.post(`${config.BE_Domain}/session/add-player`, {
        roomPIN: this.state.roomPIN, player: this.state.nickname
      }).then(res => {
        console.log(res);
        console.log(res.data);

        const socket = socketIOClient(this.state.endpoint);

        // Signaling app.js to broadcast updated player list
        socket.emit('get player list', this.state.roomPIN);
    })
  }
  handleJoin(event) {
    // validate PIN and nickname
    const {nickname, roomPIN} = this.state;
    if (nickname == null || nickname === "" || roomPIN == null || roomPIN === "") {
      this.props.handleModalShow()
    } 

    axios.post(`${config.BE_Domain}/session/validate-game`, {
      roomPIN: this.state.roomPIN
      }).then(res=> {
        if (res.data.result === false) {
          console.log("result " + res.data.result)
          this.setState({message: <Message negative>
            <Message.Header>Game PIN doesn't exist!</Message.Header>
          </Message>})
          return 
        }else {
          // POST a new player to the API and signal the server a player
          //  just joined
          this.addPlayer()
          // console.log("game pin is " + this.state.roomPIN);
          // console.log("nickname is " + this.state.nickname);
          var JSONstr = JSON.stringify({
            roomPIN: this.state.roomPIN,
            nickname: this.state.nickname
          })
          console.log(JSONstr)

          event.preventDefault();
          this.setState({redirectPlay: true});
        }
      })
  
    
  }


  handleHost(event) {
    const {nicknameroom} = this.state;
    if (nicknameroom == null || nicknameroom === "" ) {
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
    if(this.state.redirectPlay){
      console.log("Redirecting to play")

      return <Redirect to={{
        pathname:`/play/${this.state.roomPIN}/${this.state.nickname}`,
        state: {nickname: this.state.nickname}
      }} />
    }

    if(this.state.redirectHost){
      console.log("Redirecting to host")
      return <Redirect to={{
        pathname:`/create-question`,
      }}/>    
    }

    return (
        <Form>
          {this.state.messageroom}
          {/* <Button animated='fade' color='blue' fluid style={{marginTop: '1em'}} type="submit">
            <Button.Content visible>Join Game</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button> */}
          <Button onClick={()=>{this.handleHost()}} className="btnJoin" style={{marginTop: '1em'}}>
          Create Question
        </Button>
        </Form>
    )
  }

}

class JoinListRoom extends Component {
  constructor(props) {
      super(props);
      this.state = {
      nickname: Cookies.get("username"),
      redirectCompete: false
        }
  }
  handleJoinCompete = () =>{
    this.setState({ redirectCompete: true  });
  }
  render() { 
    if(this.state.redirectCompete){
      console.log("Redirecting to host")
      return <Redirect to={{
        pathname:`/list-season`,
        state: {nickname: this.state.nickname}
      }}/>    
    }
      return ( <>
       <Form>
          {this.state.messageroom}
          <Button  style={{marginTop: '1em'}} className="btnLogin" onClick={this.handleJoinCompete}>
          Compete
        </Button>
        </Form>
      </>
       );
  }
}

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      redirectListGame: false,
      nickname: Cookies.get("username"),
      }
  this.handleModalShow = this.handleModalShow.bind(this);
  this.handleModalClose = this.handleModalClose.bind(this);

  }
  handleModalShow(){
    this.setState({ modalShow: true });
  }
  handleModalClose(){
    this.setState({ modalShow: false });
  }
  handleJoinList(e){
    e.preventDefault();
    if(this.state.nickname){
      this.setState({redirectListGame:true});
    } else {
      this.handleModalShow()
    }
  }
  render() {
    if(this.state.redirectListGame){
      return <Redirect to={{
        pathname:`/list-topic`,
      }}/>    
    }
    return (
      <ResponsiveContainer >
          <div textAlign='center' className="bgHome" style={{  backgroundImage: `url(${"homebackground.png"})` }} verticalAlign='middle'>
        <Container>
                <Row>
            <Col md="6">
              <HomeContent/>
            </Col>
            <Col md="6">
              <div className="wrapBoxGame">
              <div className="boxGame">
                <div className="btnBox">
                  <JoinListRoom/>
                  <EnterroomPINForm handleModalShow={this.handleModalShow}/>
                </div>
              </div>
              <a href="#" onClick={(e)=>{this.handleJoinList(e)}}>Browse more games</a>
              </div>
              </Col>
          </Row>
        </Container>
          </div>
          <ModalSignIn modalShow={this.state.modalShow} handleModalClose={this.handleModalClose}/>
      </ResponsiveContainer>
    )
  }
}
// export default withRouter(HomePage)
export default HomePage