import Taro from "@tarojs/taro";

export default function getClasses(): Promise<any> {
  const db = Taro.cloud.database();

  return new Promise((resolve, reject) => {
    db.collection("default_classes")
      .get()
      .then(res => {
        resolve(res.data);
      })
      .catch(err => reject(err));
  });
}
