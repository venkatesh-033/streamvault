import jwt from 'jsonwebtoken';
export function requireAdmin(req,res,next){
 const token=(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];
 if(!token)return res.status(401).json({success:false,message:'Admin login required'});
 try{const claims=jwt.verify(token,process.env.JWT_SECRET,{algorithms:['HS256']});if(claims.role!=='admin')throw Error('Not admin');req.adminId=claims.sub;next();}
 catch{return res.status(401).json({success:false,message:'Session expired or invalid'});}
}
