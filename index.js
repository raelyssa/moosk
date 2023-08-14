const { uuid } = require("uuidv4");
const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const users = new Map();

app.post("/user/new", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = {
    username: username,
    password: password,
    createdAt: new Date(),
    loginToken: {
      value: null,
      expiresAt: new Date(),
    },
  };
  users.set(username, newUser);
  res.status(200).send(newUser);
});

app.get("/user", (req, res) => {
  const foundUser = users.get(req.body.username);
  if (foundUser == undefined) res.status(404).send("User does not exist.");
  res.send(foundUser);
});

app.post("/user/login", (req, res) => {
  const foundUser = users.get(req.body.username);
  if (foundUser == undefined) res.status(404).send("User not found.");
  if (req.body.password != foundUser.password)
    res.status(404).send("Password is incorrect. Please try again.");
  foundUser.loginToken = {
    value: uuid(),
    expiresAt: new Date(new Date().getTime() + 30 * 60 * 1000),
  };
  res.status(200).send(foundUser.loginToken);
});

app.delete("/user", (req, res) => {
  users.delete(req.body.username);
  res.status(200).send("Deleting user: " + req.body.username);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function isExpired() {}
