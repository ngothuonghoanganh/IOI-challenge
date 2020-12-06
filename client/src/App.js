import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage'
import ExplorePage from './components/ExplorePage'
import Login from './components/Login'
import CreateQuestionPage from './components/CreateQuestionPage'
import CreateQuestionUser from './components/CreateQuestionUser'
import CreateMissionPage from './components/CreateMissionPage'
import CreateQuizsetPage from './components/CreateRoomPage'
import CreateRoomSeasonPage from './components/CreateRoomSeasonPage'
import GameJoinPage from './components/GameJoinPage'
import GameHostPage from './components/GameHostPage'
import GamePlayPage from "./components/GamePlayPage";
import LogoutPage from "./components/Logout";
import RegisterPage from "./components/RegisterPage";
import Footer from './components/Footer';
import ListRoom from './components/ListRoom';
import ListRoomSeason from './components/ListRoomSeason';
import ListTopic from './components/ListTopic';
import './App.css';
import './App.scss';

function App() {
  // TODO:
  // /host should be replaced by /create, which is creating the quiz
  // After creating a quiz, it should then route to /host/:id
  
  return (
    <>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/admin" component={CreateQuestionPage}/>
          <Route exact path="/create-question" component={CreateQuestionUser}/>
          <Route exact path="/admin-misson" component={CreateMissionPage}/>
          <Route path="/explore" component={ExplorePage}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/logout" component={LogoutPage}/>
          <Route path="/create" component={CreateQuizsetPage}/>
          <Route path="/create-room-season" component={CreateRoomSeasonPage}/>
          <Route path="/list-topic" component={ListTopic}/>
          <Route path="/list" component={ListRoom}/>
          <Route path="/list-season" component={ListRoomSeason}/>
          {/* <Route path="/join" component={GameJoinPage}/> */}
          <Route path="/host/:id" component={GameHostPage}/>
          <Route path="/play/:id" component={GamePlayPage}/>
          <Route path="/edit/:id" component={CreateQuizsetPage}/>
        </Switch>
      </Suspense>
    </Router>
    <Footer/>
    </>
  )
}

export default App;
