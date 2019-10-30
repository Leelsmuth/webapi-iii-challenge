const express = require("express");
const helmet = require("helmet");
const server = express();
const userRouter = require("./users/userRouter");
// const postRouter = require('./posts/postRouter')

//custome middleware
function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`${req.method}, ${req.url}, ${now}`);

  next();
}

server.use(logger);
server.use(helmet());
server.use(express.json());

server.get("/", logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", userRouter);

module.exports = server;
