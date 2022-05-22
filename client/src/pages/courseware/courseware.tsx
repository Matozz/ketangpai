import { Text, View } from "@tarojs/components";
import Taro, { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import React, { useState } from "react";
import { AtCard } from "taro-ui";
import { getGlobalData } from "../../data/global";
import { formatTime } from "../../utils";

import "./courseware.scss";

const Courseware = () => {
  const [fileList, setFileList] = useState<any>([]);
  useDidShow(async () => {
    Taro.showLoading({ title: "加载中" });
    const {
      result: { fileList: data }
    }: any = await Taro.cloud.callFunction({
      name: "get_file",
      data: {
        uid: getGlobalData("USERINFO").uid,
        type: getGlobalData("USERINFO").type
      }
    });

    setFileList(data);
    Taro.hideLoading();
  });

  const handleClickFileCard = fileID => {
    Taro.showLoading({ title: "文件加载中" });
    Taro.cloud.downloadFile({
      fileID,
      success: function(res) {
        const filePath = res.tempFilePath;
        Taro.openDocument({
          filePath: filePath,
          success: function(res) {
            console.log("打开文档成功");
            Taro.hideLoading();
          }
        });
      }
    });
  };

  return (
    <View className="courseware">
      {fileList.map(item => (
        <AtCard
          className="file-card"
          note={formatTime(new Date(item.scheduleTime))}
          extra={item.extra}
          title={item.title}
          onClick={() => handleClickFileCard(item.fileID)}
        >
          <View>来自课程：{item.class.name}</View>
        </AtCard>
      ))}
    </View>
  );
};

export default Courseware;
