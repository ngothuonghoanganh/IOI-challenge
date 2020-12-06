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
  Confirm,
  Checkbox
} from 'semantic-ui-react'
import ResponsiveContainer from './ResponsiveContainer'
import config from '../config/config.js'
import Cookies from 'js-cookie'


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

class CreateQuestionPage extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `${config.basic_BE_domain}`,
      quizsetID: "",
      roomPIN: 0,
      players: [],
      redirect: false,
      quizset:[],
      currentQuiz:{},
      currentQuizId: "",
      name: "",
      tag: [],
      AddOrEditQuiz: false,
      error: false,
      errorMsg: "",
      saved: false,
      savedMsg: "",
      checkAdd: false,
      tagOptions: [],
      nameTag: "",
      redirectMisson: false
    }
   
    this.loadQuizSet = this.loadQuizSet.bind(this);
    this.setQuizSet = this.setQuizSet.bind(this);
    this.setQuizId = this.setQuizId.bind(this);
    this.getQuestionById = this.getQuestionById.bind(this);
    // this.saveQuizset = this.saveQuizset.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.hiddenOrShowEditQuizForm = this.hiddenOrShowEditQuizForm.bind(this)
    this.handleMisson = this.handleMisson.bind(this)
  }

  componentDidMount () {
    this.loadQuizSet();
    axios.get(`${config.BE_Domain}/session/get-topic-game`).then(res => {
      this.setState({ tagOptions: res.data, tag: this.state.currentQuiz.topic });
    })
  }
  addQuestion(id) {
    this.hiddenOrShowEditQuizForm(true)
      this.setState({AddOrEditQuiz: true, checkAdd: true})
    // })
  }
  handleMisson(){
    this.setState({ redirectMisson: true });
  }
  hiddenOrShowEditQuizForm(e) {
    this.setState({AddOrEditQuiz: e})
  }
  loadQuizSet() {
    console.log("Incoming ID"+ this.state.newQuizsetID)
    // Loads quizset to the page
    // POST to express API to add a new game session to the DB collection
    axios.get(`${config.BE_Domain}/question/getAll-question`).then(res => {
      console.log(res.data)
      this.setState({ quizset: res.data });
      }
      )
  }

  handleChangeSelect =(newIDSelect)=>{
    this.setState({ tag:  newIDSelect});
  }
  getQuestionById(quizId) {
    if (quizId == "") return
    console.log("getQuestionById id = " + quizId)

    axios.get(`${config.BE_Domain}/quizset/get-quiz?id=${quizId}`).then(res => {
      // console.log(res);
      if (res.data) {
        this.setState({currentQuiz:res.data})
        this.handleChangeSelect(this.state.currentQuiz.topic)
        console.log(this.state.currentQuiz);

      } 
      return;
      })
      var quiz = {content: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
      time: "",
      picture: ""}
      this.setState({currentQuiz:quiz})
     
  }

  setQuizId (id) {
    this.setState({quizsetID: id, checkAdd: false});
    this.getQuestionById(id);
    this.hiddenOrShowEditQuizForm(true)
  }
  setQuizSet (quizset) {
    this.setState({quizset: quizset})
  }

  render() {
    const {AddOrEditQuiz, checkAdd} = this.state;
    if(this.state.redirect){
      // Finish creating questions, redirecting to hosting page
      return <Redirect to={{
        pathname:`/host/${this.state.roomPIN}`,
        state: {quizsetID: this.state.newQuizsetID}
      }} />
    }
    if(this.state.redirectMisson){
      // Finish creating questions, redirecting to hosting page
      return <Redirect to={{
        pathname:`/admin-misson`,
        // state: {quizsetID: this.state.newQuizsetID}
      }} />
    }
   
    const AddOrEditQuestion = () => {
      if(AddOrEditQuiz ){
        if (!checkAdd) {
          return <EditQuestionForm quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} loadQuizSet={this.loadQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} quiz={this.state.currentQuiz}
          hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm} checkAdd={this.state.checkAdd} tag={this.state.tag} handleChangeSelect={this.handleChangeSelect}/>
        } else {
          return <AddQuestionForm setQuizSet={this.setQuizSet} loadQuizSet={this.loadQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} quiz={this.state.currentQuiz}
          hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm} tag={this.state.tag} handleChangeSelect={this.handleChangeSelect}/>
        }
      }
    }
    return (
      <ResponsiveContainer>
        <Form onSubmit={this.handleSubmit} style={{marginTop: 80}} className="question">
          <Grid columns={4} divided>
            <Grid.Row centered verticalAlign="middle">
              <Grid.Column textAlign="center" width={4}>
                <Button onClick={this.handleMisson}>Create Mission</Button>
              </Grid.Column>
            <Grid.Column width={4}>
            <Input
                fluid
                label="Name"
                placeholder='Add name for Quizset'
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}/>
            </Grid.Column>
            <Grid.Column width={5}>
            {/* <Dropdown
              placeholder='Choose the tag'
              fluid
              multiple
              search
              selection
              options={this.state.tagOptions}
              value={this.state.nameTag}
              onChange={(e) => 
              { this.setState({tag: e.target._id, nameTag: e.target.name})}} 
            /> */}
            <select class="form-control" id="exampleFormControlSelect1"  onChange={(e) => { this.setState({tag: e.target.value})}}  value={this.state.tag}>
              <option></option>
              {this.state.tagOptions.map(tagOption => 
                (<option value={tagOption._id}>{tagOption.name}</option>)
              )}
            </select>
                </Grid.Column>
              {/* <Grid.Column textAlign="center" width={2}><Button primary type="button" name="save" onClick={()=>{this.saveQuizset()}}>Update</Button></Grid.Column> */}
              </Grid.Row>
          </Grid>
          
        <Segment>
          <Grid columns={2} divided style={{height: 800}}>
            <Grid.Row>
              <Grid.Column width={4} stretched>
                <Grid columns={1} >
                  <Grid.Row style={{height: 600}}>
                    <Grid.Column width={16} style={{height: 600, overflow:'auto'}}>
                      <ListFloated hiddenOrShowEditQuizForm={this.hiddenOrShowEditQuizForm} quizset={this.state.quizset} quizsetID={this.state.quizsetID} setQuizSet={this.setQuizSet} setQuizId={this.setQuizId} id={this.state.currentQuizId} loadQuizSet={this.loadQuizSet}/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row textAlign='center'>
                  
                    <Grid.Column>
                    
                      <Button fluid size='large' type="button" onClick={()=>{this.addQuestion("")}}>Add Question</Button>
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
        quizset: props.quizset,
        quizsetID: props.quizsetID,
        currentQuizId:props.id
    }
    this.deleteQuiz = this.deleteQuiz.bind(this);
  }


  componentWillReceiveProps(props) {
    this.setState({ quizset: props.quizset })
    this.setState({ quizsetID: props.quizsetID })
    this.setState({ currentQuizId: props.id })
  }

  deleteQuiz (deleteId) {
    axios.post(`${config.BE_Domain}/question/delete-question?questionId=${deleteId}`).then(res => {
        this.props.hiddenOrShowEditQuizForm(false)
        this.props.loadQuizSet()
      })

  }

  render() {
    const list = []
    const pending = []
    this.state.quizset.map((element, index) => {
      index++;
      if(element.status){
      list.push(<List.Item key={element._id} onClick={()=>{this.props.setQuizId(element._id)}} className="listQuiz">
        <List.Content floated='right'>
          <Button type="button" icon='close' size='mini' color='red' onClick={()=>{this.deleteQuiz(element._id)}} className="btnDelete"/>
        </List.Content>
        <Icon name='help' />
        <List.Content verticalAlign='middle'>
      <List.Header >Question {index}</List.Header>
          <List.Description>
            {element.content}
          </List.Description>
        </List.Content>
      </List.Item>)}
      else{
        pending.push(<List.Item key={element._id} onClick={()=>{this.props.setQuizId(element._id)}} className="listQuiz">
        <List.Content floated='right'>
          <Button type="button" icon='close' size='mini' color='red' onClick={()=>{this.deleteQuiz(element._id)}} className="btnDelete"/>
        </List.Content>
        <Icon name='help' />
        <List.Content verticalAlign='middle'>
      <List.Header >Question {index}</List.Header>
          <List.Description>
            {element.content}
          </List.Description>
        </List.Content>
      </List.Item>)
      }
    })

  
    return <>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Active</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="pending-tab" data-toggle="tab" href="#pending" role="tab" aria-controls="pending" aria-selected="false">Pending</a>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <List divided verticalAlign='middle' relaxed='very' style={{marginTop: "20px"}}>
            {list}
          </List>
        </div>
        <div className="tab-pane fade" id="pending" role="tabpanel" aria-labelledby="pending-tab">
          <List divided verticalAlign='middle' relaxed='very' style={{marginTop: "20px"}}>
            {pending}
          </List>
        </div>
      </div>


  </>

}}

