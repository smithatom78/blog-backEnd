const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Library');
//mongose and backend connection establishment
mongoose.connect('mongodb+srv://smithajacob:smithajacob@cluster0.1b8mq.mongodb.net/blog-app');
//mongoose.connect('mongodb+srv://smithajacob:smithajacob@cluster0.vhstr.mongodb.net/blog-app?retryWrites=true&w=majority');
//schema definition
const Schema = mongoose.Schema;
//const Schema1 = mongoose.Schema;
var articleSchema = new Schema({
    name: String,
    title: String,
    description:String,
    user: String,
    upvotes: Number,
    comments: Array
});
/*var userSchema = new Schema1({
    
    user: String,
    email: String,
    password: String
});*/
//creating a model ith the collection

var ArticleInfo = mongoose.model('myarticles', articleSchema);

//var UserInfo = mongoose.model('users', userSchema);

module.exports = ArticleInfo;
//module.exports= UserInfo;