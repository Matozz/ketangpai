// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const formatTime = (date) => {
  if (!date) return "";
  let formatedTime = "MM-dd hh:mm";
  const o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分钟
    "s+": date.getSeconds(), //秒
  };

  if (/(y+)/.test(formatedTime)) {
    formatedTime = formatedTime.replace(RegExp.$1, date.getFullYear());
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(formatedTime)) {
      formatedTime = formatedTime.replace(
        RegExp.$1,
        o[k].toString().length == 1 ? "0" + o[k] : o[k]
      );
    }
  }

  return formatedTime;
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let {
    cid,
    info,
    checkin
  } = event;

  if (checkin[0]) {
    const {
      checkinType,
      title,
      desc,
      content,
      startTime,
      finishTime
    } =
    checkin[0];

    const {
      result: {
        statusCode,
        message
      },
    } = await cloud.callFunction({
      name: "create_checkin",
      data: {
        checkinType,
        cid,
        title,
        desc,
        content,
        schedule: startTime,
        finish: finishTime,
      },
    });

    if (statusCode === 404) {
      return {
        statusCode,
        message,
      };
    }
  }

  let _statusCode, _message, detail_id;

  const {
    startTime: _startTime,
    finishTime: _finishTime,
    title: _title,
    desc: _desc,
  } = info.infoConfig;

  const _detail_content = [{
      content: [_startTime],
      title: "开始上课"
    },
    {
      content: [_finishTime],
      title: "下课"
    },
    ...(info.testConfig ? [{
        content: [info.testConfig.startTime],
        title: "课堂小测开始"
      },
      {
        content: [info.testConfig.finishTime],
        title: "课堂小测截止"
      },
    ] : []),
    ...(info.workConfig ? [{
        content: [info.workConfig.startTime],
        title: "作业提交开始"
      },
      {
        content: [info.workConfig.finishTime],
        title: "作业提交截止"
      },
    ] : []),
  ];

  const detail_content = _detail_content
    .sort((a, b) => new Date(a.content[0]) - new Date(b.content[0]))
    .map((item) => ({
      content: [
        formatTime(new Date(`${new Date(item.content[0]).toGMTString()}-8`)),
      ],
      title: item.title,
    }));

  const event_info = {
    title: _title,
    extra: _desc,
    content: detail_content,
    scheduleTime: new Date(_startTime),
  }

  await db
    .collection("class_details")
    .add({
      data: {
        cid,
        createTime: db.serverDate(),
        type: "detail",
        ...event_info,
      },
    })
    .then((res) => {
      _statusCode = 200;
      _message = "创建成功";
      detail_id = res._id;
    });

  cloud.callFunction({
    name: "dispatch_notification",
    data: {
      cid,
      event_id: detail_id,
      event_type: 'detail',
      event_info
    },
  });

  return {
    statusCode: _statusCode,
    message: _message,
    detail_id,
  };
};