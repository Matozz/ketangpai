import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  useReady,
  useDidShow,
  useDidHide,
  usePullDownRefresh
} from "@tarojs/taro";
import { AtButton, AtFab, AtTabs, AtTabsPane } from "taro-ui";

import "./course.scss";
import Taro from "@tarojs/taro";
import { CourseList, OptionsBar } from "../../components";

const tabList = [{ title: "我教的课" }, { title: "我听的课" }];
const options = [
  { title: "课件库", icon: "file-code" },
  { title: "试卷库", icon: "folder" },
  { title: "收藏", icon: "heart" }
];

const Course = () => {
  const [current, setCurrent] = useState(0);
  const [techList, setTechList] = useState([0]);
  const [learnList, setLearnList] = useState([]);

  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onReady
  useReady(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  const handleFabClick = () =>
    Taro.showActionSheet({
      itemList: ["创建课程", "加入班级"]
    })
      .then(res => {
        console.log(res.tapIndex);
      })
      .catch(res => {
        console.log(res.errMsg);
      });

  return (
    <View className="index">
      <OptionsBar options={options} />
      <AtTabs
        current={current}
        tabList={tabList}
        onClick={handleTabClick.bind(this)}
      >
        <AtTabsPane current={current} index={0}>
          <View className="tab">
            {techList.length === 0 ? (
              <View className="empty">点击 + 按钮创建课程</View>
            ) : (
              <CourseList />
            )}
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View className="tab">
            {learnList.length === 0 ? (
              <View className="empty">点击 + 按钮加入班级</View>
            ) : (
              <CourseList />
            )}
          </View>
        </AtTabsPane>
      </AtTabs>
      <View className="fab_btn">
        <AtFab onClick={handleFabClick}>
          <Text className="at-fab__icon at-icon at-icon-add"></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default Course;
