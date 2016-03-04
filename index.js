var mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var Schema = mongoose.Schema

// Specify the database to which we will connect
var dbURL = 'mongodb://localhost/stories_app'
// Connect to mongo
mongoose.connect(dbURL, function(err){
      if (err) throw err
      // inform the user that the connection was succesful
      console.log("Succesfully connected to:", dbURL)
})



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var personSchema = Schema({
  name: String
  ,age: Number
  ,stories: [{type: Schema.Types.ObjectId, ref: 'Story'}]
})

var storySchema = Schema({
  _creator: {type: Schema.Types.ObjectId, ref: 'Person'}
  ,title: String
  ,fans: [{type: Schema.Types.ObjectId, ref: 'Person'}]
})

var Person = mongoose.model("Person", personSchema)
var Story = mongoose.model("Story", storySchema)

app.get('/people/',function(req,res){

  Person
    .find({})
    .exec(function(err, results){
      if (err) throw err //handle the error if any

      console.log(results) //print the results
      res.json(results)
    })
})

//////////////////////////////////////////////////////////////////////////
app.get('/people/:id',function(req,res){
  Person.findOne({_id:req.params.id}).populate('stories').exec(function(err,people){
    console.log("Found id",req.params.id)
    res.json(people)
  })
})


app.post('/people/',function(req,res){
  Person.create(req.body, function(err,people){
    console.log("Posted person",req.body)
    res.json({newPerson: people})
  })
})

app.patch('/people/:id',function(req,res){
  Person.findOneAndUpdate({_id:req.params.id},req.body,function(err,people){
    console.log("Updated person",req.body)
    res.json({updatedPeople: people})
  })
})

app.delete('/people/:id',function(req,res){
  Person.findOneAndRemove({_id:req.params.id},function(err,people){
    console.log("Deleted person",req.body)
    res.json({deletedPeople:people})
  })
})

//////////////////////////////////////////////////////////////////////////


app.get('/stories', function(req,res){
  Story.find({},function(err,story){
    if (err) return console.log (err)
    res.json(story)
  })
})

app.get('/stories/:id',function(req,res){
  Story.findOne({_id:req.params.id}).populate('stories').exec(function(err,story){
    res.json(story)

  })
})


app.post('/stories',function(req,res){
  Story.create(req.body, function(err,story){
    if (err) return console.log (err)
    res.json(story)
  })
})





app.post('/stories/:id/people', function(req,res){


  Person.findOne({_id:req.params.id}).populate('stories').exec(function(err,story){

    if(err) return console.log(err)

    var newStory = new Story(req.body)

    newStory._creator = story._id

    newStory.save(function(err){



      story.stories.push(newStory)

      story.save(function(err,story){

      res.json(story)

      })
    })
  })
})


// var arman = new Person({name: "arman", age: 100})
//
// arman.save(function(err, data){
//   if (err) throw err
//
//   console.log("new Person saved")
//
//   var princeOfPersia = new Story({
//     title: "Prince of Persia"
//     ,_creator: arman._id
//   })
//
//   princeOfPersia.save(function(err){
//     if (err) throw err
//
//     arman.stories.push(princeOfPersia)
//     arman.save()
//     console.log("new Story saved")
//   })
// })
//
//
//
//










































// Person
//   .find({name: "arman"})
//   .exec(function(err, results){
//     if (err) throw err //handle the error if any
//
//     console.log(results) //print the results
//   })



app.listen(3000,function(req,res){
  console.log("Now listening on 3000")
})
