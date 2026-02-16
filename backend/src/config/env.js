require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 3001;

let JWT_SECRET = process.env.JWT_SECRET;

if (NODE_ENV === "production" && (!JWT_SECRET || JWT_SECRET.trim() === "")) {
  throw new Error("JWT_SECRET is required in production");
}

if (!JWT_SECRET || JWT_SECRET.trim() === "") {
  JWT_SECRET = "dev_secret_change_me";
}

module.exports = { PORT, NODE_ENV, JWT_SECRET };
