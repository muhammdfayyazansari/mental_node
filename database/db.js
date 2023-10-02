require("dotenv").config();
// console.log("enc username",process.env.MONGODB_USERNAME)
// console.log("enc username",process.env.MONGODB_PASSWORD)
const MONGODB_URL = `mongodb+srv://userfayyaz:dbfayyaz@cluster0.hfdzu25.mongodb.net/TodosWithAuth?retryWrites=true&w=majority`




module.exports = MONGODB_URL;