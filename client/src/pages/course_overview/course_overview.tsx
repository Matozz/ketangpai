import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow, useReady } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtDivider, AtFab, AtIcon, AtTabs, AtTabsPane, AtTag } from "taro-ui";
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
  // const [cid, setCid] = useState("");

  useReady(() => {
    let { cid, name, desc, type, premium } = getCurrentInstance().router.params;
    setParams({ cid, name, desc, type, premium });

    Taro.setNavigationBarTitle({ title: name });
  });

  useDidShow(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  const handleFabClick = () =>
    Taro.showActionSheet({
      itemList: ["开始上课", "创建考勤", "发布公告"]
    })
      .then(({ tapIndex }) => {
        if (tapIndex == 0) {
          console.log(tapIndex);
        }
      })
      .catch(res => {
        console.log(res.errMsg);
      });

  return (
    <View className="overview">
      <View className="top">
        <View className="header">
          <View className="header-top">
            <Text className="title">
              {params.name} ({params.cid})
            </Text>
            {params.premium == 1 && (
              <View className="premium-box">
                <AtTag>
                  <AtIcon
                    className="premium"
                    value="lightning-bolt"
                    size="20"
                    color="#666"
                  ></AtIcon>
                  <Text>认证课程</Text>
                </AtTag>
              </View>
            )}
          </View>
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
                  <View className="empty">
                    {params.type == 1
                      ? "点击 + 发布教学活动"
                      : "老师还未发布教学活动"}
                  </View>
                ) : (
                  <CourseList />
                )}
              </View>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>

      {params.type == 1 && (
        <View className="fab_btn">
          <AtFab onClick={handleFabClick}>
            <Text className="at-fab__icon at-icon at-icon-add"></Text>
          </AtFab>
        </View>
      )}
    </View>
  );
};

export default CourseOverview;
