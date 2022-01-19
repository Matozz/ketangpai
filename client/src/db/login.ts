import Taro from "@tarojs/taro";
import { getGlobalData, setGlobalData } from "../data/global";

export default function login(callback, errorCallback) {
  if (getGlobalData("USERINFO")) {
    typeof callback === "function" &&
      callback({
        userInfo: getGlobalData("USERINFO"),
        isBinded: getGlobalData("BIND")
      });
  } else {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {
          method: "check"
        }
      })
      .then(({ result }: any) => {
        console.log(result);

        if (!result.statusCode) {
          Taro.showToast({
            title: "服务器开小差了，请稍后重试",
            icon: "none",
            duration: 2000
          });
        }

        setGlobalData("USERINFO", result.userInfo);
        setGlobalData("BIND", !!result.userInfo?.uid);

        typeof callback === "function" &&
          callback({
            userInfo: result.userInfo,
            isBinded: !!result.userInfo?.uid
          });
      })
      .catch(err => {
        console.log(err);
        errorCallback();
      });
  }
}
