// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    cid,
    premium
  } = event

  let statusCode, message, teacher, studentList;



  if (premium == 1) {
    await db.collection('class_links')
      .aggregate()
      .match({
        cid
      })
      .lookup({
        from: 'default_users',
        localField: 'uid',
        foreignField: 'uid',
        as: 'user'
      })
      .project({
        _openid: 0,
        _id: 0,
        cid: 0,
        uid: 0,
        "user._id": 0,
        "user._openid": 0,
        "user.createTime": 0,
        "user.language": 0,
        "user.type": 0,
        "user.school": 0,
        "user.isBinded": 0,
        "user.password": 0
      })
      .unwind("$user")
      .end()
      .then(({
        list
      }) => {
        if (list.length > 0) {
          teacher = list.filter((item) => item.type == 1);
          studentList = list.filter((item) => item.type == 0);
        }
        statusCode = 200;
        message = "REQUEST SUCCESS";
      })
      .catch((err) => {
        statusCode = 404;
        message = "REQUEST ERROR";
      });
  } else {
    await db.collection('class_links')
      .aggregate()
      .match({
        cid
      })
      .lookup({
        from: 'users',
        localField: '_openid',
        foreignField: '_openid',
        as: 'user'
      })
      .project({
        _openid: 0,
        _id: 0,
        cid: 0,
        uid: 0,
        "user._id": 0,
        "user._openid": 0,
        "user.createTime": 0,
        "user.type": 0,
        "user.school": 0,
        "user.language": 0,
        "user.city": 0,
        "user.country": 0,
        "user.gender": 0,
        "user.uid": 0,
        "user.province": 0,
        "user.phoneNum": 0,
        "user.bindTime": 0,
        "user.realName": 0,
      })
      .unwind("$user")
      .end()
      .then(({
        list
      }) => {
        if (list.length > 0) {
          teacher = list.filter((item) => item.type == 1);
          studentList = list.filter((item) => item.type == 0);
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
    teacher,
    studentList,
  };
}