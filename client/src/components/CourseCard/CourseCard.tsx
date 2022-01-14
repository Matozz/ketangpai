import { ITouchEvent, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtIcon } from "taro-ui";

import "./CourseCard.scss";

const CourseCard = () => {
  const handleCourseClick = () => {
    Taro.navigateTo({
      url: "/pages/course_overview/course_overview"
    });
  };

  const handleMenuClick = (e: ITouchEvent) => {
    e.stopPropagation();
    Taro.showActionSheet({
      itemList: ["置顶", "退出班级"]
    })
      .then(res => {
        console.log(res.tapIndex);
      })
      .catch(res => {
        console.log(res.errMsg);
      });
  };

  return (
    <View className="card" onClick={handleCourseClick}>
      <View className="header">
        <Text className="title">科技文献检索实践</Text>
        <View
          onClick={handleMenuClick}
          className="at-icon at-icon-menu menu-icon"
        ></View>
      </View>
      <View className="footer">
        <Text>18信计</Text>
        <View className="teacher">
          <Text>欧启通</Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
