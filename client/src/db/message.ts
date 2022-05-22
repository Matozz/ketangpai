import Taro from "@tarojs/taro";

// 本地的全量聚合，会很慢。。。（分页也快不到哪去）
export const getMessage = () => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("comments")
      .aggregate()
      .match({
        user_type: "0"
      })
      .lookup({
        from: "classes",
        localField: "cid",
        foreignField: "cid",
        as: "class"
      })
      .unwind("$class")
      .project({
        _openid: 0,
        _id: 0,
        "class._id": 0,
        "class._openid": 0
      })
      .end()
      .then(res => {
        console.log(res);
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
