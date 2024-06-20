import express from "express";
import { create } from "express-handlebars";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(authRouter);
app.use(productsRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () =>
  console.log(`Listening on the port ${PORT}: http:localhost:${PORT}`)
);
