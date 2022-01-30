import Taro from "@tarojs/taro";

export const setCheckinProps = (
  _id: string,
  checkinType: "gps" | "number" | "qrcode",
  content: any
): Promise<any> => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    if (checkinType === "gps") {
      content = {
        longitude: content.longitude,
        latitude: content.latitude,
        range: content.radius
      };
    }
    db.collection("class_checkins")
      .doc(_id)
      .update({
        data: {
          content
        }
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

export const setCheckinFinish = (_id: string): Promise<any> => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("class_checkins")
      .doc(_id)
      .update({
        data: {
          finishTime: db.serverDate()
        }
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

export const getStudentCheckin = (checkin_id: string, uid): Promise<any> => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("checkins")
      .where({
        checkin_id,
        uid: uid ? uid : null
      })
      .get()
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
