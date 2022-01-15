import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow, useReady } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtDivider, AtIcon, AtTabs, AtTabsPane } from "taro-ui";
import { CourseList, OptionsBar } from "../../components";

import "./course_overview.scss";

const tabList = [
  { title: "全部" },
  { title: "课堂" },
  { title: "课件" },
  { title: "考勤" },
  { title: "公告" }
];
const options = [
  { title: "成员", icon: "user" },
  { title: "试卷库", icon: "folder" },
  { title: "分析", icon: "analytics" },
  { title: "设置", icon: "settings" }
];

const CourseOverview = () => {
  const [params, setParams] = useState({});
  const [current, setCurrent] = useState(0);

  useReady(() => {
    setParams(getCurrentInstance().router.params);
    Taro.showNavigationBarLoading();

    // Database
    setTimeout(() => {
      Taro.setNavigationBarTitle({ title: "科技文献检索实践" });
      Taro.hideNavigationBarLoading();
    }, 500);
  });

  useDidShow(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  return (
    <View className="overview">
      <View className="top">
        <View className="header">
          <Text className="title">科技文献检索实践</Text>
          <Text className="desc">18信计</Text>
        </View>
        <AtDivider lineColor="#EEEEEE" height={30} />

        <OptionsBar options={options} />
      </View>

      <View className="tabs">
        <Text className="title">学习日志</Text>
        <AtTabs
          current={current}
          tabList={tabList}
          onClick={handleTabClick.bind(this)}
        >
          {tabList.map(() => (
            <AtTabsPane current={current} index={0}>
              <View className="tab">
                {true ? (
                  <View className="empty">老师还没有发布教学活动</View>
                ) : (
                  <CourseList />
                )}
              </View>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    </View>
  );
};

export default CourseOverview;
