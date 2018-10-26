const express = require('express');
const fs = require('fs');
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

app.get('/data', (req,res) => {

    Post.find((err,posts) => {
        if(err){
            res.send(err);
        } else {
            res.json(posts);
        }
    })
    // fs.readFile('./DB/db.json', (err,data) => {
    //     const dataToSent = JSON.parse(data);
    //     console.log(dataToSent);
    //     res.json(dataToSent);
    // })
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
                if(req.body.completed){
                    post.completed = req.body.completed;
                }
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

app.delete('/delete', (req,res) => {
    const deleteData = req.body.id;
    console.log(deleteData);
    fs.readFile('./DB/db.json', (err,data) => {
        if(!err){
            const DB = JSON.parse(data);
            DB.forEach((element,index) => {
                if(element.id == deleteData){
                    DB.splice(index, 1);
                    const dbToWrite = JSON.stringify(DB);
                    fs.writeFile('./DB/db.json', dbToWrite, (err,data) => {
                        if (!err) {
                            console.log('Usunięto');
                            res.json({"Status": "ok"})
                        } else {
                            console.log('Błąd zapisu pliku', err);
                        }
                    })
                }
            });
        } else {
            console.log('Błąd' +err);
        }
    })
})

app.post('/completed', (req,res) => {
    const changeData = req.body.id;
    console.log(changeData);
    fs.readFile('./DB/db.json', (err,data) => {
        if(!err){
            const DB = JSON.parse(data);
            DB.forEach((element,index) => {
                if(element.id == changeData){
                    element.completed = req.body.completed;
                    const dbToWrite = JSON.stringify(DB);
                    fs.writeFile('./DB/db.json', dbToWrite, (err,data) => {
                        if (!err) {
                            console.log('Zmieniono');
                            res.json({"Status": "ok"})
                        } else {
                            console.log('Błąd zapisu pliku', err);
                        }
                    })
                }
            });
        } else {
            console.log('Błąd' +err);
        }
    })
})

// fs.readFile('./DB/db.json', (err,data) => {
//     if(!err){
//         const DB = JSON.parse(data);
//         DB.forEach(element => {
//             console.log(element.text, element.completed);
//         });
//     } else {
//         console.log('Błąd' +err);
//     }
// })

app.use('/api', router);

app.listen(3000, () =>{
    console.log('Server uruchomiony na porcie 3000');
});