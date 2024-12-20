const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const route = require("./routes");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./Models/user");
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect("mongodb+srv://swati2611:1488rCJ3VcxGXXpT@cluster0.giiopqv.mongodb.net/FeastFinder?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("MongoDB connected");
        
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });
 
// CORS setup
app.use(cors({
    origin: "https://zomato-clone-kwei.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

// Setup session
app.use(session({
  secret:'default_secret_key', // Ensure this is set
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Set to true if you are serving over HTTPS
    sameSite: 'none' // This allows cookies to be sent cross-site
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth configuration
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID, // Use environment variables for sensitive info
    clientSecret: process.env.CLIENT_SECRET, // Use environment variables for sensitive info
    callbackURL: "https://zomato-clone-kwei.vercel.app/auth/google/callback",
    scope: ["profile", "email"]
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
            user = new userdb({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google authentication routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "https://zomato-clone-kwei.vercel.app",
    failureRedirect: "https://zomato-clone-kwei.vercel.app/login"
}));

// Success login route
app.get("/login/sucess", async (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "User Login", user: req.user });
    } else {
        res.status(400).json({ message: "Not Authorized" });
    }
});

// Logout route
app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("https://zomato-clone-kwei.vercel.app");
    });
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello");
});

// Use additional routes
app.use("/", route);

// Start the server
app.listen(port, () => {
    console.log(`Server connected at port ${port}`);
});
