import React, { Component } from 'react'
import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import LobbyView from './LobbyView'
import MonitoringView from './MonitoringView'
import axios from "axios"
import Cookies from 'js-cookie'
import DetailedResultView from './DetailedResultView'
import PreparingView from './PreparingView'
import QuestionView from './QuestionView'
import WaitingView from './WaitingView'
import AnswerView from './AnswerView'
import config from '../config/config.js'

class GameHostPage extends Component {
  constructor() {
    super();
    this.state = {
      socket: socketIOClient(`${config.basic_BE_domain}`),
      quizsetName: undefined,
      quizNo: 0,
      quizset: [],
      answerSet: undefined,
      view: "lobby",
      roomPIN: "",
      quizsetID: "",
      overallStats: undefined,
      nickname: Cookies.get("username"),
      idNickname: Cookies.get("token")
    };
    this.handleViewChange = this.handleViewChange.bind(this);
    this.setOverallStats = this.setOverallStats.bind(this);
    this.handlePlayerChoice = this.handlePlayerChoice.bind(this);

  }

  componentDidMount() {
    if (this.state.quizsetName === undefined) {
      // send enter game signal
      this.state.socket.emit('enter game', this.props.match.params.id);
    }
    // wait for quizname
    this.state.socket.on("enter game" + this.props.match.params.id, (quizname)=>{
      console.log(quizname);
      this.setState({quizsetName: quizname});
    })
    // Wait for the game start signal
    this.state.socket.on("start game" + this.props.match.params.id, (quizset)=>{
      this.setState(
        {
          quizset: quizset,
          answerSet: new Array(quizset.length)
        });
      this.handleViewChange('prepare');
    })
    // Wait for the show answer signal
    this.state.socket.on("show answer" + this.props.match.params.id, (answerStatistic)=>{
      this.setState({answerStatistic: answerStatistic});
      this.handleViewChange('answer');
    })
    
    // wait for the next quiz signal
    this.state.socket.on("next quiz" + this.props.match.params.id, (quizNo)=>{
      this.setState({
        quizNo: quizNo,
        ifAnswered: false,
        playerAnswer: undefined,
        answerStatistic: undefined,
      });
      this.setState({roomPIN: this.props.match.params.id})
      this.handleViewChange('prepare');
    })
    console.log(this.props)
  }

  handleViewChange(newView) {
    this.setState({
      view: newView
    });
  }

  setOverallStats(stats) {
    this.setState({
      overallStats: stats
    })
  }
  // addPlayer() {
  //   // POST to express API to add a player to current game session
  //   // NOTE: socket emit should be inside this function to prevent
  //   //    loading outdated data
  //   axios.post(`${config.BE_Domain}/session/add-player`, {
  //       roomPIN: this.props.match.params.id, player: this.props.location.state.nickname
  //     }).then(res => {
  //       console.log(res);
  //       console.log(res.data);

  //       const socket = socketIOClient(this.state.endpoint);

  //       // Signaling app.js to broadcast updated player list
  //       socket.emit('get player list', this.props.match.params.id);
  //   })
  // }
  // handleJoin() {

  //   axios.post(`${config.BE_Domain}/session/validate-game`, {
  //     roomPIN: this.props.match.params.id
  //     }).then(res=> {
  //       if (res.data.result === false) {
  //         console.log(res.data.result)
  //         return 
  //       }else {
  //         // POST a new player to the API and signal the server a player
  //         //  just joined
  //         this.addPlayer()
  //         // console.log("game pin is " + this.state.roomPIN);
  //         // console.log("nickname is " + this.state.nickname);
  //         var JSONstr = JSON.stringify({
  //           roomPIN: this.props.match.params.id,
  //           nickname: this.props.location.state.nickname
  //         })
  //         console.log(JSONstr)

