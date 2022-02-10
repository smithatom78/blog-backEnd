const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Library');
//mongose and backend connection establishment
mongoose.connect('mongodb+srv://smithajacob:smithajacob@cluster0.1b8mq.mongodb.net/blog-app');

//schema definition


const Schema1 = mongoose.Schema;
//creating a model ith the collection
var userSchema = new Schema1({
    
    user: String,
    email: String,
    password: String
});
var UserInfo = mongoose.model('users', userSchema);
//var ArticleListInfo = mongoose.model('myarticles', myarticleSchema);

module.exports= UserInfo;
//module.exports=ArticleListInfo;
