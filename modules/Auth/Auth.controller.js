import bcrypt from "bcryptjs"
import UserModel from "../../DB/Model/User.model.js"
import jwt from "jsonwebtoken"
import cloudinary from "../../Services/Cloudinary.js"

export const SignUp = async(req, res)=>{
    try{
        const{userName, email,password} = req.body;
        const User = await UserModel.findOne({email})
     
        if(User){
         return res.status(404).json({message: "email already exists"})
        }
     
        const hashedpassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
         folder : `${process.env.APP_NAME}/Users`
     })
        const createUser = await UserModel.create({userName, email, password:hashedpassword, image: {secure_url, public_id}})
        return res.status(201).json({message: "success", user: createUser})
    }catch(error){
        return res.status(500).json({message: "error", error: error.stack})
    }
   
}

export const SignIn = async(req, res, next)=>{
    const{email, password} = req.body;
    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(404).json({message: "data invaid"});
    }
   
    const match = bcrypt.compareSync(password, user.password)
    if(!match){
        return res.status(404).json({message: "data invaid"});
    }

    const token = jwt.sign({id:user._id, role: user.role, status: user.status}, process.env.LOGINSINGURE, {expiresIn: '5m'})//عشان موضوع السيكورتي وما يصير في تعديل ع الداتا 
    const refreshToken = jwt.sign({id:user._id, role: user.role, status: user.status}, process.env.LOGINSINGURE, {expiresIn:  60*60*24*30})
    return res.status(200).json({message: "success", token, refreshToken});
}