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
    event_id,
    event_type,
    event_info,
    cid,
  } = event;

  let message, statusCode;

  // 查询课程信息
  const {
    data: [class_info]
  } = await db.collection('classes').where({
    cid
  }).get()

  // 根据cid查询课堂所有学生
  await db.collection("class_links").where({
    cid,
    type: 0
  }).get().then(async ({
    data
  }) => {
    if (data.length > 0) {
      for (const link of data) {
        await db.collection('notifications').add({
          data: {
            _openid: link._openid,
            uid: link.uid,
            cid,
            class_name: class_info.name,
            createTime: db.serverDate(),
            event_id,
            event_type,
            event_info,
          }
        })
      }
      message = '通知发送成功'
      statusCode = 200
    } else {
      message = '通知发送失败，课堂无学生'
      statusCode = 403
    }
  })

  return {
    message,
    statusCode
  }
}