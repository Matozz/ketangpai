// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let { uid, type } = event;

  let fileList = [];

  // 学生在的课程
  const { data } = await db
    .collection("class_links")
    .where(
      uid
        ? {
            uid,
            type: Number(type),
          }
        : {
            _openid: wxContext.OPENID,
            type: Number(type),
          }
    )
    .get();

  for (const course of data) {
    await db
      .collection("class_files")
      .aggregate()
      .match({
        cid: course.cid,
      })
      .lookup({
        from: "classes",
        localField: "cid",
        foreignField: "cid",
        as: "class",
      })
      .sort({
        scheduleTime: -1,
      })
      .unwind("$class")
      .project({
        _openid: 0,
        _id: 0,
        "class._id": 0,
        "class._openid": 0,
      })
      .end()
      .then(({ list: files }) => {
        if (files.length > 0) {
          fileList = fileList.concat(files);
        }
      });
  }

  return {
    fileList,
  };
};
