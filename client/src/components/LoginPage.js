import React, { Component } from 'react'
import { Button, Form, Grid, Header, Segment, Icon, Message } from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import { Redirect } from 'react-router-dom';
import axios from "axios"
import Cookies from 'js-cookie'
import config from '../config/config.js'

class LoginForm extends Component{
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state={
      username:"",
      password:"",
      message:"",
      loggedIn
    }

    this.submitForm = this.submitForm.bind(this);
  }

 
  submitForm (e){
    e.preventDefault()
    axios.post(`${config.BE_Domain}/users/user-login`, {
       username: this.state.username, password: this.state.password
    }).then(res => {

        Cookies.set("username", res.data.username);
        Cookies.set("token", res.data.token);
        this.setState({
          loggedIn: true
        })
    }).catch((error) =>{
      console.log(error)
      this.setState({ message: "Invalid password or username" });
    });
    // const{username, password} = this.state
    // if (username == 'A' && password == '1') {
    //   localStorage.setItem("username", username);
    //   this.setState({
    //     loggedIn: true
    //   })
    // }
  }
  render(){

    if (this.state.loggedIn) {
      return  window.location.reload(false);
    }
    return <>
            <div className="redText"> {this.state.message}</div>
          <Form size='large' onSubmit={this.submitForm} className={this.props.desktop ? "boxLogin" : "menuLogin"}>
         
            {/* <Button animated='fade' color='facebook' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>
                <Icon name='facebook' /> Log in with Facebook
              </Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
            <Button animated='fade' color='google plus' fluid size='large' style={{marginTop: '1em'}}>
              <Button.Content visible>
                <Icon name='google plus' /> Log in with Google
              </Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button> */}
            <Form.Input
              fluid icon='user'
              iconPosition='left'
              placeholder='Username'
              style={{marginTop: '1em'}}
              value={this.state.username}
              onChange={e => this.setState({username: e.target.value})}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              style={{marginTop: '1em'}}
              value={this.state.password}
              onChange={e => this.setState({password: e.target.value})}
            />
            <Button type='submit' size='large' style={{marginTop: '1em'}} className="btnLogin">
              Log in
            </Button>
        </Form>
        </>
}}
export default LoginForm