const options = [
  { key: 1, value: "1", icon: 'star outline', text: 'Option 1'},
  { key: 2, value: "2", icon: 'heart outline', text: 'Option 2'},
  { key: 3, value: "3", icon: 'square outline', text: 'Option 3'},
  { key: 4, value: "4", icon: 'circle outline', text: 'Option 4'}
]
class AddQuestionForm extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
        quizsetID: 0,
        // quizsetID: 
        content: "",
        picture: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        time: null,
        roomPIN: "",
        id: "",
        image:"",
        filename:"Upload image from your computer",
        error: false,
        errorMsg: "",
        idNickname: Cookies.get("token")
    }

    this.validateQuiz = this.validateQuiz.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  componentWillReceiveProps(props) {
    // this.setState({ roomPIN: props.roomPIN })
    this.setState({ id: "" })
    this.setState({ content:""})
    this.setState({ option1: ""})
    this.setState({ option2:""})
    this.setState({ option3: ""})
    this.setState({ option4:""})
    this.setState({ answer:""})
    this.setState({ time:""})
    this.setState({ quizsetID: "" })
    this.setState({picture:""})
  }

  // componentDidMount() {
  //   this.getQuestionById();
  // }

  validateQuiz() {
    
    const {content, option1, option2, option3, option4, answer, time} = this.state
    if (content == null || content === "") {
      this.setState({errorMsg: "Please input the question!"});
      this.setState({error: true});
      return true;
    }

    if (time == null || time === 0) {
      this.setState({errorMsg: "Please input the time!"});
      this.setState({error: true});
      return true;
    }
    if (option1 == null || option1 === "" || option2 == null || option2 === ""
    || option3 == null || option3 === "" || option4 == null || option4 === "") {
      this.setState({errorMsg: "Please input four options!"});
      this.setState({error: true});
      return true;
    }
    if (answer == null || answer === "") {
      this.setState({errorMsg: "Please input the correct answer!"});
      this.setState({error: true});
      return true;
    }

   
    
    return false;
  }

  uploadFiles(){
    if (this.state.image !== "") {
      const formData = new FormData()
      formData.append('image', this.state.image)
      axios.post(`${config.BE_Domain}/quizset/upload_image`, formData, {
      }).then(res => {
          this.setState({uploading: false, picture: res.data.image.filename})
          console.log(res)
      })
    }
  }

  removeImage() {
    this.setState({filename: "Upload image from your computer", image:"", picture:""})
  }

  onChange = e => {
    const file = e.target.files[0].name
    this.setState({ filename: file, image: e.target.files[0]})
  }


  saveQuestion() {
    console.log("QUIZSET", this.state.quizsetID)
    // console.log("game pin " + this.state.roomPIN)
    console.log("game answer " + this.state.answer)
    let add = {
      "questions": {"content": this.state.content, "time": this.state.time}, "answers": {
        "option1":this.state.option1,
        "option2":this.state.option2,
        "option3":this.state.option3,
        "option4":this.state.option4,
        "answer": JSON.parse(this.state.answer),

      },
      "status":true,
      "token": this.state.idNickname,
      "type": this.props.tag
    }
    // POST to express API to add a new game session to the DB collection
    axios.post(`${config.BE_Domain}/question/add-question`, add).then(res => {
      console.log(res)
      this.props.hiddenOrShowEditQuizForm(false)
      this.props.loadQuizSet()
      })
  }
 
  render() {
    const{uploading, filename, picture} = this.state;

  const content = () => {
    switch(true) {
      case uploading:
        return  <Segment placeholder size='large'>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Segment>
      case picture != null && picture !== "":
        return  <Segment placeholder size='large' >
                <Image centered src={picture} size="medium"/>
                               <Segment.Inline> 
                                 <Button type="button" id="file" primary onClick={this.removeImage}>Remove Image</Button>
                              </Segment.Inline>
                </Segment>
      default:
        return   <Segment placeholder size='large'><Header icon>
                         <Icon name='file image outline' />
                         {filename}
                       </Header>
                       <Segment.Inline> 
                       <label for="file" class="ui icon button">
                           <i class="file icon"></i>
                           Open File</label>
                       <input type="file" id="file" name="file" hidden onChange={this.onChange}/>
                       
                       <Button type="button" id="file" primary onClick={this.uploadFiles}>Upload File</Button>
                       </Segment.Inline>
                       
                       </Segment>
                      
                       
    }

  }
  return <Form size='massive'>
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            fluid
            placeholder='Click to start typing your question'
            // style={{marginTop: '1em'}}
            value={this.state.content}
            onChange={e => this.setState({content: this.props.checkAdd ? "" : e.target.value})}
            size='massive'
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered verticalAlign='center'>
        <Grid.Column width={14}><Segment><Segment.Inline><Input
              fluid
              label="Time"
              placeholder='Add Time Limit Seconds'
              value={this.state.time}
              onChange={e => this.setState({time: e.target.value})}
          /></Segment.Inline></Segment></Grid.Column></Grid.Row>
      <Grid.Row centered verticalAlign='center' style={{height: 270}}>
        
        <Grid.Column width={14}>
          {content()}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Input
              fluid
              icon='star outline'
              iconPosition='left'
              placeholder='Add Answer 1'
              value={this.state.option1}
              onChange={e => this.setState({option1: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              icon='heart outline'
              iconPosition='left'
              placeholder='Add Answer 2'
              value={this.state.option2}
              onChange={e => this.setState({option2: e.target.value})}
            />
            </Grid.Column>
            </Grid.Row>
      <Grid.Row columns={2}>
          <Grid.Column>
          <Form.Input
              fluid
              icon='square outline'
              iconPosition='left'
              placeholder='Add Answer 3'
              value={this.state.option3}
              onChange={e => this.setState({option3: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
          <Form.Input
              icon='circle outline'
              iconPosition='left'
              placeholder='Add Answer 4'
              value={this.state.option4}
              onChange={e => this.setState({option4: e.target.value})}
          />
          </Grid.Column>
      </Grid.Row>
     
      <Grid.Row centered verticalAlign='center'>
         <Grid.Column width={6}>
          {/* <Label size="big">Answer</Label> */}
          <Menu compact>
            <Dropdown placeholder='Answer' options={options}  onChange={(e,{value}) => 
              { this.setState({answer: value})}} value={this.state.answer} selection />
          </Menu>
      </Grid.Column>
            <Grid.Column width={4}>
            <Button type="button" size='large' color='red' onClick={()=>{if (!this.validateQuiz()) this.saveQuestion()}}>Save Question</Button>
            <Confirm
              open={this.state.error}
              content={this.state.errorMsg}
              onCancel={()=>{this.setState({error: false, errorMsg: ""})}}
              onConfirm={()=>{this.setState({error: false, errorMsg: ""})}}
            />
            </Grid.Column>
       </Grid.Row>
         
    </Grid>

    
</Form>
  }
}
class EditQuestionForm extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
        quizsetID: 0,
        // quizsetID: 
        content: "",
        picture: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        time: null,
        roomPIN: "",
        id: "",
        image:"",
        filename:"Upload image from your computer",
        error: false,
        errorMsg: ""
    }

    this.validateQuiz = this.validateQuiz.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  componentWillReceiveProps(props) {
    // this.setState({ roomPIN: props.roomPIN })
    this.setState({ id: props.id })
    this.setState({ content:props.quiz.content})
    this.setState({ option1:props.quiz.option1})
    this.setState({ option2:props.quiz.option2})
    this.setState({ option3:props.quiz.option3})
    this.setState({ option4:props.quiz.option4})
    this.setState({ answer:props.quiz.answer})
    this.setState({ time:props.quiz.time})
    this.setState({ quizsetID: props.quizsetID })
    this.setState({picture:props.quiz.picture})
    this.setState({status:props.quiz.status})
  }

  // componentDidMount() {
  //   this.getQuestionById();
  // }

  validateQuiz() {
    
    const {content, option1, option2, option3, option4, answer, time} = this.state
    if (content == null || content === "") {
      this.setState({errorMsg: "Please input the question!"});
      this.setState({error: true});
      return true;
    }

    if (time == null || time === 0) {
      this.setState({errorMsg: "Please input the time!"});
      this.setState({error: true});
      return true;
    }
    if (option1 == null || option1 === "" || option2 == null || option2 === ""
    || option3 == null || option3 === "" || option4 == null || option4 === "") {
      this.setState({errorMsg: "Please input four options!"});
      this.setState({error: true});
      return true;
    }
    if (answer == null || answer === "") {
      this.setState({errorMsg: "Please input the correct answer!"});
      this.setState({error: true});
      return true;
    }

   
    
    return false;
  }

  uploadFiles(){
    if (this.state.image !== "") {
      const formData = new FormData()
      formData.append('image', this.state.image)
      axios.post(`${config.BE_Domain}/quizset/upload_image`, formData, {
      }).then(res => {
          this.setState({uploading: false, picture: res.data.image.filename})
          console.log(res)
      })
    }
  }

  removeImage() {
    this.setState({filename: "Upload image from your computer", image:"", picture:""})
  }

  onChange = e => {
    const file = e.target.files[0].name
    this.setState({ filename: file, image: e.target.files[0]})
  }


  saveQuestion() {
    
    console.log("QUIZSET", this.state.quizsetID)
    // console.log("game pin " + this.state.roomPIN)
    console.log("game answer " + this.state.answer)
    let newUpdate = {
      "questions": {"content": this.state.content, "time": this.state.time}, "answers": {
        "option1":this.state.option1,
        "option2":this.state.option2,
        "option3":this.state.option3,
        "option4":this.state.option4,
        "answer": JSON.parse(this.state.answer)
    },
    "type": this.props.tag
    }
    console.log(newUpdate)
    // POST to express API to add a new game session to the DB collection
    axios.post(`${config.BE_Domain}/question/update-question?questionId=${this.state.quizsetID}`, newUpdate).then(res => {
      console.log(res)
      this.updateStatus();
      this.props.hiddenOrShowEditQuizForm(false)
      this.props.loadQuizSet()
      })
  }
  updateStatus=()=>{
      axios.post(`${config.BE_Domain}/question/update-question-status?questionId=${this.state.quizsetID}`, {"status":this.state.status}).then(res => {
        console.log(res)
        })
  }
  checkboxChangeHandler = (event: React.FormEvent<HTMLInputElement>, data) => {
    const value = data.checked;
    this.setState({ status: data.checked });
  };

  render() {
    const{uploading, filename, picture} = this.state;

  const content = () => {
    switch(true) {
      case uploading:
        return  <Segment placeholder size='large'>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Segment>
      case picture != null && picture !== "":
        return  <Segment placeholder size='large' >
                <Image centered src={picture} size="medium"/>
                               <Segment.Inline> 
                                 <Button type="button" id="file" primary onClick={this.removeImage}>Remove Image</Button>
                              </Segment.Inline>
                </Segment>
      default:
        return   <Segment placeholder size='large'><Header icon>
                         <Icon name='file image outline' />
                         {filename}
                       </Header>
                       <Segment.Inline> 
                       <label for="file" class="ui icon button">
                           <i class="file icon"></i>
                           Open File</label>
                       <input type="file" id="file" name="file" hidden onChange={this.onChange}/>
                       
                       <Button type="button" id="file" primary onClick={this.uploadFiles}>Upload File</Button>
                       </Segment.Inline>
                       
                       </Segment>
                      
                       
    }

  }
  return <Form size='massive'>
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            fluid
            placeholder='Click to start typing your question'
            // style={{marginTop: '1em'}}
            value={this.state.content}
            onChange={e => this.setState({content: this.props.checkAdd ? "" : e.target.value})}
            size='massive'
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered verticalAlign='center'>
        <Grid.Column width={14}><Segment><Segment.Inline><Input
              fluid
              label="Time"
              placeholder='Add Time Limit Seconds'
              value={this.state.time}
              onChange={e => this.setState({time: e.target.value})}
          /></Segment.Inline></Segment></Grid.Column></Grid.Row>
      <Grid.Row centered verticalAlign='center' style={{height: 270}}>
        
        <Grid.Column width={14}>
          {content()}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Form.Input
              fluid
              icon='star outline'
              iconPosition='left'
              placeholder='Add Answer 1'
              value={this.state.option1}
              onChange={e => this.setState({option1: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              fluid
              icon='heart outline'
              iconPosition='left'
              placeholder='Add Answer 2'
              value={this.state.option2}
              onChange={e => this.setState({option2: e.target.value})}
            />
            </Grid.Column>
            </Grid.Row>
      <Grid.Row columns={2}>
          <Grid.Column>
          <Form.Input
              fluid
              icon='square outline'
              iconPosition='left'
              placeholder='Add Answer 3'
              value={this.state.option3}
              onChange={e => this.setState({option3: e.target.value})}
          />
          </Grid.Column>
          <Grid.Column>
          <Form.Input
              icon='circle outline'
              iconPosition='left'
              placeholder='Add Answer 4'
              value={this.state.option4}
              onChange={e => this.setState({option4: e.target.value})}
          />
          </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={12}>
          <Grid.Column>
            <Checkbox toggle onChange={this.checkboxChangeHandler} checked={this.state.status}/>
          </Grid.Column>
          <Grid.Column width={11} style={{textAlign:"left"}}>
            <h5>Approve questions that have been contributed</h5>
          </Grid.Column>
      </Grid.Row>
      <Grid.Row centered verticalAlign='center'>
         <Grid.Column width={6}>
          {/* <Label size="big">Answer</Label> */}
          <Menu compact>
            <Dropdown placeholder='Answer' options={options}  onChange={(e,{value}) => 
              { this.setState({answer: value})}} value={this.state.answer} selection />
          </Menu>
      </Grid.Column>
            <Grid.Column width={4}>
            <Button type="button" size='large' color='red' onClick={()=>{if (!this.validateQuiz()) this.saveQuestion()}}>Save Question</Button>
            <Confirm
              open={this.state.error}
              content={this.state.errorMsg}
              onCancel={()=>{this.setState({error: false, errorMsg: ""})}}
              onConfirm={()=>{this.setState({error: false, errorMsg: ""})}}
            />
            </Grid.Column>
       </Grid.Row>
         
    </Grid>

    
</Form>
  }
}
  
export default CreateQuestionPage