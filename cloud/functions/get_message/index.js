// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let statusCode, message, messageList = []

  const res = await db.collection("comments")
    .aggregate()
    .match({
      user_type: "0"
    })
    .lookup({
      from: "classes",
      localField: "cid",
      foreignField: "cid",
      as: "class"
    })
    .unwind("$class")
    .project({
      _openid: 0,
      _id: 0,
      "class._id": 0,
      "class._openid": 0
    })
    .end()

  messageList = res.list

  statusCode = 200;
  message = "REQUEST SUCCESS";

  return {
    statusCode,
    message,
    messageList
  }
}