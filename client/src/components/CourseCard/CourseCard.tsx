import { Image, ITouchEvent, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React from "react";
import { AtIcon } from "taro-ui";
import { DefaultValue } from "../../data/default";
import { CourseCardProps } from "../../types/type";

import "./CourseCard.scss";

const CourseCard = ({
  name,
  desc,
  options,
  teacher,
  avatarUrl,
  premium,
  cid,
  type
}: CourseCardProps) => {
  const handleCourseClick = () => {
    Taro.navigateTo({
      url: `/pages/course_overview/course_overview?cid=${cid}&name=${name}&desc=${desc}&type=${type}&premium=${
        premium ? 1 : 0
      }`
    });
  };

  const handleMenuClick = (e: ITouchEvent) => {
    e.stopPropagation();
    Taro.showActionSheet({
      itemList: ["置顶", type == 0 ? "退出班级" : "删除课程"]
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
        <Text className="title">{name}</Text>
        {premium && (
          <AtIcon
            className="premium"
            value="lightning-bolt"
            size="22"
            color="#fff"
          ></AtIcon>
        )}
        {options && (
          <View
            onClick={handleMenuClick}
            className="at-icon at-icon-menu menu-icon"
          ></View>
        )}
      </View>

      <View className="footer">
        <Text className="desc">{desc}</Text>
        <View className="teacher">
          <Text style="white-space:nowrap">{teacher}</Text>
          <Image
            className="avatar"
            src={avatarUrl ? avatarUrl : DefaultValue.AvatarUrl}
          />
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
