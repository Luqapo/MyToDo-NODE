const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static('./public/zadanieDnia/'));

app.get('/data', (req,res) => {
    fs.readFile('./data/zadanieDniaDB/db.json', (err,data) => {
        const dataToSent = JSON.parse(data);
        console.log(dataToSent);
        res.json(dataToSent);
    })
})

app.listen(3000, () =>{
    console.log('Server uruchomiony na porcie 3000');
});

app.post('/add', (req,res) =>{
    const newTodo = req.body;
    let newId = 1;
    fs.readFile('./data/zadanieDniaDB/db.json', (err,data) => {
        const oldData = JSON.parse(data);
        if(oldData.length === 0){
            newId = 1;
        } else {
            const newId = oldData[oldData.length - 1].id +1;
            newTodo.id = newId;
        }
        
        fs.readFile('./data/zadanieDniaDB/db.json', (err,data) => {
            const db = JSON.parse(data);
            db.push(newTodo);
            const dbToWrite = JSON.stringify(db);
            fs.writeFile('./data/zadanieDniaDB/db.json', dbToWrite, (err,data) => {
                if (!err) {
                    console.log('Dodano.');
                    res.json({"Status": "ok"})
                } else {
                    console.log('Błąd zapisu pliku', err);
                }
            })
        })
    })
    
});

app.delete('/delete', (req,res) => {
    const deleteData = req.body.id;
    console.log(deleteData);
    fs.readFile('./data/zadanieDniaDB/db.json', (err,data) => {
        if(!err){
            const DB = JSON.parse(data);
            DB.forEach((element,index) => {
                if(element.id == deleteData){
                    DB.splice(index, 1);
                    const dbToWrite = JSON.stringify(DB);
                    fs.writeFile('./data/zadanieDniaDB/db.json', dbToWrite, (err,data) => {
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

fs.readFile('./data/zadanieDniaDB/db.json', (err,data) => {
    if(!err){
        const DB = JSON.parse(data);
        DB.forEach(element => {
            console.log(element.text, element.completed);
        });
    } else {
        console.log('Błąd' +err);
    }
})