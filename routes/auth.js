import { Router } from "express";
import User from "../models/user.model.js";
const router = Router();
import bcrypt from "bcrypt";

// RENDER AUTHS
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

// POST AUTHS
router.post("/login", async (req, res) => {
  const existUser = await User.findOne({ email: req.body.email });
  if (!existUser) {
    console.log("USER NOT FOUND");
    return;
  }
  const isPassEqual = await bcrypt.compare(
    req.body.password,
    existUser.password
  );
  if (!isPassEqual) {
    console.log("PASSWORD WRONG");
    return;
  }

  console.log(existUser);
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const userData = {
      ...req.body,
      password: hashedPassword,
    };
    const user = await User.create(userData);
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
