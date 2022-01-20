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
    method,
    info
  } = event

  let statusCode, message;

  if (method == 'byCid') {
    let {
      cid,
      uid
    } = info
    await db.collection('classes').where({
      cid
    }).get().then(async ({
      data
    }) => {
      if (data.length > 0) {
        // console.log(data[0], uid)
        let _class = data[0]
        if (_class.premium && uid == '') {
          statusCode = 403
          message = '该课程为认证课程，请绑定身份后重试'
        } else if (_class.uid == uid || (!_class.premium && _class._openid == wxContext.OPENID)) {
          statusCode = 403
          message = '您是该课程管理员，无需重复加入'
        } else {
          await db.collection('class_links').where({
            _openid: wxContext.OPENID,
            cid,
            type: 0
          }).get().then(async ({
            data
          }) => {
            if (data.length > 0) {
              statusCode = 403
              message = '您已在该课程中'
            } else {
              await db.collection('class_links').add({
                data: {
                  _openid: wxContext.OPENID,
                  cid,
                  uid: uid == '' ? undefined : uid,
                  type: 0
                }
              })
              statusCode = 200
              message = '加入课程成功'
            }
          })
        }
      } else {
        statusCode = 403
        message = '课程不存在'
      }
    })
  } else if (method == 'byUid') {
    let {
      teacher_uid,
      cid,
      uid
    } = info
    await db.collection('default_users').where({
      uid
    }).get().then(async ({
      data
    }) => {
      if (data.length > 0) {
        if (teacher_uid == uid) {
          statusCode = 403
          message = '添加失败，请输入学生学号'
        } else {
          await db.collection('class_links').where({
            uid,
            cid,
            type: 0
          }).get().then(async ({
            data
          }) => {
            if (data.length > 0) {
              statusCode = 403
              message = '该学生已在该课程中'
            } else {
              await db.collection('class_links').add({
                data: {
                  cid,
                  uid,
                  type: 0
                }
              })
              statusCode = 200
              message = '添加成功'
            }
          })
        }
      } else {
        statusCode = 403
        message = '学号不存在'
      }
    })
  } else if (method == 'byGroup') {

  }

  return {
    statusCode,
    message
  }
}