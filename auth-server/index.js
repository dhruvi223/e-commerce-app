const express = require('express')
// import low from 'lowdb';
// import FileSync from 'lowdb/adapters/FileSync';
const bcrypt= require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');


//var adapter = new FileSync('./database.json')
var adapter = new FileSync('./database.json')
var db = low(adapter)
const crypto = require('crypto');


const app = express();
const PORT = 8000;
app.listen(PORT, () => console.log(`Server started at port:${PORT}`))

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/', (req,res) => {
    res.send("hello")
})

app.post('/auth', (req,res) => {
    const {email, password} = req.body;

    const user1 = [(db.get('users').value())];
    const user = user1.filter((user) => email === user.email)

    
    //console.log(user[0].password)
    //console.log(hashedPassword)
    // console.log(user.length)
    // console.log(email);
    // console.log(password);
    // console.log(user[0].password)
    if(user.length === 1){ 
       const hashedPassword = bcrypt.hashSync(user[0].password, 10);
       bcrypt.compare(password, hashedPassword, function(err, result){
          if(result){
            let LoginData = {email, signInTime: Date.now()}
            const token = jwt.sign(LoginData, secretKey);
            res.status(200).json({message:'success',token})

          }
          else{
            res.send("Invalid password")
            // return res.status(401).json({ message: 'Invalid password' })
          }
       })


    }

    else if(user.length === 0){
           res.send("This email is not registered, create a new account")

    }


})

app.post('/check-account', (req,res) => {
    const email = req.body;
    const uemail1 = [db.get('users').value()];
    const uemail = uemail1.filter((uemail) => uemail.email === email)
    //console.log(uemail1)
    console.log(uemail);
    console.log(uemail.length)
    if(uemail.length === 1){
        res.send("user already exists")
    }
    else{
        res.send("user doesn't exist")
    }

})




