import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtButton, AtCard, AtCountdown, AtTimeline } from "taro-ui";
import { DetailCardProps } from "../../types/type";

import "./DetailCard.scss";

declare let wx: any;

const DetailCard = ({ title, extra, note, type, content }: DetailCardProps) => {
  const handleCheckin = () => {
    wx.showModal({
      title: "签到",
      editable: true,
      placeholderText: "请输入签到码",
      confirmText: "确认",
      success: res => {
        if (res.confirm) {
          console.log("用户点击确认");
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };

  const handleOpenFile = () => {
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

  return (
    <AtCard
      note={note}
      extra={extra}
      title={title}
      // thumb="http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG"
    >
      {type === "timeline" && <AtTimeline items={content}></AtTimeline>}

      {type === "file" && (
        <View>
          <Text>{content}</Text>
          <AtButton
            type="secondary"
            size="small"
            className="button"
            onClick={handleOpenFile}
          >
            查看
          </AtButton>
        </View>
      )}

      {type === "checkin" && (
        <View>
          <View className="checkin_box">
            <Text className="checkin_title">距离考勤结束还有：</Text>
            <AtCountdown
              isCard
              format={{ hours: ":", minutes: ":", seconds: "" }}
              hours={0}
              minutes={5}
              seconds={0}
            />
          </View>

          <AtButton
            type="secondary"
            size="small"
            className="button"
            onClick={handleCheckin}
          >
            去签到
          </AtButton>
        </View>
      )}

      {type === "notice" && <Text>{content}</Text>}
    </AtCard>
  );
};

export default DetailCard;
