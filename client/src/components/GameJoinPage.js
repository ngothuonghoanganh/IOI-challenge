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
import config from '../config/config.js'
import ModalSignIn from './ModalSignIn'

class GameJoinPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${config.basic_BE_domain}`,
      roomPIN: "",
      nickname: Cookies.get("username"),
      nicknameroom: Cookies.get("username"),
      newQuizsetID: "",
      redirectPlay: false,
      message:"",
      messageroom:"",
      loginPage: false,
      modalShow: false,
    };

    this.handleroomPIN = this.handleroomPIN.bind(this);
    this.handleNickname = this.handleNickname.bind(this);
    this.handleNicknameRoom = this.handleNicknameRoom.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
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
    if (nickname == null || nickname === "") {
      this.handleModalShow()
    } 
    else if(roomPIN == null || roomPIN === ""){
      this.setState({message: <Message negative>
        <Message.Header>Please correct game PIN! !!! </Message.Header>
      </Message>})
      return;
    } else {

      
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
    
  }
  handleModalShow(){
    this.setState({ modalShow: true });
  }
  handleModalClose(){
    this.setState({ modalShow: false });
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
        pathname:`/create`,
        state: {id: this.state.newQuizsetID, nickname: this.state.nicknameroom}
      }}/>    
    }

    return (<>
        <Form onSubmit={this.handleJoin} className="boxPin">
          <Form.Input
           icon='gamepad'
            iconPosition='left'
            placeholder='Game PIN'
            style={{marginTop: '1em'}}
            value={this.state.roomPIN}
            onChange={this.handleroomPIN}
          />
          {/* <Form.Input
           icon='chess'
            iconPosition='left'
            placeholder='Nickname'
            style={{marginTop: '1em'}}
            value={this.state.nickname}
            onChange={this.handleNickname}
          /> */}
          {this.state.message}
          <Button style={{marginTop: '1em'}} type="submit" className="btnJoin">
            Join
          </Button>
        </Form>
          <ModalSignIn modalShow={this.state.modalShow} handleModalClose={this.handleModalClose}/>

        </>
    )
  }

}

// class GameJoinPage extends Component {
//   render() {
//     return (
//       <ResponsiveContainer>
//         <Segment>
//           <Grid textAlign='center' style={{  backgroundImage: `url(${"background1.png"})` }} verticalAlign='middle'>
//             <Grid.Row>
//               <Grid.Column style={{ maxWidth: 450 }}>
//                 <Header as='h2' block color='grey' textAlign='center'
//                 style={{
//                   backgroundColor: 'rgba(255,255,255,0.6)'
//                 }}
//                 >
//                   Join A Game Using PIN
//                 </Header>
//                 <EnterroomPINForm/>
//               </Grid.Column>
//             </Grid.Row>
//           </Grid>
//         </Segment>
//       </ResponsiveContainer>
//     )
//   }
// }
// export default withRouter(GameJoinPage)
export default GameJoinPage