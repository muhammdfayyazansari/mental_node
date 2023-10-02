const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require('path');
// const dotenv = require("dotenv");
// dotenv.config();
require("dotenv").config();
const secret = process.env.JWT_SECRECT;
// const secret = "abracadabra";

module.exports.hashPassword = async (password) => {
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports.passwordMatcher = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
module.exports.generateToken = async (data) => {
  console.log("env", secret);
  const token = jwt.sign(data, secret, { expiresIn: "200y" });
  return token;
};
module.exports.getFormName = (formId) => {
  switch (formId) {
    case 21:
      return { formId: 21, name: "Anxiety" };
    case 22:
      return { formId: 22, name: "PSC-Child" };
    case 23:
      return { formId: 23, name: "PSC-Youth" };
    case 24:
      return { formId: 24, name: "Child-Intake" };
    default:
      console.log("Form not found");
      break;
  }
};

module.exports.ProgramFormEnum = {
  Anxiety: { formId: 21, name: "Anxiety" },
  PSC_Child: { formId: 22, name: "PSC-Child" },
  PSC_Youth: { formId: 23, name: "PSC-Youth" },
  Child_Intake: { formId: 24, name: "Child-Intake" },
};

module.exports.pscAnswers = [{ Never: 0, Sometimes: 1, Often: 2 }];
module.exports.score_ranges = [
  { min_score: 0, max_score: 40, interpretation: 'Stressed' },
  { min_score: 41, max_score: 70, interpretation: 'High stress' },
  {
    min_score: 71,
    max_score: 115,
    interpretation: 'Extreme level of anxiety',
  },
];
module.exports.quiz = [
  {
    question:
      'Most of the time do you find yourself taking actions for the plans you have set for your daily life?',
    options: [
      {
        text: 'Yes',
        score: 0,
      },
      {
        text: 'No',
        score: 15,
      },
    ],
  },
  {
    question:
      'Do you often find yourself having negative thoughts, repetitively?',
    options: [
      {
        text: 'Yes',
        score: 15,
      },
      {
        text: 'Sometimes',
        score: 8,
      },
      {
        text: 'No',
        score: 0,
      },
    ],
  },
  {
    question: 'Do you feel bothered by this?',
    options: [
      {
        text: 'Extremely',
        score: 20,
      },
      {
        text: 'Considerable',
        score: 15,
      },
      {
        text: 'Slightly',
        score: 10,
      },
      {
        text: 'Not at all',
        score: 0,
      },
    ],
  },
  {
    question: 'How do you feel when you achieve your goals?',
    options: [
      {
        text: 'Motivated',
        score: 0,
      },
      {
        text: 'Indifferent',
        score: 15,
      },
    ],
  },
  {
    question: 'Most of the time, do you feel overwhelmed in daily life?',
    options: [
      {
        text: 'Yes',
        score: 15,
      },
      {
        text: 'Sometimes',
        score: 10,
      },
      {
        text: 'No',
        score: 0,
      },
    ],
  },
  {
    question: 'On average, do you wake up feeling rested in the morning?',
    options: [
      {
        text: 'Most of the time',
        score: 5,
      },
      {
        text: 'Sometimes',
        score: 10,
      },
      {
        text: 'No',
        score: 15,
      },
    ],
  },
  {
    question:
      'Most of the time, do you find yourself being present at the moment?',
    options: [
      {
        text: 'Most of the time',
        score: 5,
      },
      {
        text: 'Sometimes',
        score: 10,
      },
      {
        text: 'No',
        score: 20,
      },
    ],
  },
];

module.exports.pscQuizResult = async(TestName, metadata) => {
  let score = 0;
  let pscAnswers = [{ Never: 0, Sometimes: 1, Often: 2 }]
  // const meta = JSON.parse(JSON.stringify(metadata));
  const meta = [...metadata];
  meta?.map((val) => {
    console.log('never', val['answer'].toLowerCase().toString() == 'never');
    if (val['answer'].toLowerCase().toString() == 'never') {
      score += pscAnswers[0].Never;
    }
    console.log('often', val['answer'].toLowerCase().toString() == 'often');
    if (val['answer'].toLowerCase().toString() == 'often') {
      score += pscAnswers[0].Often;
    }
    console.log(
      'sometimes',
      val['answer'].toLowerCase().toString() == 'sometimes',
    );
    if (val['answer'].toLowerCase().toString() == 'sometimes') {
      score += pscAnswers[0].Sometimes;
    }
    console.log(score);
    return val;
  });
  const result =
    score >= 40 && score <= 50
      ? '(You are Stressed)'
      : score >= 51 && score <= 70
      ? '(You are Highly Stressed)'
      : score > 70
      ? '(You have Extreme Level of Anxiety)'
      : '(Your Mental Health is Fine)';
  console.log('total', score);
  console.log('result', result);
  return { score, testName: TestName, result };
}
module.exports.deleteFile = async (fileName) => {
  const filePath = path.join(__dirname, '..', 'certificates', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      console.log('File deleted successfully');
    }
  });
};
