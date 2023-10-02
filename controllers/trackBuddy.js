const CircleModel = require("./../schemaModels/trackBuddyModels");

module.exports.createCircle = (req, res) => {
  const { members, circleCode, author, circleName } = req.body;
  console.log("circle body", req.body);
  console.log("circle>>>>", members, circleCode, author, circleName);
  try {
    const Circle_Body = new CircleModel(req.body);
    Circle_Body.save(async (err, doc) => {
      if (!err) {
        // const circles = await CircleModel.find({});
        // console.log("doc>>>", doc);
        return res.status(200).send({
          message: "success",
          circle: doc,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
};
module.exports.joinCircle = async (req, res) => {
  const { circleName, circleCode, author, memberData } = req.body;
  console.log("circle>>>>", circleName, circleCode, author, memberData);
  try {
    const findMembers = await CircleModel.findOne({
      circleName,
      circleCode,
      author,
    });
    console.log("findMembrs", findMembers);
    if (!findMembers) {
      return res.send({
        message: "circle Code or circle name or author is incorrect",
      });
    }
    let members = [...findMembers.members, memberData];
    const circle = await CircleModel.findOneAndUpdate(
      { circleName, circleCode, author },
      { members },
      { new: true }
    );
    console.log("circle ", circle);
    return res.status(200).send({
      message: "Join circle is successfully completed!",
      circle: circle,
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
};

module.exports.getCircles = async (req, res) => {
  try {
    console.log("getCircles id ==>", req.params.id);
    const getMyCircles = await CircleModel.find({
      "members._id": req.params.id,
    });
    res.status(200).send({
      message: "data send",
      circles: getMyCircles,
    });
  } catch (error) {
    console.log("error in getCircle", error.message);
    res.status(500);
    res.send({
      message: "error",
      error: error,
    });
  }
};
 