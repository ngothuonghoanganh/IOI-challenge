import React, { Component } from 'react';
import logo from '../IOILogo(white).png';


class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <footer className="footer">
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <div className="copyright">
                @2020. All Rights Reserved
                <br/>
                Develop by IT team Microsolution
                </div>
                <div className="blright"></div>
            </footer>
         );
    }
}
 
export default Footer;