import React, { Component } from 'react'
import LoginForm from './LoginPage';
import { Button } from 'semantic-ui-react';

class ModalSignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

    }

    render() { 
        return ( 
<div className="modal" role="dialog" style={{display: this.props.modalShow ? "block" : "none"}}>
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Log In</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleModalClose}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="modal-body">
        <LoginForm/>
        <Button as='a' href='/register' style={{ marginTop: '1em' }}>
                    Sign up
                  </Button>
        </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.handleModalClose}>Close</button>
      </div>
    </div>
  </div>
</div>

         );
    }
}
 
export default ModalSignIn;