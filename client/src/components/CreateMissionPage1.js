import React, { Component } from 'react'
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
import { Container, Row, Col } from 'reactstrap';

import $ from 'jquery';
import { WithContext as ReactTags } from 'react-tag-input';
import ResponsiveContainer from './ResponsiveContainer'

  import axios from "axios" 
  import config from '../config/config.js'

class CreateMissionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: `${config.basic_BE_domain}`,
            tags: [],
            nameMisson: "",
            tag: [],
            tagOptions: [],
            data: [],
            dataUpdate: [],
            size: 0,
            topic: [],
            listSeason: []
          }
          this.handleDelete = this.handleDelete.bind(this);
          this.handleAddition = this.handleAddition.bind(this);
    }
    componentDidMount () {
        axios.get(`${config.BE_Domain}/session/get-topic-game`).then(res => {
          this.setState({ tagOptions: res.data, tag: res.data[0]._id });
        })
        this.getAllSeason();
      }

    getAllSeason = ()=>{
        axios.get(`${config.BE_Domain}/session/get-season`).then( (response)=> {
            this.setState({ listSeason: response.data  });
          })
    }
    async handleAddition(tag, topicName) {
        let check = await false
        for (let i = 0; this.state.tags.length > i; i++) {
            if (this.state.tags[i].id === tag.id) {
            check = await true
            // this.handlePopup('Giá trị bị trùng lặp')
            }
        }
        if (!check) {
            await this.setState(state => ({ tags: [...state.tags, tag], topic: [...state.topic, {"topic": topicName, "size": this.state.size}] }));
        }
        await console.log(this.state.topic)

    }

    async handleDelete(i) {
        const {tags, topic} = this.state;
        // // sendData[tags[i].id] = null;

        await this.setState({
            tags: tags.filter((tag, index) => index !== i),
            topic: topic.filter((tag, index) => index !== i),
        });
        await console.log(this.state.tags)

    }
    handleAdd = async () =>{
        let name = $("select[name='nameValue']").find('option:selected').attr("data-name")
        if(name != "" && name != undefined && this.state.size > 0){
            await this.handleAddition({ id: this.state.tag, text: "Title: "+ name +" - Number question: "+ this.state.size }, this.state.tag);
        }
    }
    handleCreateMission= ()=>{
    axios.post(`${config.BE_Domain}/session/add-season`, {
        "content": this.state.nameMisson,
        "topic": this.state.topic,
        "status":true
    }).then(res => {
        // this.setState({ tagOptions: res.data, tag: res.data[0]._id });
        console.log(res)
        this.getAllSeason();

      })
    }
    render() { 
        return ( 
        <ResponsiveContainer>
        <Row className="wMission">
        <Col md="2">
        <Segment>
            <ListFloated listSeason={this.state.listSeason}/>
        </Segment>
        </Col>
        <Col  md="10">
            <Form>
            <Input
                fluid
                label="Name"
                placeholder='Name misson'
                value={this.state.nameMisson}
                onChange={e => this.setState({nameMisson: e.target.value})}/>
                <Row Cols='three' centered verticalAlign="middle">
                    <Col textAlign="center" md="4">
                    <select class="form-control" id="exampleFormControlSelect1" name="nameValue" onChange={(e) => { this.setState({tag: e.target.value})}} >
                        <option></option>
                    {this.state.tagOptions.map(tagOption => 
                        (<option value={tagOption._id} data-name={tagOption.name}>{tagOption.name}</option>)
                        )}
                    </select>
                    </Col>
                    <Col textAlign="center" md="4">
                    <Input
                        fluid
                        label="Number question"
                        placeholder='Number question'
                        value={this.state.size}
                        onChange={e => this.setState({size: e.target.value})}/>
                    </Col>
                    <Col md="4">
                        <Button onClick={this.handleAdd}>Add</Button>
                    </Col>
              </Row>

            <ReactTags tags={this.state.tags}
                      handleDelete={this.handleDelete}
                      handleAddition={this.handleAddition}
                      />
            <Button onClick={this.handleCreateMission}>Create</Button>
            </Form>
            </Col>
            </Row>
        </ResponsiveContainer>
         );
    }
}

class ListFloated extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
      }
    }
  
    render() {
      const list = []
      this.props.listSeason.map((element, index) => {
        index++;
        list.push(<List.Item key={element._id} className="listQuiz">
          <List.Content floated='right'>
            <Button type="button" icon='close' size='mini' color='red' className="btnDelete"/>
          </List.Content>
          <Icon name='help' />
          <List.Content verticalAlign='middle'>
        <List.Header >Question {index}</List.Header>
            <List.Description>
              {element.content}
            </List.Description>
          </List.Content>
        </List.Item>)
      })
  
    
      return <List divided verticalAlign='middle' relaxed='very'>
          {list}
        </List>
    
  
  }}
export default CreateMissionPage;