const mongoose = require("mongoose");
const UserShema = new mongoose.Schema(
    {
        username:{type: String, require: true, unique: true},
        password:{type: String, require : true},
        email:{type:String, require:true, unique:true},
        userId:{type:String, require:true, unique:true}
    },
    {
        collection:"users"
    }
);
const model = mongoose.model("UserSchema", UserShema);
module.exports = model;