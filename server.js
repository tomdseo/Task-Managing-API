const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //MUST DO THIS FOR EXPRESS 4 UPDATE

const app = express();
app.listen(1337, () => console.log("suhhh dude 1337"));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: true})); //................FOR POSTMAN, change "extended" to true!!!!!!!!
app.use(bodyParser.json()) //.......................................FOR POSTMAN, add this statement!!!!!!!!!!

const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/taskDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}); //!!localhost/... is name of DataBase

const TaskSchema = new Schema({ //!!Schema in Mongoose is a structure for each Document
    title: {type: String},
    description: {type: String}
}, {timestamps: true }); //.....................adds "createdAt" and "updatedAt" properties to TaskDocument(s)

// create an object to that contains methods for mongoose to interface with MongoDB
const TaskModel = mongoose.model('TaskDocument', TaskSchema); //!!Model in Mongoose is a structure for each Collection

//..................................................................................RESTful Notation
app.get('/tasks', (req, res) => {
    // TaskModel.remove({}, ()=> console.log('empty')); //remove all Data from Collection
    TaskModel.find()
    .then(data => res.json(data))
});

app.get('/tasks/:id/', (req, res) => {
    TaskModel.find({_id: req.params.id})
    .then(data => res.json(data))
});

app.post('/tasks', (req, res) => {
    const task = new TaskModel();
    task.title = req.body.title,
    task.description = req.body.description,
    task.save()
    .then(res.redirect('/tasks'));
});

app.put('/tasks/:id', (req, res) => {
    TaskModel.updateOne({_id: req.params.id}, {$set: {title: req.body.title, description: req.body.description}}, {runValidators: true})
    .then(res.redirect('/tasks'));
});

app.delete('/tasks/:id', (req, res) => {
    TaskModel.deleteOne({_id: req.params.id})
    .then(res.redirect('/tasks'));
});