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
    _id,
  } = event;

  let statusCode,
    message,
    detail;

  await db.collection('checkins')
    .aggregate()
    .match({
      checkin_id: _id
    })
    .lookup({
      from: 'users',
      localField: '_openid',
      foreignField: '_openid',
      as: 'user'
    })
    .unwind('$user')
    .project({
      _openid: 0,
      _id: 0,
      "user._openid": 0,
      "user.createTime": 0,
      "user.bindTime": 0,
      "user.language": 0,
      "user.type": 0,
      "user.school": 0,
      "user.uid": 0,
      "user.password": 0
    })
    .end()
    .then(({
      list
    }) => {
      detail = list
      statusCode = 200;
      message = "REQUEST SUCCESS";
    })
    .catch((err) => {
      statusCode = 404;
      message = "REQUEST ERROR";
    });


  return {
    statusCode,
    message,
    detail,
  }
}