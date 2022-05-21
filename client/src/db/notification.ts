import Taro from "@tarojs/taro";

export const getNotification = uid => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("notifications")
      .where({
        uid
      })
      .orderBy("createTime", "desc")
      .get()
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
