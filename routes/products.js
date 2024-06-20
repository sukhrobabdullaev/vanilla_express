import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    token: true,
  });
});
router.get("/products", (req, res) => {
  res.render("products", {
    title: "Products",
    isProducts: true,
  });
});

router.get("/add", (req, res) => {
  res.render("add", {
    title: "Add Product",
    isAdd: true,
  });
});

export default router;
