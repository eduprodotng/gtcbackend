// import passport from "passport";
// import pkg from "passport-google-oauth20"; // Default import
// const { OAuth2Strategy: GoogleStrategy } = pkg;
// import User from "./models/userModel.js";
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_AUTH_REDIRECT_URI,
//     },
//     async (token, tokenSecret, profile, done) => {
//       try {
//         // Here, you would usually find or create a user in your database
//         const user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           const newUser = new User({
//             googleId: profile.id,
//             fullname: profile.displayName,
//             email: profile.emails[0].value,
//             // Store the token and refreshToken
//             accessToken: token,
//             refreshToken: tokenSecret, // or refresh token if needed
//           });
//           await newUser.save();
//           return done(null, newUser);
//         }
//         return done(null, user);
//       } catch (err) {
//         console.error("Error authenticating Google user:", err);
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "./models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_REDIRECT_URI,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Find or create user logic
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = new User({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            accessToken: token,
            refreshToken: tokenSecret,
            password: "defaultpassword",
          });
          await newUser.save();
          return done(null, newUser);
        }
        return done(null, user);
      } catch (err) {
        console.error("Error authenticating Google user:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
