const User = require('../models/models.js').User;
const Err = require('../models/models.js').Error;
const jwt = require('jsonwebtoken')

module.exports = {


// modified by Hoan
// change from callback to async
// date: 2020/9/4

 // modified by Hoan
    // change to try catch
    // date: 2020/9/14
  async createUser(req, res) { 
    try {
   
    const filter = {
      username: req.body.user.username
    };
   
       const user= await User.findOne(filter);
        if (user != null) {
          res.send({
            username: null
          })
        } else {
          let user = new User(req.body.user);
          user.save().then(function (obj) {
            console.log("New user", obj._id);
            res.send({
              username: obj.username
            })
          })
        }
    }catch(error){
      let err = new Err();
      err.content=error;
      err.save(err);
      res.sendStatus(500);
  }
  },

   // modified by Hoan
    // change to try catch
    // date: 2020/9/14
  async userLogin(req, res) {
    // console.log(req)
    try {      
      console.log("user-login " + req.body.username)
      console.log("user-login " + req.body.password)
      const filter = {
        username: req.body.username,
        password: req.body.password
      };
  
      let user = await User.findOne(filter)
      if (!user) {
        console.log(user)
        return res.send(500)
      }
      user = user.toJSON()
      delete user.password
      const token = await jwt.sign(user,"ichallenge")
      console.log(token)
      return res.send(Object.assign(user, { token }))
    } catch (error) {
      let err = new Err();
      err.content=error;
      err.save(err);
      return res.send(400)
    }
  },

  async login(req, res) {
    console.log(req.headers)
    const {
      username,
      password
    } = req.body
    const filter = {
      username,
      password
    }

    const user = await User.findOne(filter, {
      username
    })
    // console.log(user)
    if (!user) {
      res.sendStatus(500)
    }

    res.header('authorization', 'Basic ' + user); 
  }
}