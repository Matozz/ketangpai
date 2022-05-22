// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    cid,
    viewType
  } = event

  let statusCode, message, detailList = [],
    fileList = [],
    checkinList = [],
    noticeList = [];

  await db.collection('class_details')
    .where({
      cid,
      ...(viewType == 0 ? {
        scheduleTime: _.lte(new db.serverDate())
      } : {})
    })
    .orderBy('scheduleTime', 'desc')
    .get()
    .then(({
      data
    }) => {
      if (data.length > 0) {
        detailList = data
      }
    })

  await db.collection('class_files')
    .where({
      cid,
      ...(viewType == 0 ? {
        scheduleTime: _.lte(new db.serverDate())
      } : {})
    })
    .orderBy('scheduleTime', 'desc')
    .get()
    .then(({
      data
    }) => {
      if (data.length > 0) {
        fileList = data
      }
    })

  await db.collection('class_checkins')
    .where({
      cid,
      ...(viewType == 0 ? {
        scheduleTime: _.lte(new db.serverDate())
      } : {})
    })
    .orderBy('scheduleTime', 'desc')
    .get()
    .then(({
      data
    }) => {
      if (data.length > 0) {
        checkinList = data
      }
    })

  await db.collection('class_notices')
    .where({
      cid,
      ...(viewType == 0 ? {
        scheduleTime: _.lte(new db.serverDate())
      } : {})
    })
    .orderBy('scheduleTime', 'desc')
    .get()
    .then(({
      data
    }) => {
      if (data.length > 0) {
        noticeList = data
      }
    })

  statusCode = 200;
  message = "REQUEST SUCCESS";

  return {
    statusCode,
    message,
    list: [
      detailList,
      fileList,
      checkinList,
      noticeList
    ]
  }
}