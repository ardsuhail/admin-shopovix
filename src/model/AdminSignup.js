import mongoose from "mongoose";


const AdminSigupSchema = new mongoose.Schema({
 userName:{
    type:String,
    required:true,
    unique:true
 },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  }
  
  
 
 
},{ timestamps: true});

export default mongoose.models.AdminSigup ||
  mongoose.model("AdminSigup", AdminSigupSchema);
