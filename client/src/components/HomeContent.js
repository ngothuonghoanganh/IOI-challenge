import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'

class HomeContent extends Component {
    state = {  }
    render() { 
        return ( 
            <>
            <div className="boxContent">
                <div className="content">
                    <h2>Leisure for the mind </h2>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
                </div>
                <div className="content">
                    <h2>Leisure for the mind </h2>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
                </div>
                <div className="boxSearch">
                    <b>Let's team up for challenges</b>
                    <div className="uiSearch">
                        <input type="text"/>
                        <Icon name='search' size='large' />
                    </div>
                </div>
            </div>
            </>
         );
    }
}
 
export default HomeContent;