const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.URL || 5000;
const app = express();
const MONGODB_URL = require("./database/db");
const bodyParser = require("body-parser");
const limit = "50mb";
const pool = require("./config/db");
const moment = require("moment")


app.use(cors());
// app.use(express.json());
app.use(bodyParser.json({ limit: limit, extended: true }));
app.use(bodyParser.urlencoded({ limit: limit, extended: true }));

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// mongoose.set("strictQuery", false);

// mongoose.connect(MONGODB_URL).then(console.log("mongodb connected"))
// .catch((error)=>{
//   console.log("error>>>", error)
// })
app.use("/", require("./rootRoute"));
// app.use('/', (req, res)=>{
//   res.status(200).send({
//     data: 'fayyaz ansaseri'
//   })
// })

app.listen(PORT, () => {
  console.log(`Your Mental Health App is running on ${PORT}`);
});

pool.query(
  `SELECT datname FROM pg_database WHERE datistemplate = false;`,
  (error, results, fields) => {
      if (error) {
          console.log("SQL Database error: ", error.message);
          // console.log("Node server Date and time >>> ", "23-09-2023 02:03:09");
          // console.log("Node server Date and time >>> ", "26-09-2023 11:21:50");
          console.log("Node server Date and time >>> ", "26-09-2023 04:14:59");
      }
      else {
          console.log("SQL Database connected");
          // console.log("Node server Date and time >>> ", "23-09-2023 02:03:09");
          // console.log("Node server Date and time >>> ", "26-09-2023 11:21:50");
          console.log("Node server Date and time >>> ", "26-09-2023 04:14:59");

          // console.log("SQL Database Date and time >>> ", moment().format("DD-MM-YYYY hh:mm:ss a"));
      }
  }
)



//  subquery
// SELECT au.* FROM action_users AS au WHERE au.id IN (SELECT doctor_id FROM patient_appointments WHERE patient_id = 11)
