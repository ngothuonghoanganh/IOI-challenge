import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'
import axios from "axios" 
import {
  Grid,
  Icon,
  List,
  Segment,
  Button,
  Form,
  Header,
  Dropdown, 
  Menu,
  Input,
  Image,
  Dimmer,
  Loader,
  Confirm
} from 'semantic-ui-react'
import Cookies from 'js-cookie'
import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import config from '../config/config.js'


// const tagOptions = [
//   { key: 0, value: "", text: 'All'},
//   { key: 1, value: "Arts", text: 'Arts'},
//   { key: 2, value: "Astronomy", text: 'Astronomy'},
//   { key: 3, value: "Biology", text: 'Biology'},
//   { key: 4, value: "Chemistry", text: 'Chemistry'},
//   { key: 5, value: "ComputerScience", text: 'Computer Science'},
//   { key: 6, value: "Geography", text: 'Geography'},
//   { key: 7, value: "History", text: 'History'},
//   { key: 8, value: "Languages", text: 'Languages'},
//   { key: 9, value: "Literature", text: 'Literature'},
//   { key: 10, value: "Math", text: 'Math'},
//   { key: 11, value: "Music", text: 'Music'},
//   { key: 12, value: "Physics", text: 'Physics'},
//   { key: 13, value: "Science", text: 'Science'},
//   { key: 14, value: "Sport", text: 'Sport'},
//   { key: 15, value: "Trivia", text: 'Trivia'},
// ]
class CreateRoomSeasonPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${config.basic_BE_domain}`,
      socket: socketIOClient(`${config.basic_BE_domain}`),
      quizsetID: "",
      roomPIN: 0,
      players: [],
      redirect: false,
      quizset:[],
      currentQuiz:{},
      currentQuizId: "",
      name: "",
      tag: [],
      AddOrEditQuiz: false,
      error: false,
      errorMsg: "",
      saved: false,
      savedMsg: "",
      nickname: Cookies.get("username"),
      tagOptions: [],
      size: 0,
      errRoom: ""
    }
   
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount () {
    this.setState({quizsetID: this.props.location.state.id})
    console.log("--------------")
    console.log(this.props)
    axios.get(`${config.BE_Domain}/session/get-topic-game`).then(res => {
      this.setState({ tagOptions: res.data, tag: res.data[0]._id });
  })
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
        socket.emit('get player list',  this.state.roomPIN);
    })
  }

  handleJoin() {

    axios.post(`${config.BE_Domain}/session/validate-game`, {
      roomPIN:  this.state.roomPIN
      }).then(res=> {
        if (res.data.result === false) {
          console.log(res.data.result)
          return 
        }else {
          this.addPlayer()
          var JSONstr = JSON.stringify({
            roomPIN:  this.state.roomPIN,
            nickname: this.state.nickname
          })
          console.log(JSONstr)

          this.setState({redirectPlay: true});
        }
      })
  
    
  }


  handleSubmit(event) {
    console.log(this.state)
    // axios.post(`${config.BE_Domain}/quizset/validate-quizset`, {
    //   quizsetID: this.props.location.state.id
    // }).then(res => {
      // if (res.data.result) {
        // Create new game session and redirect to the hosting page
        // axios.post(`${config.BE_Domain}/session/create-new-session?topicGameId=${this.state.tag}&quizsetID=${this.props.location.state.id}`).then(res => {
        //   console.log(res)
        //   this.setState({roomPIN: res.data.roomPIN}, function() {
        //     console.log("Game PIN is " + this.state.roomPIN);
        //     event.preventDefault();
        //     this.state.socket.emit('get room list');
        //     this.setState({redirect: true});
        //   });   
        //   this.handleJoin()
        // })
        axios.post(`${config.BE_Domain}/session/create-room-allow-season`).then(res => {
          // console.log(res)
          console.log(res)
          this.setState({roomPIN: res.data.roomPIN}, function() {
            console.log("Game PIN is " + this.state.roomPIN);
            event.preventDefault();
            this.state.socket.emit('get room list allow season');
            this.setState({redirect: true, errRoom: ""});
          });   
          this.handleJoin()
          return true;
        }).catch( (error) => {
          console.log(error);
          this.setState({ errRoom: "There are no questions in this topic, please choose another topic" });
        });
  }


  render() {
    const {AddOrEditQuiz} = this.state;
    if(this.state.redirect){
      // Finish creating questions, redirecting to hosting page
      return <Redirect to={{
        pathname:`/host/${this.state.roomPIN}`,
        state: {quizsetID: this.props.location.state.id, nickname: this.state.nickname}
      }} />
    }

   

    return (
      <ResponsiveContainer>
        <Form onSubmit={this.handleSubmit} className="formChoose">
              <Grid.Column textAlign="center" width={4}><Header as='h2'>{this.state.name}</Header></Grid.Column>
            <Input
                label="Name"
                placeholder='Add name for Quizset'
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}/>
              <Button fluid primary size='large' style={{marginTop: '1em'}} type="submit">
                          Host This Quiz
                        </Button>
                        <Confirm
                          open={this.state.error}
                          content={this.state.errorMsg}
                          onCancel={()=>{this.setState({error: false, errorMsg: ""})}}
                          onConfirm={()=>{this.setState({error: false, errorMsg: ""})}}
                        />

        </Form>
    </ResponsiveContainer>
    )
  }

}

  
export default CreateRoomSeasonPage