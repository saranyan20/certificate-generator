const Participants = require("./model.js");
const align = require("center-align");
const pdf_generate = require("./pdf-generate");
const express = require("express");
const multer = require("multer");
const { promisify } = require("util");
const fs = require("fs");
Excel_file = require("./parse_xl");
const readFileAsync = promisify(fs.readFile);
const path = require("path");

const app = express();
app.use(express.json());
const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "/fdp");
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "fdp/assets")));

app.get("/", function (req, res) {
  res.sendFile(path.join(publicDirectoryPath, "/index.html"));
});
const storage = multer.diskStorage({
  destination: "./files",
  filename: (req, file, cb) => {
    cb(undefined, "sairam.xlsx");
  },
});

const upload = multer({
  fileFilter(req, file, cb) {
    console.log("inside multer");
    if (!file.originalname.endsWith("xlsx")) {
      return cb(new Error("Please upload a Excel file"));
    }
    cb(undefined, true);
  },
  limits: {
    fileSize: 50000000,
  },
  storage,
});

app.get("/certificate", async (req, res) => {
  //let college_id=await req.query.College.replace(/\s+/g,'').toUpperCase();
  Participants.find({
    email: req.query.Email,
    phone: req.query.Phone,
  })
    .then(async ([person] = participant) => {
      console.log("extracting...", person.name);
      await pdf_generate(
        align(person.name, 35),
        align(person.college, 60),
        align(person.cert_id, 13)
      );
      res.download(`./generated certificates/${person.name}.pdf`);
      //const pdfdata=await readFileAsync(`./generated certificates/${req.query.Name}.pdf`);
      //res.set('Content-Type','application/pdf');
      //res.status(200).send(pdfdata);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .sendfile(path.join(publicDirectoryPath, "user_not_found.html"));
    });
});

app.post("/upload", upload.single("excel"), (req, res) => {
  res.status(200).send();
});

app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(publicDirectoryPath, "/404.html"));
});

app.listen(port, () => {
  console.log("Server is up and running" + port);
});
