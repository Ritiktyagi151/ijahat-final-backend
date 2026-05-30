const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

async function createAdmin(){

try{

const existingAdmin = await Admin.findOne({
email: process.env.ADMIN_EMAIL_DASH
});

if(existingAdmin){
console.log("Admin already exists");
process.exit();
}

const hashedPassword = await bcrypt.hash(
process.env.ADMIN_PASSWORD_DASH,
10
);

await Admin.create({
email: process.env.ADMIN_EMAIL_DASH,
password: hashedPassword
});

console.log("Admin created successfully");

process.exit();

}catch(err){
console.log(err);
}

}

createAdmin();