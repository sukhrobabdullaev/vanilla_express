import { Router } from "express";
import User from "../models/user.model.js";
const router = Router();
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.js";

// RENDER AUTHS
router.get("/login", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  }
  res.render("login", {
    title: "Login",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/register", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Register",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});

// POST AUTHS

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("loginError", "All fields is required!");
    res.redirect("/login");
    return;
  }
  const existUser = await User.findOne({ email });
  if (!existUser) {
    // console.log("USER NOT FOUND");
    req.flash("loginError", "User not found!");
    res.redirect("/login");
    return;
  }
  const isPassEqual = await bcrypt.compare(password, existUser.password);
  if (!isPassEqual) {
    // console.log("PASSWORD WRONG");
    req.flash("loginError", "Password wrong!");
    res.redirect("/login");
    return;
  }

  const token = generateJWTToken(existUser._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const userData = {
      ...req.body,
      password: hashedPassword,
    };
    if (!firstname || !lastname || !email || !password) {
      req.flash("registerError", "All fields is required!");
      res.redirect("/register");
      return;
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      req.flash("registerError", "Your Email is already taken!");
      res.redirect("/register");
      return;
    }

    const user = await User.create(userData);
    const token = generateJWTToken(user._id);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
