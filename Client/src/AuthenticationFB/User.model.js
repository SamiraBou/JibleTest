var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var Schema = mongoose.Schema;
var accountSchema = new Schema({
    name: String,
    email: String,
    token: String,
    //picture: String,
});

var Account = module.exports=mongoose.model('account', accountSchema);
//creer un copte
module.exports.createAccount = function(newAccount, callback){
   
    newAccount.save(callback);
}
//trouver un compte par token
module.exports.getAccountByToken = function(token, callback){
    var query = {token: token};
    Account.findOne(query, callback);
}

