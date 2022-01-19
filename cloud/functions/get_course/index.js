// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let { uid, type } = event;

  let statusCode,
    message,
    techList = [],
    learnList = [];

  if (uid) {
    await db
      .collection("class_links")
      .aggregate()
      .match({
        uid: uid,
      })
      .lookup({
        from: "class_links",
        localField: "cid",
        foreignField: "cid",
        as: "user",
      })
      .unwind("$user")
      .match({
        "user.type": 1,
      })
      .lookup({
        from: "default_users",
        localField: "user.uid",
        foreignField: "uid",
        as: "user",
      })
      .lookup({
        from: "classes",
        localField: "cid",
        foreignField: "cid",
        as: "class",
      })
      .project({
        _openid: 0,
        _id: 0,
        "class._id": 0,
        "class._openid": 0,
        "user._id": 0,
        "user._openid": 0,
        "user.createTime": 0,
        "user.language": 0,
        "user.type": 0,
        "user.school": 0,
        "user.password": 0,
      })
      .unwind("$class")
      .unwind("$user")
      .end()
      .then(({ list }) => {
        if (list.length > 0) {
          // console.log(list);
          techList = list.filter((item) => item.type == 1);
          learnList = list.filter((item) => item.type == 0);
        }
        statusCode = 200;
        message = "REQUEST SUCCESS";
      })
      .catch((err) => {
        statusCode = 404;
        message = "REQUEST ERROR";
      });

    await db
      .collection("class_links")
      .aggregate()
      .match({
        _openid: "o67RG5e80GwIT4ihFGKZVPm4CcME",
        uid: type == 0 ? null : undefined,
      })
      .lookup({
        from: "classes",
        localField: "cid",
        foreignField: "cid",
        as: "class",
      })
      .unwind("$class")
      .match({
        "class.premium": false,
      })
      .lookup({
        from: "class_links",
        localField: "cid",
        foreignField: "cid",
        as: "user",
      })
      .unwind("$user")
      .match({
        "user.type": 1,
      })
      .lookup({
        from: "users",
        localField: "user._openid",
        foreignField: "_openid",
        as: "user",
      })
      .unwind("$user")
      .project({
        _openid: 0,
        _id: 0,
        "class._id": 0,
        "class._openid": 0,
        "user._id": 0,
        "user._openid": 0,
        "user.createTime": 0,
        "user.bindTime": 0,
        "user.language": 0,
        "user.city": 0,
        "user.country": 0,
        "user.gender": 0,
        "user.province": 0,
        "user.school": 0,
        "user.type": 0,
        "user.uid": 0,
        "user.realName": 0,
        "user.phoneNum": 0,
        "user.password": 0,
      })
      .end()
      .then(({ list }) => {
        if (list.length > 0) {
          // console.log(list);
          techList = [...techList, ...list.filter((item) => item.type == 1)];
          learnList = [...learnList, ...list.filter((item) => item.type == 0)];
        }
        statusCode = 200;
        message = "REQUEST SUCCESS";
      })
      .catch((err) => {
        statusCode = 404;
        message = "REQUEST ERROR";
      });
  } else {
    await db
      .collection("class_links")
      .aggregate()
      .match({
        _openid: wxContext.OPENID,
        uid: null,
      })
      .lookup({
        from: "classes",
        localField: "cid",
        foreignField: "cid",
        as: "class",
      })
      .unwind("$class")
      .match({
        "class.premium": false,
      })
      .lookup({
        from: "class_links",
        localField: "cid",
        foreignField: "cid",
        as: "user",
      })
      .unwind("$user")
      .match({
        "user.type": 1,
      })
      .lookup({
        from: "users",
        localField: "user._openid",
        foreignField: "_openid",
        as: "user",
      })
      .unwind("$user")
      .project({
        _openid: 0,
        _id: 0,
        "class._id": 0,
        "class._openid": 0,
        "user._id": 0,
        "user._openid": 0,
        "user.createTime": 0,
        "user.bindTime": 0,
        "user.language": 0,
        "user.city": 0,
        "user.country": 0,
        "user.gender": 0,
        "user.province": 0,
        "user.school": 0,
        "user.type": 0,
        "user.uid": 0,
        "user.realName": 0,
        "user.phoneNum": 0,
        "user.password": 0,
      })
      .end()
      .then(({ list }) => {
        if (list.length > 0) {
          // console.log(list);
          techList = list.filter((item) => item.type == 1);
          learnList = list.filter((item) => item.type == 0);
        }
        statusCode = 200;
        message = "REQUEST SUCCESS";
      })
      .catch((err) => {
        statusCode = 404;
        message = "REQUEST ERROR";
      });
  }

  return {
    statusCode,
    message,
    techList,
    learnList,
  };
};
