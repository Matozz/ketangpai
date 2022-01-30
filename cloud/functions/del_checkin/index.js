// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const {
    checkin_id
  } = event

  let statusCode,
    message

  try {
    await db.collection('class_checkins').where({
      _id: checkin_id
    }).remove()

    await db.collection('checkins').where({
      checkin_id
    }).remove()

    statusCode = 200;
    message = '删除考勤成功'
  } catch (error) {
    statusCode = 404;
    message = '删除考勤失败'
  }

  return {
    statusCode,
    message
  }
}