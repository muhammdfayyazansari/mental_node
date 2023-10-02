const pool = require("../../config/db");
const moment = require("moment");
// SELECT field_name FROM your_table_name WHERE condition;

module.exports = {
  check_user_already_register_service: (email, phone) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM action_users WHERE email = $1 OR phone = $2`,
        [email, phone],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  patient_register_service: (
    name,
    phone,
    email,
    dob,
    gender,
    address,
    state,
    zip_code,
    city,
    country,
    password,
    level,
    salt,
    status
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO action_users (name, phone, email, dob, gender, address, state, zip_code, city, country, password, level, salt, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          name,
          phone,
          email,
          dob,
          gender,
          address,
          state,
          zip_code,
          city,
          country,
          password,
          level,
          salt,
          status
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  doctor_register_service: (
    name,
    phone,
    email,
    dob,
    gender,
    address,
    state,
    zip_code,
    city,
    country,
    password,
    level,
    salt,
    status
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO action_users (name, phone, email, dob, gender, address, state, zip_code, city, country, password, level, salt, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          name,
          phone,
          email,
          dob,
          gender,
          address,
          state,
          zip_code,
          city,
          country,
          password,
          level,
          salt,
          status
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  get_user_information: (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM action_users WHERE email = $1`,
        [email],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  updateUserPasswordService: (password, id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE action_users
        SET password = $1
        WHERE id = $2;`,
        [password, id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM action_users WHERE email = $1;`,
        [email],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
};
