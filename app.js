const express=require('express');
const cors = require('cors');
const ArticleInfo=require('./src/model/BlogDb');

const UserInfo=require('./src/model/BlogDb1');
//searching db

//object init
const app=express();
const jwt=require('jsonwebtoken');
const bcrpt=require('bcrypt');
app.use(express.urlencoded({ extended: false }));
 app.use(express.json());
 app.use(cors());
 app.use(express.static('./public'));
 app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
//fake Db
/*const articleInfo={
    'node':{
    upvotes:0,comments:[]},
    'react':{
    upvotes:0,comments:[]}
    ,
    'express':{
    upvotes:0,comments:[]}
    
    }*/
    
    //register routing
  
app.post("/api/register",async(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET','POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials',true)
    try{
        UserInfo.find({email:req.body.email},(err,data)=>{
        if(data.length==0){
        let user=new UserInfo({ user: req.body.username, 
        email: req.body.email,
        password: bcrpt.hashSync(req.body.password,10) })
             let result= user.save( (err,data)=>{
        if(err){
            res.json({status:'error happened'})
        }
        else{
            res.json({status:'sucesss'})
        }
         } )
        }
        else{
            res.json({status:'email id already exists'})
        }
        })
         }
            catch(error)
            {
                res.json({status:'error'})

            }
})
    //login authentication routing
    app.post('/api/login',async (req, res) => {
        
        try{
            if(req.body.email==undefined || req.body.password==undefined)
            {
                res.status(500).send({error:"authentication failed"});
            }
            console.log(req.body)
            var userEmail= req.body.email
            var userPass= req.body.password
            let result=  UserInfo.find({email:userEmail},(err,data)=>{
                if(data.length>0){
                    const passwordValidator=bcrpt.compareSync(userPass,data[0].password)
                    console.log(passwordValidator)
                    if(passwordValidator)
                    {
                        // token generation
                        jwt.sign({email:data[0].email,id:data[0]._id},
                            'godblessu',
                            {expiresIn:'1d'},
                            (err,token)=>{
                                if(err){
                                    res.json({status:'error in token generation'})
                                }
                                else{
                                    res.json({status:'login success',token:token})
                                    req.session.loggedin = true;
                                   
                                }
                            }
    
                        )
    
    
                        /////////
    
    
                    }
                    else{
                        res.json({status:'invalid password'})
    
                    }
    
                }
                else{
                    res.json({status:'invalid email id'})
    
                }
            })
    
              
    
    
        }
        catch(error)
        {
            res.json({status:'error'})
    
        }
    
      })
    

//routing for articleslist
app.get('/api/article-list/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    //const articleName=req.params.name;
    ArticleInfo.find()
    .then(function (myarticle){
        res.json(myarticle);
    })
})
//routing for articles
    app.get('/api/article/:name', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        const articleName=req.params.name;
        ArticleInfo.findOne({ name: articleName })
        .then(function (article){
            res.json(article);
        })
    })
//routing for upvotes
    app.post('/api/article/:name/upvotes', (req, res) => {
        const articleName = req.params.name;
        const filter = { name: articleName };
        const update = { $inc: { upvotes: 1 } };
        ArticleInfo.findOneAndUpdate(filter, update, { new: true })
            .then(function (article) {
                res.json(article);
            })
    })
    //delete articles
    app.delete('/api/delarticle/:name/',async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        const articleName = req.params.name; 
        const filter = { name: articleName };
       // const update = { $set:deleteArticle};
       //rs const delArt= await ArticleInfo.deleteOne(filter, update, { new: true })
        const delArt= await ArticleInfo.deleteOne({"name":articleName})
        .then(function (article) {
            res.json(article);  
                 })
    })
    
    //update articles routing final
    app.post('/api/uparticle/:name/',async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
        const articleName = req.params.name;
          const updateArticle = req.body;
        const filter = { name: articleName };
               const update = { $set:updateArticle};
         
       const upArt= await ArticleInfo.findOneAndUpdate(filter, update, { new: true })
            .then(function (article) {
                res.json(article);
                     
            })
    })
    //comments routing final
        app.post('/api/article/:name/comments', (req, res) => {
            const articleName = req.params.name;
            const { username, text } = req.body;
            const filter = { name: articleName };
            const update = { $push: { comments: { username, text } } };
            ArticleInfo.findOneAndUpdate(filter, update, { new: true })
                .then(function (article) {
                    res.json(article);
                })
        })
        //add article routing
        app.post('/api/addart', async (req, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
            console.log(req.body);
          //  ArticleInfo.insertMany(req.body)
          //  .then(function (article) {
         //       res.json(article);
         //   })
         const art=new ArticleInfo(req.body);
         const article= await  art.save();
         console.log(article);
         res.send({article});
         
        });
        
   
     /*   app.post('/api/addart', (req, res) => {
            const articleName = req.params.name;
          const { name,title,description,user,upvotes,username, text } = req.body;
            const filter = { name: articleName };
            const update = { $push: {name,title,description,user,upvotes,comments: { username, text } } };
            ArticleInfo.findOneAndUpdate(filter, update, { new: true })
                .then(function (article) {
                    res.json(article);
                })
        })*/
    //comments routing-fakedb
   /* app.post('/api/artilce/:name/comments',(req,res)=>{
        const articleName=req.params.name;
        const {username,text}=req.body;
        articleInfo[articleName].comments.push({username,text});
        
        res.send(articleInfo[articleName])
        });*/
//back end routing
/*app.post('/api/artilce/:name/upvotes',(req,res)=>{
    const articleName=req.params.name;
    articleInfo[articleName].upvotes+=1;
    res.send(`${articleName}no has ${articleInfo[articleName].upvotes}upvotes`);
    });*/

app.get('/',function(req,res)
{
res.send("Blog server up");
});
app.post('/',function(req,res)
{
res.send(`hi ${req.body.name} Blog post`);
});
//listening to port

app.listen(5000,()=>{console.log("listening on port 5000")});