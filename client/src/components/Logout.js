import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie'


class LogoutPage extends Component{
  constructor(props) {
    super(props);
    Cookies.remove("username")
    Cookies.remove("token")
  }


  render(){
      return <Redirect to="/"></Redirect>
}}
export default LogoutPage