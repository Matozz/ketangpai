import Taro from "@tarojs/taro";

export default function getContainerHeight(selector?: string) {
  return new Promise<number>((resolve, reject) => {
    let screenHeight: number;

    screenHeight = Taro.getSystemInfoSync().windowHeight;
    Taro.createSelectorQuery()
      .select(".at-tabs__header")
      .boundingClientRect(rect => {
        resolve(screenHeight - rect.bottom);
      })
      .exec();
  });
}
