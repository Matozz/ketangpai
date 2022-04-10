import Taro from "@tarojs/taro";

export default async function getLocation({ latitude, longitude }) {
  const res = await Taro.request({
    url: "https://api.map.baidu.com/geocoder", //仅为示例，并非真实的接口地址
    data: {
      location: `${latitude},${longitude}`,
      output: "json"
    },
    header: {
      "content-type": "application/json" // 默认值
    }
  });

  return res.data.result;
}
