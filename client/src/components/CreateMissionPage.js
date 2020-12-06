import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'
import axios from "axios" 
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
import config from '../config/config.js'


// const tagOptions = [
//   { key: 1, value: "Arts", text: 'Arts'},
//   { key: 2, value: "Astronomy", text: 'Astronomy'},
//   { key: 3, value: "Biology", text: 'Biology'},
//   { key: 4, value: "Chemistry", text: 'Chemistry'},
//   { key: 5, value: "ComputerScience", text: 'Computer Science'},
//   { key: 6, value: "Geography", text: 'Geography'},
//   { key: 7, value: "History", text: 'History'},
//   { key: 8, value: "Languages", text: 'Languages'},
//   { key: 9, value: "Literature", text: 'Literature'},
//   { key: 10, value: "Math", text: 'Math'},
//   { key: 11, value: "Music", text: 'Music'},
//   { key: 12, value: "Physics", text: 'Physics'},
//   { key: 13, value: "Science", text: 'Science'},
//   { key: 14, value: "Sport", text: 'Sport'},
//   { key: 15, value: "Trivia", text: 'Trivia'},
// ]
class CreateMissionPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${config.basic_BE_domain}`,
      listSeason: [],
      tagOptions: [],
      AddOrEditQuiz: false,
      checkAdd: false,
      quizset: {}
    }
    this.hiddenOrShowEditQuizForm = this.hiddenOrShowEditQuizForm.bind(this)
    this.addSeason = this.addSeason.bind(this);
    this.setQuizId = this.setQuizId.bind(this);
   

  }
  setQuizId(dataEdit){
    this.setState({quizset: dataEdit, checkAdd: false});
    this.hiddenOrShowEditQuizForm(true)
  }
  hiddenOrShowEditQuizForm(e) {
    this.setState({AddOrEditQuiz: e})
  }
  componentDidMount () {
    axios.get(`${config.BE_Domain}/session/get-topic-game`).then(res => {
      this.setState({ tagOptions: res.data });
    })
    this.getAllSeason();

  }
  getAllSeason = ()=>{
    axios.get(`${config.BE_Domain}/session/get-season`).then( (response)=> {
        this.setState({ listSeason: response.data  });
      })
  }
  addSeason() {
    this.hiddenOrShowEditQuizForm(true)
      this.setState({ checkAdd: true})
      console.log(this.state)
    // })
  }
  handleChangeValueTag=(val)=>{
    this.setState({ tag:  val});
  }
  render() {
    const {AddOrEditQuiz, checkAdd} = this.state;
   
    const AddOrEditQuestion = () => {
      if(AddOrEditQuiz ){
        if (checkAdd) {
          return <CreateMission tagOptions={this.state.tagOptions}  getAllSeason={this.getAllSeason} handleChangeValueTag={this.handleChangeValueTag} hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm}/>
        } 
        else {
          return <EditMission tagOptions={this.state.tagOptions} quizset={this.state.quizset} getAllSeason={this.getAllSeason} handleChangeValueTag={this.handleChangeValueTag} hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm}/>
        }
      }
    }
    return (
      <ResponsiveContainer>
        <Form onSubmit={this.handleSubmit} style={{marginTop: 80}} className="question">       
        <Segment>
          <Grid columns={2} divided style={{height: 800}}>
            <Grid.Row>
              <Grid.Column width={4} stretched>
                <Grid columns={1} >
                  <Grid.Row style={{height: 600}}>
                    <Grid.Column width={16} style={{height: 600, overflow:'auto'}}>
                      <ListFloated listSeason={this.state.listSeason} getAllSeason={this.getAllSeason} hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm} setQuizId={this.setQuizId}/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                  
                    <Grid.Column>
                    
                      <Button fluid size='large' type="button" onClick={()=>{this.addSeason()}}>Add Season</Button>
                        <Confirm
                          open={this.state.saved}
                          content={this.state.savedMsg}
                          onCancel={()=>{this.setState({saved: false, savedMsg: ""})}}
                          onConfirm={()=>{this.setState({saved: false, savedMsg: ""})}}
                        />
                     
                    </Grid.Column> 
                  </Grid.Row>
                </Grid>
                
              </Grid.Column>
              <Grid.Column width={12}>
                <Grid textAlign='center'>
                  <Grid.Row>
                    <Grid.Column>
                      {AddOrEditQuestion()}
                    </Grid.Column>
                  </Grid.Row>
                 
                  <Grid.Row style={{marginTop: '1.5em'}}>
                    
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            
          </Grid>
        </Segment>
        </Form>
    </ResponsiveContainer>
    )
  }

}

class ListFloated extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  deleteQuiz (deleteId) {
    console.log(deleteId)
    axios.post(`${config.BE_Domain}/session/update-season-status?seasonId=${deleteId}`, {
      "status":false
  }).then(res => {
        this.props.hiddenOrShowEditQuizForm(false)
        this.props.getAllSeason()
      })
  }
  undeleteQuiz (deleteId) {
    console.log(deleteId)
    axios.post(`${config.BE_Domain}/session/update-season-status?seasonId=${deleteId}`, {
      "status": true
  }).then(res => {
        this.props.hiddenOrShowEditQuizForm(false)
        this.props.getAllSeason()
      })
  }
  render() {
    const list = []
    this.props.listSeason.map((element, index) => {
      index++;
      list.push(<List.Item key={element._id} className="listQuiz" onClick={()=>{this.props.setQuizId(element)}}>
        <List.Content floated='right'>
        {element.status ? <Button type="button" icon='hide' size='mini' color='red' onClick={()=>{this.deleteQuiz(element._id)}} className="btnDelete"/> : 
        <Button type="button" icon='globe' size='mini' color='green' onClick={()=>{this.undeleteQuiz(element._id)}} className="btnDelete"/>}
          
        </List.Content>
        {element.status ? <Icon name='globe' /> : <Icon name='hide' />}
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


class CreateMission extends Component {
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
            status: false
          }
          this.handleDelete = this.handleDelete.bind(this);
          this.handleAddition = this.handleAddition.bind(this);
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

            await this.setState(state => ({ tags: [...state.tags, tag], topic: [...state.topic, {"topic": tag.id, "size": Number(this.state.size)}] }));
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
        let id = $("select[name='nameValue']").find('option:selected').val()
        if(name != "" && name != undefined && this.state.size > 0){
            await this.handleAddition({ id: id, text: "Title: "+ name +" - Number question: "+ this.state.size }, name);
        }
    }
    handleCreateMission= ()=>{
    axios.post(`${config.BE_Domain}/session/add-season`, {
      "content": this.state.nameMisson,
      "topic": this.state.topic,
      "status": this.state.status
  }).then(res => {
        // this.setState({ tagOptions: res.data, tag: res.data[0]._id });
        console.log(res)
        this.props.getAllSeason();
        this.props.hiddenOrShowEditQuizForm(false)
      })
    }
    render() { 
        return ( 
            <Form>
            <Input
                fluid
                label="Name"
                placeholder='Name misson'
                value={this.state.nameMisson}
                onChange={e => this.setState({nameMisson: e.target.value})}/>
                <Row Cols='three' centered verticalAlign="middle">
                    <Col textAlign="center" md="4">
                    <select class="form-control" id="exampleFormControlSelect1" name="nameValue" onChange={(e) => this.props.handleChangeValueTag(e.target.value)} >
                        <option></option>
                    {this.props.tagOptions.map(tagOption => 
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
            <Row>
              <h5>Public Now</h5>
              <Col className="radio" md="3">
                <input id="radio-1" name="radio" type="radio" onChange={e => this.setState({ status: true })}/>
                <label htmlFor="radio-1" className="radio-label">Yes</label>
              </Col>
              <Col className="radio"  md="3">
                <input id="radio-2" name="radio" type="radio" onChange={e => this.setState({ status: false })}/>
                <label htmlFor="radio-2" className="radio-label">No</label>
              </Col>
            </Row>

            <Button onClick={this.handleCreateMission}>Create</Button>
            </Form>
         );
    }
}

class EditMission extends Component {
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
          status: false,
          idSeason: ""
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
  }

  componentDidMount(){
    console.log(this.props.quizset)
    // this.setState({ roomPIN: this.props.roomPIN })
    this.setState({ nameMisson: this.props.quizset.content , idSeason: this.props.quizset._id})
    for (let index = 0; index < this.props.quizset.Games.length; index++) {
      this.setState(state => ({ tags: [...state.tags, { id:  this.props.quizset.Games[index].topic, text: "Title: "+  this.props.quizset.Games[index].name +" - Number question: "+  this.props.quizset.Games[index].size }], topic: [...state.topic, {"topic": this.props.quizset.Games[index].topic, "size": Number(this.props.quizset.Games[index].size)}] }))
      
    }
  }
  async handleAddition(tag, topicName) {
    let check = await false
    for (let i = 0; this.state.tags.length > i; i++) {
        if (this.state.tags[i].id === tag.id) {
          console.log(this.state.tags[i].id)
          console.log(tag.id)
        check = await true
        // this.handlePopup('Giá trị bị trùng lặp')
        }
    }
    if (!check) {
        await this.setState(state => ({ tags: [...state.tags, tag], topic: [...state.topic, {"topic": tag.id, "size": Number(this.state.size)}] }));
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
    let id = $("select[name='nameValue']").find('option:selected').val()
    if(name != "" && name != undefined && this.state.size > 0){
        await this.handleAddition({ id: id, text: "Title: "+ name +" - Number question: "+ this.state.size }, name);
    }
  }
  handleUpdateMission= ()=>{
  axios.post(`${config.BE_Domain}/session/update-season?Id=${this.state.idSeason}`, {
    "topicRemove": [],
    "topicAdd": this.state.topic,
    "content": this.state.nameMisson,
}).then(res => {
      // this.setState({ tagOptions: res.data, tag: res.data[0]._id });
      console.log(res)
      this.props.getAllSeason();
      this.props.hiddenOrShowEditQuizForm(false)

    })
  }
  render() { 
    console.log(this.props.quizset)
      return ( 
          <Form>
          <Input
              fluid
              label="Name"
              placeholder='Name misson'
              value={this.state.nameMisson}
              onChange={e => this.setState({nameMisson: e.target.value})}/>
              <Row Cols='three' centered verticalAlign="middle">
                  <Col textAlign="center" md="4">
                  <select class="form-control" id="exampleFormControlSelect1" name="nameValue" onChange={(e) => this.props.handleChangeValueTag(e.target.value)} >
                      <option></option>
                  {this.props.tagOptions.map(tagOption => 
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
          <Button onClick={this.handleUpdateMission}>Update</Button>
          </Form>
       );
  }
}
export default CreateMissionPage