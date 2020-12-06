import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'

import socketIOClient from "socket.io-client"
import ResponsiveContainer from './ResponsiveContainer'
import PreparingView from './PreparingView'
import QuestionView from './QuestionView'
import WaitingView from './WaitingView'
import AnswerView from './AnswerView'
import LobbyView from './LobbyView'
import DetailedResultView from './DetailedResultView'
import Cookies from 'js-cookie'
import config from '../config/config.js'


class GamePlayPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Unique ID for each player. For now, it is the user's nickname
      playerID: "",
      // nickname:"",
      socket: socketIOClient(`${config.basic_BE_domain}`),
      quizsetName: undefined,
      quizNo: 0,
      quizset: undefined,
      answerSet: undefined,
      quizsetID: "",
      view: "lobby",
      ifAnswered: false, // if player finish answering
      playerAnswer: undefined, // player selected answer
      score: 0,
      answerStatistic: undefined,
      overallStatistic: undefined,
      redirect: false,
      nickname: Cookies.get("username"),
      idNickname: Cookies.get("token")
    };

    this.handleViewChange = this.handleViewChange.bind(this);
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
      this.handleViewChange('prepare');
    })
    // wait for the show result signal
    this.state.socket.on("show result" + this.props.match.params.id, (stats)=>{
      console.log("Stats received", stats)
      this.setState({
        overallStatistic: stats
      }, () => {
        console.log(this.state.overallStatistic)
        this.handleViewChange('result');
      })
    })

  }

  handleViewChange(newView) {
    this.setState({
      view: newView
    });
  }

  // Record player's answer and notify the backend
  handlePlayerChoice(answer) {
    console.log(answer)
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
    this.state.socket.emit('submit answer', {
      roomPIN: this.props.match.params.id,
      choice: answer,
      idUser: this.state.idNickname,
      idQuiz: this.state.quizset[this.state.quizNo]._id,
    });
  }

  

  render() {
    // Handles host leaving the page
    if(this.state.redirect){
      console.log("Redirecting")

      return <Redirect to={{
        pathname:`/`,
      }} />
    }
    console.log(this.state.view)
    switch(this.state.view) {
      case 'lobby':
        // show all the player joining the game
        return (
          <ResponsiveContainer>
            <LobbyView
              socket={this.state.socket}
              quizsetName={this.state.quizsetName}
              roomPIN={this.props.match.params.id}
              isHost={false}
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
              changeView={this.handleViewChange}
              isHost={false}
            />
          </ResponsiveContainer>
        );
      case 'answer':
        // show the correct answer and statistics
        return (
          <ResponsiveContainer>
            <AnswerView
              quizsetName={this.state.quizsetName}
              quizNo={this.state.quizNo}
              data={this.state.answerStatistic}
              quizset={this.state.quizset}
              playerAnswer={this.state.playerAnswer}
              changeView={this.handleViewChange}
            />
          </ResponsiveContainer>
        );
      case 'result':
        return (
          <ResponsiveContainer>
            <DetailedResultView
              isHost={false}
              stats={this.state.overallStatistic}
              quizset={this.state.quizset}
              roomPIN={this.props.match.params.id}
              quizsetID={this.state.quizsetID}
              score={this.state.score}
              answerSet={this.state.answerSet}
            /> 
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }
}

export default GamePlayPage