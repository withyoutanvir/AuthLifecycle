import { User } from "../models/User.model.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {sendWelcomeEmail, sendVerificationEmail,sendPasswordResetEmail,sendResetSuccessEmail } from "../mailtrap/email.js";
import crypto from 'crypto';


export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try{
	const user=await User.findOne({email});
	if(!user){
		return res.status(400).json({success:false,message:"Invalid credentials"});
	}
	const isPasswordValid=await bcrypt.compare(password,user.password);
	if(!isPasswordValid){
		return res.status(400).json({success:false,message:"Invalid credentials"});
	}

	generateTokenAndSetCookie(res,user._id);
	user.lastlogin= new Date();
	await user.save();

	res.status(200).json({
		success:true,
		message:"Logged in successfully",
		user:{
			...user._doc,
			password:undefined,
		},
	})

	
  }catch(error){
	console.log("error in login ",error);
  }
};

export const forgotPassword =async (req,res)=>{
	const {email}=req.body;
	try{
		const user =await User.findOne({email});
		if(!user){
			return res.status(400).json({success:false,message:"User not found"});
		}
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // expires in 10 mins
 

		user.resetPasswordToken=resetToken;
		user.resetPasswordExpires=resetTokenExpiresAt;

		await user.save();

		//send email

		await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
		res.status(200).json({success:true,message:"Password reset email sent successfully"});
	}
	catch(error){
		console.log("error in forgotPassword ",error);
		return res.status(500).json({success:false,message:"Server error"});

	}
}


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({success:true,message:"Logged out successfully"});
};


export const resetPassword = async (req,res)=>{
	
	
	try{
		const {token}=req.params;
		const {password}=req.body;
		const user=await User.findOne({
			resetPasswordToken:token,
			resetPasswordExpires:{ $gt: Date.now() },
		});
		if (!user){
			return res.status(400).json({success:false,message:"Invalid or expired reset token"});
		}

		// update passsword

		const hashedPassword=await bcrypt.hash(password,10);
		user.password=hashedPassword;
		user.resetPasswordToken=undefined;
		user.resetPasswordExpires=undefined;
		await user.save();
		await sendResetSuccessEmail(user.email);
		res.status(200).json({success:true,message:"Password reset successfully"});
	}catch(error){
		console.log("error in resetPassword ",error);
		res.status(500).json({success:false,message:"Server error"});
	}
}

export const checkAuth = async (req, res) => {
	try{
		const user = await User.findById(req.userId).select("-password ");
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		
		res.status(200).json({success:true,user});
	}
	catch(error){
		console.log("Error in checkAuth",error);
		res.status(500).json({success:false,message:error.message});

	}
}