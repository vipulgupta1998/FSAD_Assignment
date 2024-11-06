const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');

/*************************** REGISTER *******************************/

router.post('/register', async(req, res) => {
  let success = false;
  try {
    let user = await User.findOne({email: req.body.email});
    if (user) {return res.status(400).json({success,
        error: "sorry but the user with the same email already exists",
    });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        email : req.body.email,
        name : req.body.name,
        password : secPass
    })
    const data = {
        user : {
            id : user.id
        }
    }
    success = true;
    const authtoken = jwt.sign(data,JWT_SECRET);
    res.json({success,authtoken});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})


/*************************** LOGIN *******************************/

router.post('/login',async(req,res)=>{
    let success = false;
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email : email});
        if(!user){
         return res.status(400).json({success,message : "user doesnot exists"})
       }
       const passwordCompare = await bcrypt.compare(password, user.password);
       if (!passwordCompare) {
         return res.status(400).json({ success, message: "Password is wrong" });
       }
       const data = {
         user : {
            id : user.id
         }
       }
       const authtoken = jwt.sign(data,JWT_SECRET);
       success = true;
       res.json({success,authtoken});  
       } catch (error) {
         console.error(error.message);
         res.status(500).send("some error occured");
       }
})



/*************************** Forget password *******************************/

router.post('/ForgotPassword',async(req,res)=>{
    const {email} = req.body;
    try {
        const Password = process.env.GOOGLEPASSWORD;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '/',
                pass: Password,
            },
        });

        const otpLength = 6;
        const otp = Math.floor(Math.random() * Math.pow(10, otpLength))
            .toString()
            .padStart(otpLength, '0');

        req.session.otp = otp;
        const mailOptions = {
            from: '/',
            to: email,
            subject: 'OTP For resetting the password',
            html: `
    <p>Hello,</p>
    <p>Your Book Bank password reset code is: <strong>${otp}</strong>.</p>
    <p>Enter this code within the app to reset password</p>
    <p>Thank you,<br>Book Bank Team</p>
  `,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(result);
        return res.status(200).json({
            success: true,
            message: 'OTP Sent successfully',
            data: {
                otp: otp,
            },
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: {},
        });
    }
});


/*************************** change Password *******************************/

router.post('/ResetPassword',async(req,res)=>{
    let success = false;
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({success,message : "user doesnot exists"})
          }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.newPassword,salt);
        user.password = secPass;
        const data = {
            user : {
               id : user.id
            }
          }
          success = true;
          const authtoken = jwt.sign(data,JWT_SECRET);
          success = true;
          res.json({success,authtoken});  
    }
    catch{
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})