const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const uri = 'mongodb://Luq:Haslo1@cluster0-shard-00-00-gw1sh.mongodb.net:27017,cluster0-shard-00-01-gw1sh.mongodb.net:27017,cluster0-shard-00-02-gw1sh.mongodb.net:27017/TodoList?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
const db = mongoose.connect(uri, {useNewUrlParser: true}, () => {
    console.log('connected');
    
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public/'));

const router = express.Router();

router.use((req,res,next) => {
    console.log('Connection');
    next();
})

router.route('/posts')
    .post((req,res) =>{
    const newTodo = req.body;
    const newPost = new Post({
        text: newTodo.text,
        completed: newTodo.completed
    })

    newPost.save()
        .then(result => {
        console.log(result);
        res.json({"Status": "ok"});
        })
        .catch(err => console.log(err));

    
    
    })
    .get((req,res) => {

        Post.find((err,posts) => {
            if(err){
                res.send(err);
            } else {
                res.json(posts);
            }
        })
    })


router.route('/posts/:post_id')
    .get((req,res) => {
        Post.findById(req.params.post_id, (err,post) => {
            if(err){
                res.send(err);
            } else {
                res.json(post);
            }
        })
    })
    .put((req,res) =>{
        Post.findById(req.params.post_id, (err,post) => {
            if(err){
                res.send(err);
            } else {
                post.completed = req.body.completed;
                
                if(req.body.text){
                    post.text = req.body.text;
                }

                post.save(err => {
                    if(err){
                        res.send(err);
                    } else {
                        res.json({message: 'Post updated'});
                    }
                })
            }
        })
    })
    .delete((req,res) => {
        Post.deleteOne({_id: req.params.post_id}, (err,post) => {
            if(err){
                res.send(err);
            } else {
                res.json({ message: 'Successfully deleted'});
            }
        })
    })

app.use('/api', router);

app.listen(3000, () =>{
    console.log('Server uruchomiony na porcie 3000');
});