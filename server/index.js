const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const secretKey = "ADASDASDASDASDLASLDKASLD";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto"); // Import the crypto library
const PORT = 3001;

mongoose.connect("mongodb+srv://francesdonaire:chatforte123456@chat-forte-db.xnufm5f.mongodb.net/chat-forte?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

const Register = require("./model/register");

app.use(
  cors({
    origin: ["https://test-pvg7.vercel.app/"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/registerUser", async (req, res) => {
  const full_name = req.body.full_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  try {
    const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha256")
      .toString("hex"); // Hash the password using SHA-256

    const RegisterUser = new Register({
      full_name: full_name,
      email_address: email_address,
      password: `${salt}:${hash}`, // Store the salt and hashed password
    });

    await RegisterUser.save();
    console.log("success");

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post("/loginUser", async (req, res) => {
  const email_address = req.body.email_address;
  const password = req.body.password;

  console.log(password)

  try {
    const existingUser = await Register.findOne({ email_address });

    if (existingUser) {
      const [salt, storedHash] = existingUser.password.split(":");
      const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha256")
        .toString("hex"); // Hash the provided password with the stored salt

      if (hash === storedHash) {
        const userId = existingUser._id;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: "1d" });

        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Email not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: 'Unauthorized' });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.json({ message: "Token is not valid" });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

app.get("/LoggedIn", verifyUser, (req, res) => {
  return res.json({ Message: "Authorized" });
});

app.listen(PORT, () => {
  console.log("PORT IS LISTENING AT 3001");
});
