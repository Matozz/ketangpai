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
    name,
    desc,
    premium,
    uid
  } = event;

  let message, statusCode;

  await db.collection("classes").where({
    cid
  }).get().then(async ({
    data
  }) => {
    if (data.length > 0) {
      message = 'CID EXSIST'
      statusCode = 403
    } else {
      await db.collection("classes").add({
        data: {
          _openid: wxContext.OPENID,
          cid,
          name,
          desc,
          premium,
          uid
        }
      })

      await db.collection('class_links').add({
        data: {
          _openid: wxContext.OPENID,
          cid,
          uid,
          type: 1
        }
      })

      message = 'COURSE CREATED'
      statusCode = 200
    }
  })

  return {
    statusCode,
    message
  }
}