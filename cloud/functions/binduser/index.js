// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let {
    method,
    credits: { uid, password },
  } = event;

  let statusCode, message, userInfo;

  if (method == "bind") {
    let avatarUrl;
    await db
      .collection("default_users")
      .where({
        uid,
        password,
      })
      .get()
      .then(async ({ data }) => {
        if (data.length > 0) {
          let { realName, school, type, uid, isBinded } = data[0];
          if (!isBinded) {
            await db
              .collection("users")
              .where({
                _openid: wxContext.OPENID,
              })
              .update({
                data: {
                  uid,
                  school,
                  type,
                  realName,
                  bindTime: new db.serverDate(),
                },
              });

            await db
              .collection("users")
              .where({
                _openid: wxContext.OPENID,
              })
              .get()
              .then(({ data }) => {
                userInfo = data[0];
                avatarUrl = data[0].avatarUrl;
                statusCode = 200;
                message = "绑定成功";
              });

            await db
              .collection("default_users")
              .where({
                uid,
                password,
              })
              .update({
                data: {
                  isBinded: true,
                  avatarUrl,
                },
              });
          } else {
            statusCode = 403;
            message = "该学号/工号已被绑定";
          }
        } else {
          statusCode = 404;
          message = "该学号/工号验证失败";
        }
      });
  } else if (method == "unbind") {
    await db
      .collection("default_users")
      .where({
        uid,
      })
      .update({
        data: {
          isBinded: _.remove(),
        },
      });

    await db
      .collection("users")
      .where({
        _openid: wxContext.OPENID,
      })
      .update({
        data: {
          bindTime: _.remove(),
          realName: _.remove(),
          school: _.remove(),
          type: _.remove(),
          uid: _.remove(),
        },
      });

    await db
      .collection("users")
      .where({
        _openid: wxContext.OPENID,
      })
      .get()
      .then(({ data }) => {
        userInfo = data[0];
        statusCode = 200;
        message = "解绑成功";
      });
  }

  return {
    statusCode,
    message,
    userInfo,
  };
};
