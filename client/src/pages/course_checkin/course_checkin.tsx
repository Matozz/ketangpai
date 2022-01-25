import { Image, Map, Text, View } from "@tarojs/components";
import Taro, {
  getCurrentInstance,
  usePullDownRefresh,
  useReady
} from "@tarojs/taro";
import React, { useState } from "react";
import { AtDivider, AtFab, AtTag } from "taro-ui";
import { CommentList } from "../../components";

import "./course_checkin.scss";

declare let wx: any;

const CHECKIN_TYPE = {
  number: "数字",
  qrcode: "二维码",
  gps: "GPS"
};

const CourseCheckin = () => {
  const [params, setParams] = useState({});
  const [checkinType, setCheckinType] = useState("gps");
  const [circle, setCircle] = useState([
    {
      latitude: 23.099994,
      longitude: 113.32452,
      color: "#5383eb",
      fillColor: "#7cb5ec88",
      radius: 160,
      strokeWidth: 2
    },
    {
      latitude: 23.1006,
      longitude: 113.32452,
      color: "#16b900",
      fillColor: "#5cb97387",
      radius: 10,
      strokeWidth: 1
    },
    {
      latitude: 23.099998,
      longitude: 113.32652,
      color: "#b92500",
      fillColor: "#b95c5c86",
      radius: 10,
      strokeWidth: 1
    }
  ]);

  const loadDetail = (_id: string) => {
    Taro.showNavigationBarLoading();

    setTimeout(() => {
      Taro.hideNavigationBarLoading();
    }, 1000);
  };

  const handleFabClick = () =>
    Taro.showActionSheet({
      itemList: ["考勤详情", "放弃考勤", "结束考勤"]
    });

  const handleChangeRange = () => {
    wx.showModal({
      title: "更改范围",
      editable: true,
      placeholderText: "请输入新的签到范围",
      confirmText: "确认",
      success: ({ confirm, cancel, content }) => {
        if (confirm) {
          let range = parseInt(content);

          if (range < 20 || range > 5000) {
            Taro.showModal({
              title: "更改范围失败",
              content: "请输入大于20小于5000的数字",
              showCancel: false
            });
            return;
          }

          Taro.showLoading({ title: "更新中" });

          setTimeout(() => {
            setCircle([
              { ...circle[0], radius: range },
              ...circle.slice(1, circle.length)
            ]);
            Taro.hideLoading();
          }, 1000);
        } else if (cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };

  useReady(() => {
    let { _id, viewType } = getCurrentInstance().router.params;
    setParams({ _id, viewType });

    loadDetail(_id);
  });

  usePullDownRefresh(() => {
    console.log("onPullDownRefresh");
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1500);
  });

  return (
    <View className="container">
      <View className="top">
        <View className="header">
          <View className="header-top">
            <Text className="title">最后第一次课签到</Text>
            <Text className="status">
              <Text className="checked">1</Text>/2
            </Text>
          </View>
          <View className="tags">
            <AtTag size="small">22/01/04 00:00截止</AtTag>
            <AtTag size="small">{CHECKIN_TYPE[checkinType]}考勤</AtTag>
          </View>
          <Text className="desc">最后一节课没签到的期末考挂科！！！</Text>

          {checkinType == "number" && (
            <View className="checkin number">
              <View className="title">学生通过以下数字完成签到</View>
              <View className="change">更换一个</View>
              <View className="num">1234</View>
            </View>
          )}

          {checkinType == "gps" && (
            <View className="checkin map">
              <View className="title">学生通过GPS完成签到</View>
              <View className="change" onClick={handleChangeRange}>
                更改范围 ({circle[0].radius}米)
              </View>
              <Map
                style="width: 90%; height: 480rpx;"
                latitude={23.099994}
                longitude={113.32452}
                circles={circle}
              ></Map>
            </View>
          )}

          {checkinType == "qrcode" && (
            <View className="checkin qrcode">
              <View className="title">学生通过扫描二维码完成签到</View>
              <View className="change">更换一个</View>
              <Image
                className="code_img"
                src={"https://api.qrserver.com/v1/create-qr-code/?data=Example"}
              />
              <AtTag size="small">二维码每分钟刷新一次</AtTag>
            </View>
          )}
        </View>
        <AtDivider lineColor="#EEEEEE" height={30} />
        <Text className="create">创建于 21/12/28 16:15</Text>
      </View>

      <CommentList />

      <View className="fab_btn">
        <AtFab onClick={handleFabClick}>
          <Text className="at-fab__icon at-icon at-icon-menu"></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default CourseCheckin;
