const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

const Users=require('./users.model')

const mongoose=require('mongoose');
const DB_URL="mongodb+srv://amityohan20:PfwrwRdOI7H1BZSx@cluster0.jmbrf.mongodb.net/adding-and-validating-users"
mongoose.connect(DB_URL)
        .then(()=>{
          console.log("connected to database")
        })
        .catch((er)=>{
          console.log(er.message)
        })

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/check-credentials',async(req,res)=>{
  try{
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter both username and password" });
    }
    const user = await Users.findOne(user => user.username === username && user.password === password);
    if(!user){
      return res.status(400).send({message:"User doesn't exist."})
    }
    const isValid=await bcrypt.compare(password,user.password);
    if(!isValid){
      return res.status(401).send({message:"Invalid credentials"})
    }

    res.status(200).send({message: "Login Successful"})

  }catch(er){
    console.log(er);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

