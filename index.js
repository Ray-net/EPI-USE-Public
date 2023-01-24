const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 5000;
const mongoConnect = require("./server/database");

mongoConnect();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: "true" }));

app.use(bodyParser.json());

app.use(morgan("tiny"));

app.use("/js", express.static(path.resolve(__dirname, "libs/javascript")));

app.use("/css", express.static(path.resolve(__dirname, "libs/style")));

app.use("/img", express.static(path.resolve(__dirname, "libs/images")));

app.use(
  "/axios",
  express.static(path.resolve(__dirname, "node_modules/axios/dist"))
);

app.use(
  "/md5",
  express.static(path.resolve(__dirname, "node_modules/nodejs-md5"))
);

app.use("/", require("./server/routes/routes"));

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
