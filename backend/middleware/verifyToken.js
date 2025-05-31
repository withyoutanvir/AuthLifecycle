import jet from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
    const token=req.cookies.token;
    if(!token) return res.status(401).json({success:false,message:"Unauthorized"});
    try{
        const decoded=jet.verify(token,process.env.JWT_SECRET);

        if(!decoded) return res.status(401).json({success:false,message:"Unauthorized"});

        req.userId=decoded.userId;

        next();
    }
    catch(error){
        console.log("Error in verifyToken",error);
        return resstatus(500).json({success:false,message:"Server error"});

    }
}