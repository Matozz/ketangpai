import { Text, View } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import React from "react";
import { AtCard } from "taro-ui";

import "./courseware.scss";

const Courseware = () => {
  usePullDownRefresh(() => {
    console.log("onPullDownRefresh");
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1500);
  });

  const handleClickFileCard = () => {
    Taro.showLoading({ title: "文件加载中" });
    Taro.cloud.downloadFile({
      fileID:
        "cloud1-7gweoaho6f4398d8.636c-cloud1-7gweoaho6f4398d8-1309227766/Chapter 3&4 语义建模 .pptx",
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
  const handleClickFileCard2 = () => {
    Taro.showLoading({ title: "文件加载中" });
    Taro.cloud.downloadFile({
      fileID:
        "cloud1-7gweoaho6f4398d8.636c-cloud1-7gweoaho6f4398d8-1309227766/WebSocket在实时消息推送中的应用设计与实现_吴绍卫.pdf",
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
      <AtCard
        className="file-card"
        note="PPTX"
        extra="2021/01/10"
        title="从渲染原理到性能优化"
        // thumb="https://icon-library.com/images/ppt-icon/ppt-icon-1.jpg"
        onClick={handleClickFileCard}
      >
        这也是内容区 可以随意定义功能
      </AtCard>
      <AtCard
        className="file-card"
        note="PDF"
        extra="2021/01/12"
        title="2022汤家凤线性代数辅导讲义"
        // thumb="https://freeiconshop.com/wp-content/uploads/edd/pdf-flat.png"
        onClick={handleClickFileCard2}
      >
        这也是内容区 可以随意定义功能
      </AtCard>
    </View>
  );
};

export default Courseware;
