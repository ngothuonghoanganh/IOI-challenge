import React, { Component } from 'react'
import {
    Grid,
    Header,
    Loader,
} from 'semantic-ui-react'
import MonitoringView from './MonitoringView'

/**
 * Show the waiting page. Waiting for instruction.
 * Props:
 * changeView: the state lifting up handler to change view of the parent component
 * ifAnswered: if player has submit his/her answer
 */
class WaitingView extends Component {
  
  render() {
    console.log(this.props)

    return (
      <Grid centered>
        <Grid.Row>
          {this.props.isHost ? 
            <MonitoringView
            socket={this.props.socket}
            quizsetName={this.props.quizsetName}
            roomPIN={this.props.roomPIN}
            quizset={this.props.quizset}
            showAnswer={false}
            quizNo={this.props.quizNo}


            />
            : null
          }
          </Grid.Row>
      <Grid textAlign='center' verticalAlign='middle'>
        <Grid centered>

          <Grid.Column textAlign='center' width={12}>
            <Loader active inline='centered' size='big'/>
            <Header as='h1' icon color='teal'>
              {this.props.ifAnswered
                ? "Answer Submitted!"
                : "Time's up!"
              }
              <Header.Subheader>
                Waiting for instructor to show answer...
              </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid>
      </Grid>
      </Grid>
    )
  }
}

export default WaitingView