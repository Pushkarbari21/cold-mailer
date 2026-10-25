import User from "../model/auth.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async(req, res)=>{
    try{
        const {name, email, password, domain, skills}= req.body
        //coree logic 
        if(!name || !email || !password){
            return res.status(400).json({
                sucess:false,
                message:"All fields are required"
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                sucess:false,
                message:"Passwords should be at least 8 characters"
            })
        }

        const existUser = await User.findOne({email})
        if(existUser){
             return res.status(400).json({
                sucess:false,
                message:"User already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            domain,
            skills
        })
        return res.status(201).json({
            sucess:true,
            message:"User created successfully",
            user
        })
    }catch(e){
        console.log(e.message)
        return res.status(500).json({
            sucess:false,
            message:"Internal Server error"
            
        })
    }
}

export const loginUser = async(req, res)=>{
    try{
        const{email, password}=req.body
        
        const user = await User.findOne({email}).select('+password')
        if(!user){
            return res.status(400).json({
            sucess:false,
            message:"Invalid email / password"
            
        })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
            sucess:false,
            message:"Invalid password"
        })
        }

        const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET)
        return res.status(200).json({
            sucess:true,
            message:"Login successfullly",
            user,
            token
        })
    }catch(e){
        console.log(e)
         return res.status(500).json({
            sucess:false,
            message:"Internal Server Error"
        })   
    }
}