// 云函数入口文件
const cloud = require("wx-server-sdk");
const stringRandom = require("string-random");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let {
    checkinType,
    cid,
    title,
    desc,
    schedule,
    finish,
    content
  } = event;

  let statusCode, message, checkin_id;

  if (new Date(schedule).getTime() > new Date(finish).getTime()) {
    return {
      statusCode: 404,
      message: "请选择晚于计划时间的考勤截止时间",
    };
  }

  if (checkinType == "number" && content.length != 4) {
    return {
      statusCode: 404,
      message: "请输入4位考勤码",
    };
  }

  if (checkinType == "qrcode") {
    content = stringRandom(16);
  }

  const event_info = {
    checkinType,
    title,
    extra: desc,
    scheduleTime: new Date(schedule),
    finishTime: new Date(finish),
  }

  await db
    .collection("class_checkins")
    .add({
      data: {
        cid,
        type: "checkin",
        content,
        createTime: db.serverDate(),
        ...event_info,
      },
    })
    .then((res) => {
      statusCode = 200;
      message = "创建成功";
      checkin_id = res._id;
    });

  cloud.callFunction({
    name: "dispatch_notification",
    data: {
      cid,
      event_id: checkin_id,
      event_type: 'checkin',
      event_info
    },
  });

  return {
    statusCode,
    message,
    checkin_id,
  };
};