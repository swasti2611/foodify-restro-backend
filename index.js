const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const route=require("./routes")
const app=express()
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./Models/user")
const nodemailer = require('nodemailer');
const port=process.env.PORT  || 8080

mongoose.connect("mongodb+srv://swati2611:1488rCJ3VcxGXXpT@cluster0.giiopqv.mongodb.net/FeastFinder?retryWrites=true&w=majority&appName=Cluster0")
.then((res)=>{
   
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err)
    console.log("error")
})


app.use(cors({
  origin:"https://zomato-clone-psi-six.vercel.app",
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}));
app.use(express.json());

// setup session
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
      clientID:clientid,
      clientSecret:clientsecret,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async(accessToken,refreshToken,profile,done)=>{
      try {
          let user = await userdb.findOne({googleId:profile.id});

          if(!user){
              user = new userdb({
                  googleId:profile.id,
                  displayName:profile.displayName,
                  email:profile.emails[0].value,
                  image:profile.photos[0].value
              });

              await user.save();
          }

          return done(null,user)
      } catch (error) {
          return done(error,null)
      }
  }
  )
)

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
  successRedirect:"https://zomato-clone-psi-six.vercel.app",
    failureRedirect:"https://zomato-clone-psi-six.vercel.app/login"
}))

app.get("/login/sucess",async(req,res)=>{

  if(req.user){
      res.status(200).json({message:"user Login",user:req.user})
  }else{
      res.status(400).json({message:"Not Authorized"})
  }
})

app.get("/logout",(req,res,next)=>{
  req.logout(function(err){
      if(err){return next(err)}
      res.redirect("https://zomato-clone-psi-six.vercel.app");
  })
})

// app.use(cors({
//   origin: 'https://zomato-clone-psi-six.vercel.app',  // Replace with your frontend domain
//   methods: 'GET,POST',  // Specify allowed methods (optional)
//   credentials: true }  
// ));
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// setup session
// app.use(session({
//     secret:"1234secreatkey",
//     resave:false,
//     saveUninitialized:true
// }))

// // setuppassport
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//     new OAuth2Strategy({
//         clientID:process.env.CLIENT_ID,
//         clientSecret:process.env.CLIENT_SECREATE,
//         callbackURL:"/auth/google/callback",
//         scope:["profile","email"]
//     },
//     async(accessToken,refreshToken,profile,done)=>{
//         try {
//             let user = await userdb.findOne({googleId:profile.id});

//             if(!user){
//                 user = new userdb({
//                     googleId:profile.id,
//                     displayName:profile.displayName,
//                     email:profile.emails[0].value,
//                     image:profile.photos[0].value
//                 });

//                 await user.save();
//             }

//             return done(null,user)
//         } catch (error) {
//             return done(error,null)
//         }
//     }
//     )
// )

// passport.serializeUser((user,done)=>{
//     done(null,user);
// })

// passport.deserializeUser((user,done)=>{
//     done(null,user);
// });

// // initial google ouath login
// app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

// app.get("/auth/google/callback",passport.authenticate("google",{
//     successRedirect:"https://zomato-clone-psi-six.vercel.app",
//     failureRedirect:"https://zomato-clone-psi-six.vercel.app/login"
// }))
// app.get("/login/sucess",async(req,res)=>{
    
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // or use any other email service
//     auth: {
//       user: process.env.EMAIL_USER, // your email address
//       pass: process.env.EMAIL_PASS, // your email password or app-specific password
//     },
//   });
  
  const sendEmail = (to, subject, text) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

  if (req.user) {
    // Send welcome email after successful login
    try {
      await sendEmail(req.user.email, 'Welcome to FeastFinder', 'Thank you for logging in!');
      res.status(200).json({ message: 'User Login and Email Sent', user: req.user });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'User Login but Email Sending Failed', user: req.user });
    }
  } else {
    res.status(400).json({ message: 'Not Authorized' });
  }

    
// })


// app.get("/logout",(req,res,next)=>{
//     req.logout(function(err){
//         if(err){return next(err)}
//         res.redirect("https://zomato-clone-psi-six.vercel.app");
//     })
// })
app.get("/",(req,res)=>{
  res.send("hello")
})
app.use("/",route)


app.listen(port,()=>{
console.log(`server connected at ${port}`);
})