import Taro from "@tarojs/taro";

export const getCourseDetail = (_id): Promise<any> => {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("class_details")
      .doc(_id)
      // @ts-ignore
      .get()
      .then(res => resolve(res.data));
  });
};
