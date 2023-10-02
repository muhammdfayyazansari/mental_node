const pool = require("../../config/db");
const moment = require("moment");
module.exports = {
  getUserInformation: (uid, name) => {
    return new Promise((resolve, reject) => {
      // pool.query(
      //   // `SELECT * FROM d02_doctor_details`,
      //   `SELECT * FROM action_users`,
      //   (error, results, fields) => {
      //     if (error) {
      //       console.log(error);
      //       return reject(error);
      //     }
      //     return resolve(results);
      //   }
      // );

      pool.query(
        "SELECT * FROM action_users WHERE uid = $1",
        [uid],
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
  createDoctorProfile: (
    college_name,
    course,
    year,
    uid,
    certificates,
    professional_experience,
    clinic_schedule
  ) => {
    // let obj= {
    //   college_name, course, year
    // }
    // console.log("my data doctor services",obj)
    // return {college_name, course, year}
    year = moment(year, "YYYY").toDate();
    let created_at = Date.now();
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO d02_doctor_details (collage_name, course, year,created_at,doctor_uid, certificates,professional_experience,clinic_schedule) VALUES ($1, $2, $3,$4,$5,$6,$7,$8)`,
        [
          college_name,
          course,
          year,
          created_at,
          uid,
          certificates,
          professional_experience,
          clinic_schedule,
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
  createDoctorAvailability: (
    doctor_id,
    day,
    start_time,
    end_time,
    created_date
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO d02_doctor_availability (doctor_id, day, start_time,end_time, created_date) VALUES ($1, $2, $3,$4,$5)`,
        [doctor_id, day, start_time, end_time, created_date],
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
  createPrescriptionService: (
    patient_id,
    doctor_id,
    appointment_id,
    description,
    updated_date
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO patient_medical_records ( patient_id, doctor_id, appointment_id, description, updated_date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [patient_id, doctor_id, appointment_id, description],
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
  upatedPrescriptionService: (
    patient_id,
    doctor_id,
    appointment_id,
    description,
    updated_date,
    id
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE patient_medical_records
        SET description = $1, updated_date = CURRENT_TIMESTAMP
        WHERE patient_id = $2 AND doctor_id = $3 AND appointment_id = $4 AND id = $5`,
        [description, patient_id, doctor_id, appointment_id, id],
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
  createDoctorProfessionExperience: (
    doctor_id,
    clinic_name,
    clinic_experience,
    specialities,
    clinic_address,
    state,
    city,
    zip_code,
    country,
    description,
    updated_date
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO doctor_professional_experience (doctor_id, clinic_name, clinic_experience , specialities, clinic_address, state, city, zip_code, country, description, updated_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          doctor_id,
          clinic_name,
          clinic_experience,
          specialities,
          clinic_address,
          state,
          city,
          zip_code,
          country,
          description,
          updated_date,
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
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        // `SELECT * FROM d02_doctor_details`,
        `SELECT * FROM action_users  WHERE level = $1`,
        [13],
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
  // // `SELECT * FROM d02_doctor_details`,
  // `SELECT * FROM action_users  WHERE level = $1`,
  // getAllDoctorsService: () => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //       `SELECT au.id,au.uid,au.name, au.level,array_agg(dpe.specialities) as specialities,array_agg(da.day) as day, array_agg(da.start_time) as start_time, array_agg(da.end_time) as end_time,array_agg(da.created_date) as created_date
  //       FROM action_users AS au
  //       LEFT JOIN d02_doctor_availability AS da ON au.id = da.doctor_id
  //       LEFT JOIN doctor_professional_experience AS dpe ON au.id = dpe.doctor_id
  //       WHERE au.level = $1 group by au.id`,
  //       [11],
  //       (error, results, fields) => {
  //         if (error) {
  //           console.log(error);
  //           return reject(error);
  //         }
  //         return resolve(results);
  //       }
  //     );
  //   });
  // },
  getAllDoctorsService: () => {
    return new Promise((resolve, reject) => {
      // `SELECT da.doctor_id, da.day, da.start_time, da.end_time, da.created_date, au.name, au.uid, au.phone FROM d02_doctor_availability AS da
      // JOIN action_users AS au ON da.doctor_id = au.id`,
      pool.query(`SELECT da.doctor_id, da.day, da.start_time, da.end_time, da.created_date, au.name, au.uid, au.phone, dd.certificates, dpe.specialities
      FROM d02_doctor_availability AS da
      JOIN action_users AS au ON da.doctor_id = au.id
      JOIN d02_doctor_details AS dd ON au.uid = dd.doctor_uid
      JOIN doctor_professional_experience AS dpe ON au.id = dpe.doctor_id;`,
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
  // getAllDoctorsService: () => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //       `SELECT au.id, au.uid, au.name, au.level, dpe.specialities, da.day, da.start_time, da.end_time,da.created_date
  //         FROM action_users AS au
  //         LEFT JOIN d02_doctor_availability AS da ON au.id = da.doctor_id
  //         LEFT JOIN doctor_professional_experience AS dpe ON au.id = dpe.doctor_id
  //         WHERE au.level = $1`,
  //       [11],
  //       (error, results, fields) => {
  //         if (error) {
  //           console.log(error);
  //           return reject(error);
  //         }
  //         return resolve(results);
  //       }
  //     );
  //   });
  // },

  // // `SELECT * FROM d02_doctor_details`,
  // `SELECT * FROM d02_doctor_availability WHERE day = $1`,
  // WHERE $1 >= d02_doctor_availability.start_time AND $2 <= d02_doctor_availability.endTime AND  $3 = day
  // [start_time, end_time,day],

  getDoctorsForAppointmentService: (start_time, end_time, day) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT d02_doctor_availability.doctor_id,d02_doctor_availability.day,
        d02_doctor_availability.start_time,d02_doctor_availability.end_time,
        action_users.name,action_users.uid,action_users.phone,doctor_professional_experience.specialities,doctor_professional_experience.description,doctor_professional_experience.clinic_experience,
        doctor_professional_experience.doctor_id,doctor_professional_experience.clinic_name,doctor_professional_experience.clinic_address,
        doctor_professional_experience.state,doctor_professional_experience.city,doctor_professional_experience.zip_code,
        doctor_professional_experience.country,doctor_professional_experience.created_date,doctor_professional_experience.updated_date,
        d02_doctor_details.certificates
        FROM d02_doctor_availability
        JOIN action_users ON action_users.id = d02_doctor_availability.doctor_id
        JOIN doctor_professional_experience ON doctor_professional_experience.doctor_id = d02_doctor_availability.doctor_id
        JOIN d02_doctor_details ON d02_doctor_details.doctor_uid = action_users.uid
        WHERE $1 >= d02_doctor_availability.start_time AND $2 <= d02_doctor_availability.end_time AND $3 = day`,
        [start_time, end_time, day],
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
  getAppointmentsUsers: (doctor_id, appointment_status) => {
    return new Promise((resolve, reject) => {
      pool.query(
        ` SELECT patient_appointments.*, action_users.name
        FROM patient_appointments
        JOIN action_users ON action_users.id = patient_appointments.patient_id
        WHERE patient_appointments.doctor_id = $1 AND patient_appointments.appointment_status = $2`,
        [doctor_id, appointment_status],
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
  getAllAppointmentsUsers: (doctor_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT patient_appointments.*, action_users.name
        FROM patient_appointments
        JOIN action_users ON action_users.id = patient_appointments.patient_id
        WHERE patient_appointments.doctor_id = $1`,
        [doctor_id],
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
  deleteAllRecordsService: () => {
    // `DELETE * FROM d02_doctor_availability  WHERE doctor_id = $1`,
    // `DELETE * FROM d02_doctor_availability  WHERE day = $1`,
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE * FROM d02_doctor_availability WHERE day = $1`,
        ["Friday"],
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
  updateDoctorProfileService: (
    doctor_id,
    name,
    phone,
    email,
    dob,
    gender,
    address,
    state,
    zip_code,
    city,
    country
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE action_users
        SET name = $1, phone = $2, email = $3, dob = $4, gender = $5, address = $6, state = $7, zip_code = $8, city = $9, country = $10
        WHERE id = $11`,
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
          doctor_id,
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
  updateDoctorProfessionaExperience: (
    doctor_id,
    clinic_name,
    clinic_experience,
    specialities,
    clinic_address,
    state,
    zip_code,
    city,
    country,
    description
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE doctor_professional_experience
        SET clinic_name = $1, clinic_experience = $2, specialities = $3, clinic_address = $4, state = $5, zip_code = $6, 
        city = $7, country = $8, description = $9
        WHERE id = $10`,
        [
          clinic_name,
          clinic_experience,
          specialities,
          clinic_address,
          state,
          zip_code,
          city,
          country,
          description,
          doctor_id,
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
  updateDoctorDetails: (
    doctor_uid,
    collage_name,
    course,
    year,
    certificates,
    professional_experience,
    clinic_schedule
  ) => {
   
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE d02_doctor_details  
        SET collage_name = $1, course = $2, year = $3, certificates = $4, professional_experience = $5, clinic_schedule = $6
        WHERE doctor_uid = $7`,
        [
          collage_name,
          course,
          year,
          certificates,
          professional_experience,
          clinic_schedule,
          doctor_uid
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
  deleteDoctorAvailability: (doctor_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM d02_doctor_availability WHERE doctor_id = $1;`,
        [doctor_id],
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
  getDoctorCertificates: (doctor_uid) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT certificates
        FROM d02_doctor_details
        WHERE doctor_uid = $1;`,
        [doctor_uid],
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
  doctorCompleteProfileService: (doctor_id, doctor_uid) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
        d02_doctor_availability.doctor_id,
        ARRAY_AGG(JSON_BUILD_OBJECT(
          'day', d02_doctor_availability.day,
          'start_time', d02_doctor_availability.start_time,
          'end_time', d02_doctor_availability.end_time
        )) AS schedule,
        JSON_BUILD_OBJECT(
        'clinic_name', doctor_professional_experience.clinic_name,
          'clinic_address', doctor_professional_experience.clinic_address,
          'state', doctor_professional_experience.state,
          'city', doctor_professional_experience.city,
          'country', doctor_professional_experience.country,
          'zip_code', doctor_professional_experience.zip_code,
          'description', doctor_professional_experience.description,
          'clinic_experience', doctor_professional_experience.clinic_experience,
          'specialities', doctor_professional_experience.specialities
        ) AS professional_experience,
        (JSON_BUILD_OBJECT(
          'course', d02_doctor_details.course,
          'year', d02_doctor_details.year,
          'certificates', d02_doctor_details.certificates,
          'college_name', d02_doctor_details.collage_name

        )) AS doctor_details
      FROM
        d02_doctor_availability
      JOIN
        doctor_professional_experience ON d02_doctor_availability.doctor_id = doctor_professional_experience.doctor_id
      JOIN
        d02_doctor_details ON d02_doctor_details.doctor_uid = $1
      WHERE
        d02_doctor_availability.doctor_id = $2
      GROUP BY
        d02_doctor_availability.doctor_id,doctor_professional_experience.clinic_name,doctor_professional_experience.clinic_address,
          doctor_professional_experience.state,
          doctor_professional_experience.city,
          doctor_professional_experience.country,
          doctor_professional_experience.zip_code,
          doctor_professional_experience.description,
          doctor_professional_experience.clinic_experience,
          doctor_professional_experience.specialities, d02_doctor_details.course,
          d02_doctor_details.year,
          d02_doctor_details.collage_name,
          d02_doctor_details.certificates;`,
        [doctor_uid, doctor_id],
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
  
  //   au.id,
  //   au.name,
  //   au.phone,
  // au.level,
  // au.dob,
  // au.email,
  // au.gender,
  // au.address,
  // au.country,
  // au.city,
  // au.zip_code,
  getDoctorIfRegistered: (uid, name, level) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
        dd.doctor_uid,
       au.*
      FROM
        d02_doctor_details dd
        INNER JOIN action_users au ON dd.doctor_uid = au.uid
       WHERE
        au.uid = $1
        AND au.level = $2
        AND EXISTS (
            SELECT 1
            FROM d02_doctor_availability da
            WHERE da.doctor_id = au.id
        )
        AND EXISTS (
            SELECT 1
            FROM doctor_professional_experience dpe
            WHERE dpe.doctor_id = au.id
        )`,
        [uid, level],
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
  getPrescriptionsService: (doctor_id, patient_id, appointment_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM patient_medical_records WHERE doctor_id = $1 AND patient_id = $2 AND appointment_id = $3`,
        [doctor_id, patient_id, appointment_id],
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

  //   au.uid = 'c26fbc47-fb8e-4255-91a2-32d5eee81470'
  //   AND au.name = 'pathan'
  // AND au.level = 11
  // .query(
  //     `INSERT INTO public.action_users
  //      (name, dob, email, password, salt, gender, status, phone,level)
  //      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  //     [
  //       argsData.name,
  //       argsData.dob,
  //       argsData.email,
  //       encryptPassword,
  //       salt,
  //       argsData.gender,
  //       1,
  //       argsData.phone,
  //       argsData.level,
  //     ],
  //   );

  // createDoctorProfile:()=>{
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //       // `SELECT * FROM d02_doctor_details`,
  //       `SELECT * FROM action_users`,
  //       (error, results, fields) => {
  //         if (error) {
  //           console.log(error);
  //           return reject(error);
  //         }
  //         return resolve(results);
  //       }
  //     );
  //   });

  // }
  // .query(
  //     `INSERT INTO public.action_users
  //      (name, dob, email, password, salt, gender, status, phone,level)
  //      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  //     [
  //       argsData.name,
  //       argsData.dob,
  //       argsData.email,
  //       encryptPassword,
  //       salt,
  //       argsData.gender,
  //       1,
  //       argsData.phone,
  //       argsData.level,
  //     ],
  //   );
};

// action_users

// createUserAccount: (
//   college_name,
//   course,
//   year,
//   certificates)=> {
//       return new Promise((resolve, reject) => {
//         pool.query(
//           `INSERT INTO users(college_name, course, year, certificates,) VALUES (? ,? ,?, ?)`,
//           [ college_name,
//             course,
//             year,
//             certificates],
//           (error, results, fields) => {
//             if (error) {
//               console.log(error);
//               return reject(error);
//             }
//             return resolve(results);
//           }
//         );
//       });
//     },

// createUserAccount: (

//   first_name,
//   last_name,
//   email,
//   xero_user_id,
//   xero_id_token,
//   xero_access_token,
//   xero_refresh_token,
//   xero_expire_at,
//   token,
//   user_type
// ) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       `INSERT INTO users(first_name, last_name, email, xero_user_id, xero_id_token, xero_access_token, xero_refresh_token, xero_expire_at, token, user_type, role_id, is_verified) VALUES (? ,? ,?, ? ,? ,?, ?, ?, ?, ?, 1, 1)`,
//       [
//         first_name,
//         last_name,
//         email,
//         xero_user_id,
//         xero_id_token,
//         xero_access_token,
//         xero_refresh_token,
//         xero_expire_at,
//         token,
//         user_type,
//       ],
//       (error, results, fields) => {
//         if (error) {
//           console.log(error);
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// },
