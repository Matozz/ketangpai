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
    cid,
    premium
  } = event;

  let statusCode,
    message,
    status = {}

  const {
    data: detail
  } = await db.collection('class_checkins').doc(_id).get()

  const {
    result: {
      teacher,
      studentList
    }
  } = await cloud.callFunction({
    name: 'get_member',
    data: {
      cid,
      premium
    }
  })

  status.total = studentList.length;

  const {
    data
  } = await db.collection('checkins').where({
    checkin_id: _id
  }).get()

  status.checked = data.length

  statusCode = 200

  return {
    statusCode,
    message,
    detail,
    status
  }
}