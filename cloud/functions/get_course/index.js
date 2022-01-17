// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    uid
  } = event

  let statusCode, message, techList = [], learnList = [];

  await db.collection('class_links')
    .aggregate()
    .match({
      _openid: wxContext.OPENID,
      uid
    })
    .lookup({
      from: 'users',
      localField: '_openid',
      foreignField: '_openid',
      as: 'user'
    })
    .lookup({
      from: 'classes',
      localField: 'cid',
      foreignField: 'cid',
      as: 'class'
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
    })
    .unwind('$class')
    .unwind('$user')
    .end()
    .then(({
      list
    }) => {
      if (list.length > 0) {
        console.log(list)
        techList = list.filter(item => item.type == 1)
        learnList = list.filter(item => item.type == 0)
      }
      statusCode = 200
      message = "REQUEST SUCCESS"
    }).catch(err => {
      statusCode = 404
      message = "REQUEST ERROR"
    })

  return {
    statusCode,
    message,
    techList,
    learnList
  }
}