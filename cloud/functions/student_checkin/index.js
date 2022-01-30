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
    type,
    checkin_id,
    uid,
    body
  } = event

  let statusCode, message;

  if (type == 'qrcode' && Date.now() > body.expire) {
    return {
      statusCode: 404,
      message: "考勤码超时，请重新扫码"
    }
  }

  if (type !== 'gps') {
    await db.collection('class_checkins').doc(checkin_id).get().then(async ({
      data
    }) => {
      let {
        content,
        finishTime
      } = data
      if (Date.now() > new Date(finishTime).getTime()) {
        statusCode = 404;
        message = '考勤已结束'
      } else if (content != body.content) {
        statusCode = 404;
        message = '签到失败'
      } else {
        await db.collection('checkins').add({
          data: {
            _openid: wxContext.OPENID,
            createTime: new db.serverDate(),
            checkin_id,
            uid
          }
        })
        statusCode = 200;
        message = '签到成功'
      }
    })
  } else {
    await db.collection('checkins').add({
      data: {
        _openid: wxContext.OPENID,
        createTime: new db.serverDate(),
        content: body.content,
        checkin_id,
        uid
      }
    })
    statusCode = 200;
    message = '签到成功'
  }


  return {
    statusCode,
    message
  }
}