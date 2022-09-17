import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb"


const app = express()
dotenv.config()
const PORT=process.env.PORT;
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mycapston.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());



const MONGO_URL = process.env.MONGO;


async function Createconnection() {
    const Client = new MongoClient(MONGO_URL);
    await Client.connect();
    console.log("Mongo connected");
    return Client;
  }
  
  export const Client = await Createconnection();

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post("/signup",async function(req,res){
  const {username,password} = req.body

 const userexist= await Client.db("Domaincer-server").collection("Users").findOne({username:username})

  if(userexist){
      res.status(400).send("Username already exist")
  }else{
        const fullhashedpassword = await genhashedpassword(password)
        // console.log("password: ",fullhashedpassword)
 const Adduser= await Client.db("Domaincer-server").collection("Users").insertOne({username:username,password:fullhashedpassword})
 res.status(200).send("Signup successfull")
      
  }

});
app.post("/clientSignup",async function(req,res){
  const {username,password} = req.body

 const userexist= await Client.db("Domaincer-server").collection("client").findOne({username:username})

  if(userexist){
      res.status(400).send("Username already exist")
  }else{
        const fullhashedpassword = await genhashedpassword(password)
        // console.log("password: ",fullhashedpassword)
 const Adduser= await Client.db("Domaincer-server").collection("client").insertOne({username:username,password:fullhashedpassword})
 res.status(200).send("Signup successfull")
      
  }

});


app.post("/login",async function(req,res){
  const {username,password} = req.body

 const userexist= await Client.db("Domaincer-server").collection("Users").findOne({username:username})

  if(userexist){

    const ispasswordmatch = await bcrypt.compare(
      password,
      userexist.password
    );
    if(ispasswordmatch){
       res.status(200).send("password matched")
    }else{
       res.status(400).send("Invalid credentials")
        
    }
      
  }else{
      res.status(400).send("signup plz,Invalid credentials")
      
  }

})
app.post("/ClientLogin",async function(req,res){
  const {username,password} = req.body

 const userexist= await Client.db("Domaincer-server").collection("client").findOne({username:username})

  if(userexist){

    const ispasswordmatch = await bcrypt.compare(
      password,
      userexist.password
    );
    if(ispasswordmatch){
       res.status(200).send("password matched")
    }else{
       res.status(400).send("Invalid credentials")
        
    }
      
  }else{
      res.status(400).send("signup plz,Invalid credentials")
      
  }

})


app.post("/addPost",async function(req,res){
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = date.getHours();
  const mins = ("0" + date.getMinutes()).slice(-2);
  const sec = date.getSeconds();
  const NowTime = hours + ":" + mins + ":" + sec;

  const full_date = day + "-" + month + "-" + year;
  const {username,name,min,max,des}=req.body;
  const post = await Client.db("Domaincer-server").collection("clientPost").insertOne({username,name:name,min:min,max:max,des:des,Time:NowTime,Date:full_date})
  if(post){
    res.status(200).send("posted successfully")
  }
  else{
    res.status(400).send("something went worng")
  }
})


app.post("/apply",async function(req,res){
   const {clientname,projectname,min,max,des,name,email,phone}=req.body;
  const apply = await Client.db("Domaincer-server").collection("applications").insertOne({clientname,projectname,min,max,des,name,email,phone})
  if(apply){
    res.status(200).send("application send")
  }
  else{
    res.status(400).send("something went worng cannot apply")
  }
})


app.get("/getApplications",async function(req,res){
  const Applications = await Client.db("Domaincer-server").collection("applications").find().toArray()
  if(Applications){
    res.status(200).send(Applications)
  }
  else{
    res.status(400).send("something went worng")

  }
})


app.delete("/deleteApplication/:id",async function(req,res){
  const id = req.params.id
  const deleted = await Client.db("Domaincer-server").collection("applications").deleteOne({_id:ObjectId(id)})
  if(deleted){
    res.status(200).send("post deleted successfully")
  }else{
    res.status(400).send("can't delete or something went worng")
  }
})






app.get("/getPost",async function(req,res){
  const Posts=await Client.db("Domaincer-server").collection("clientPost").find().toArray()
  if(Posts){
    res.status(200).send(Posts)
  }else{
    res.status(400).send("no post avaliable or something went worng")
  }
})
app.get("/getPost/:id",async function(req,res){
  const id = req.params.id
  const Posts=await Client.db("Domaincer-server").collection("clientPost").findOne({_id:ObjectId(id)})
  // console.log(Posts)
  if(Posts){
    res.status(200).send(Posts)
  }else{
    res.status(400).send("no post avaliable or something went worng")
  }
})

app.delete("/deletePost/:id",async function(req,res){
  const id = req.params.id;
  // const {id} = req.body 
  const deletePost= await Client.db("Domaincer-server").collection("clientPost").deleteOne({_id:ObjectId(id)})
  if(deletePost){
    res.status(200).send("post deleted successfully")
  }else{
    res.status(400).send("can't delete or something went worng")
  }
  
  })



  app.put("/updatePost/:id", async function (req, res) {
    const id = req.params.id;
    const {username,name,min,max,des} = req.body;
    const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = date.getHours();
  const mins = ("0" + date.getMinutes()).slice(-2);
  const sec = date.getSeconds();
  const NowTime = hours + ":" + mins + ":" + sec;

  const full_date = day + "-" + month + "-" + year;
    const updated = await Client.db("Domaincer-server").collection("clientPost").updateOne({_id:ObjectId(id)},{$set:{username,name,min,max,des,Date:full_date,Time:NowTime}})
    if(updated){
      res.send("updated successfully")
    }
    else{
      res.send("something went worng or can't update")
    }
  })



async function genhashedpassword(password) {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  // console.log(salt,"this is salt")
  const hashedpassword = await bcrypt.hash(password, salt);
  // console.log("hassed",hashedpassword);
  return hashedpassword;
}

app.listen(PORT, () => console.log(`App started in ${PORT}`));

