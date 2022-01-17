import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow, useReady } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtDivider, AtTabs, AtTabsPane } from "taro-ui";
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
  { title: "课件库", icon: "folder" },
  { title: "分析", icon: "analytics" },
  { title: "设置", icon: "settings" }
];

const CourseOverview = () => {
  const [params, setParams] = useState<any>({});
  const [current, setCurrent] = useState(0);
  const [cid, setCid] = useState("");

  useReady(() => {
    let { _cid, name, desc, type } = getCurrentInstance().router.params;
    setParams({ cid, name, desc, type });

    Taro.setNavigationBarTitle({ title: name });
  });

  useDidShow(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  return (
    <View className="overview">
      <View className="top">
        <View className="header">
          <Text className="title">{params.name}</Text>
          <Text className="desc">{params.desc}</Text>
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
