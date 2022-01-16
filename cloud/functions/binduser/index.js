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

  let statusCode, userInfo;

  if (method == "bind") {
    await db
      .collection("rolls")
      .where({
        uid,
        password,
      })
      .get()
      .then(async ({ data }) => {
        if (data.length > 0) {
          let { name, school, type, uid, isBinded } = data[0];
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
                  realName: name,
                  bindTime: new db.serverDate(),
                },
              });

            await db
              .collection("rolls")
              .where({
                uid,
                password,
              })
              .update({
                data: {
                  isBinded: true,
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
              });
          } else {
            statusCode = 403;
          }
        } else {
          statusCode = 404;
        }
      });
  } else if (method == "unbind") {
    await db
      .collection("rolls")
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
      });
  }

  return {
    statusCode,
    userInfo,
  };
};