  //         this.setState({redirectPlay: true});
  //       }
  //     })
  
    
  // }
  handlePlayerChoice(answer) {
    var newAnswerSet = this.state.answerSet;
    newAnswerSet[this.state.quizNo] = answer
    var newScore = this.state.score + (answer === this.state.quizset[this.state.quizNo].answer ? 1 : 0)
    this.setState({
      ifAnswered: true,
      playerAnswer: answer,
      answerSet: newAnswerSet,
      score: newScore
      // NOTE:
      // To finish debugging for submitting answers, uncomment this:
      // view: 'wait'
    });
    // TODO: emit player's answer to backend
    console.log(answer)
    this.state.socket.emit('submit answer', {
      roomPIN: this.props.match.params.id,
      choice: answer,
      idUser: this.state.idNickname,
      idQuiz: this.state.quizset[this.state.quizNo]._id,
    });
    
  }
  render() {
    console.log(this.state.quizset);
    // switch(this.state.view) {
    //   case 'lobby':
    //     // show all the player joining the game
    //     return (
    //       <ResponsiveContainer>
    //         <LobbyView
    //           socket={this.state.socket}
    //           quizsetName={this.state.quizsetName}
    //           roomPIN={this.props.match.params.id}
    //           isHost={true}
    //           changeView={this.handleViewChange}
    //         />
    //       </ResponsiveContainer>
    //     )
    //   // case 'prepare':
    //   //   // Counting down 3 seconds, get ready for answering quizs
    //   //   return (
    //   //     <ResponsiveContainer>
    //   //       <PreparingView
    //   //         quizsetName={this.state.quizsetName}
    //   //         quizNo={this.state.quizNo}
    //   //         changeView={this.handleViewChange}
    //   //       />
    //   //     </ResponsiveContainer>
    //   //   );
    //   case 'monitor':
    //     // show quiz content, options and time
    //     return (
    //       <ResponsiveContainer>
    //         <MonitoringView
    //           socket={this.state.socket}
    //           quizsetName={this.state.quizsetName}
    //           roomPIN={this.props.match.params.id}
    //           quizset={this.state.quizset}
    //           changeView={this.handleViewChange}
    //           setStats={this.setOverallStats}
    //         />
    //       </ResponsiveContainer>
    //     );
    //   // case 'quiz':
    //   //   // show quiz content, options and timer
    //   //   return (
    //   //     <ResponsiveContainer> 
    //   //       <QuestionView
    //   //         quizsetName={this.state.quizsetName}
    //   //         quizNo={this.state.quizNo}
    //   //         quizset={this.state.quizset}
    //   //         recordAnswer={this.handlePlayerChoice}
    //   //         changeView={this.handleViewChange}
    //   //       />
    //   //     </ResponsiveContainer>
    //   //   );
    //   case 'result':
    //     // Save the stats to the database
    //     console.log("stats:", this.state.overallStats)
    //     console.log("pin:", this.state.roomPIN)

    //     axios.post('${config.BE_Domain}/session/save-history', {
    //       roomPIN: this.state.roomPIN,
    //       stats: this.state.overallStats
    //     }).then(res => {
    //     })

    //     return (
    //       <ResponsiveContainer>
    //         <DetailedResultView
    //           isHost={true}
    //           stats={this.state.overallStats}
    //           quizset={this.state.quizset}
    //           roomPIN={this.state.roomPIN}
    //           quizsetID={this.state.quizsetID}
    //           answerSet={this.state.answerSet}
    //         />
    //       </ResponsiveContainer>
    //     );
    //   default:
    //     return null;
    // }
    switch(this.state.view) {
      case 'lobby':
        // show all the player joining the game
        return (
          <ResponsiveContainer>
            <LobbyView
              socket={this.state.socket}
              quizsetName={this.state.quizsetName}
              roomPIN={this.props.match.params.id}
              isHost={true}
              changeView={this.handleViewChange}
              nickname={this.state.nickname}
            />
          </ResponsiveContainer>
        )
      case 'prepare':
        // Counting down 3 seconds, get ready for answering quizs
        return (
          <ResponsiveContainer>
            <PreparingView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              changeView={this.handleViewChange}
              isHost={true}
            />
          </ResponsiveContainer>
        );
      case 'quiz':
        // show quiz content, options and timer
        return (
          <ResponsiveContainer> 
            <QuestionView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              quizset={this.state.quizset}
              recordAnswer={this.handlePlayerChoice}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'wait':
        // waiting for instructor to move forward
        // after submitting the answer or time up
        return (
          <ResponsiveContainer>
            <WaitingView
              ifAnswered={this.state.ifAnswered}
              // changeView={this.handleViewChange}
              isHost={true}
              socket={this.state.socket}
              quizsetName={this.state.quizsetName}
              roomPIN={this.props.match.params.id}
              quizset={this.state.quizset}
              // setStats={this.setOverallStats}
              quizNo={this.state.quizNo}

            />
          </ResponsiveContainer>
        );
      case 'answer':
        // show the correct answer and statistics
        return (
          <ResponsiveContainer>
            <AnswerView
              // quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              data={this.state.answerStatistic}
              quizset={this.state.quizset}
              playerAnswer={this.state.playerAnswer}
              isHost={true}
              socket={this.state.socket}
              roomPIN={this.props.match.params.id}
              quizset={this.state.quizset}
              changeView={this.handleViewChange}
              setStats={this.setOverallStats}
              // quizNo={this.state.quizNo}
            />
          </ResponsiveContainer>
        );
      case 'result':
        // Save the stats to the database
        // console.log("stats:", this.state.overallStats)
        // console.log("pin:", this.state.roomPIN)

        axios.post(`${config.BE_Domain}/session/save-history`, {
          roomPIN: this.state.roomPIN,
          stats: this.state.overallStats
        }).then(res => {
        })

        return (
          <ResponsiveContainer>
            <DetailedResultView
              isHost={true}
              stats={this.state.overallStats}
              quizset={this.state.quizset}
              roomPIN={this.props.match.params.id}
              quizsetID={this.state.quizsetID}
              answerSet={this.state.answerSet}
            />
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }
}

export default GameHostPage