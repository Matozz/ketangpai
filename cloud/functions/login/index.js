// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require("wx-server-sdk");

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext();

  let {
    user,
    method
  } = event;
  let statusCode,message, userInfo;

  await db
    .collection("users")
    .where({
      _openid: wxContext.OPENID,
    })
    .get()
    .then(async ({
      data
    }) => {
      if (data.length <= 0 && method === 'auth') {
        let newUser = {
          ...user,
          _openid: wxContext.OPENID,
          phoneNum: "",
          createTime: new db.serverDate(),
        };
        await db.collection("users").add({
          data: newUser,
        }).then((res) => {
          console.log(res);
          statusCode = 200;
          message = "USER CREATED";
          userInfo = user;
        })
      } else if (data.length > 0) {
        statusCode = 403;
        status = "USER EXSIST";
        userInfo = data[0];
      } else {
        statusCode = 403;
        status = "USER NOT FOUND";
      }
    })

    .catch((err) => {
      console.log(err);
    });

  return {
    statusCode,
    message,
    userInfo
  };
};