import Taro from "@tarojs/taro";

export const createFile = (payload): Promise<any> => {
  const db = Taro.cloud.database();

  const { name, fileID, title, content, cid } = payload;

  const extension: string = name.substring(name.lastIndexOf(".") + 1);

  return new Promise((resolve, reject) => {
    db.collection("class_files")
      .add({
        data: {
          extra: extension.toUpperCase(),
          fileID,
          title,
          content,
          cid,
          createTime: db.serverDate(),
          scheduleTime: db.serverDate(),
          type: "file"
        }
      })
      .then(() => resolve(null));
  });
};
