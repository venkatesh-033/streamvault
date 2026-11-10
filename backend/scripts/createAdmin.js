import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from '../config/db.js';
import Admin from '../models/Admin.js';
import readline from 'node:readline/promises';
import {stdin as input,stdout as output} from 'node:process';
const rl=readline.createInterface({input,output});
try{
 await connectDB();
 const email=(await rl.question('Admin email: ')).trim().toLowerCase();
 const password=await rl.question('Admin password (12+ characters): ');
 if(!/^\S+@\S+\.\S+$/.test(email)||password.length<12)throw Error('Valid email and 12+ character password required');
 if(await Admin.exists({email}))throw Error('Admin already exists');
 await Admin.create({email,passwordHash:await bcrypt.hash(password,12)});
 console.log('Admin created. You can now sign in at /admin.');
}catch(e){console.error(e.message);process.exitCode=1}finally{rl.close();const {default:mongoose}=await import('mongoose');await mongoose.disconnect()}
