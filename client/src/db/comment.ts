import Taro from "@tarojs/taro";

export const createComment = (
  event_id: string,
  type: "detail" | "file" | "checkin" | "notice",
  user: string,
  payload: {
    title: string;
    content?: string;
  }
): Promise<any> => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("comments")
      .add({
        data: {
          event_id,
          type,
          user,
          ...payload,
          createTime: db.serverDate()
        }
      })

      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

export const getComments = (
  event_id: string,
  type: "detail" | "file" | "checkin" | "notice"
) => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("comments")
      .where({
        event_id,
        type
      })
      .orderBy("createTime", "desc")
      .get()
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
