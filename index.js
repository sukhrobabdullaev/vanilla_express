import express from "express";
import { create } from "express-handlebars";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authRouter);
app.use(productsRouter);

const PORT = process.env.PORT || 8081;

async function fetchMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(`Listening on the port ${PORT}: http:localhost:${PORT}`)
    );
    console.log(`MOGODB IS CONNECTED`);
  } catch (error) {
    console.log(error);
  }
}

fetchMongo();
