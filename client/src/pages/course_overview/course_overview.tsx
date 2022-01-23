import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow, useReady } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtDivider, AtFab, AtIcon, AtTabs, AtTabsPane, AtTag } from "taro-ui";
import { CourseList, OptionsBar } from "../../components";

import "./course_overview.scss";

const tabTitle = [
  { title: "全部", contents: [] },
  { title: "课堂", contents: [] },
  { title: "课件", contents: [] },
  { title: "考勤", contents: [] },
  { title: "公告", contents: [] }
];

const CourseOverview = () => {
  const [params, setParams] = useState<any>({});
  const [current, setCurrent] = useState(0);
  const [tabList, setTabList] = useState(tabTitle);

  const loadDetails = (cid, viewType) => {
    Taro.showLoading({ title: "加载中" });
    Taro.cloud
      .callFunction({
        // 要调用的云函数名称
        name: "get_detail",
        // 传递给云函数的event参数
        data: {
          cid,
          viewType
        }
      })
      .then(({ result: { statusCode, message, list } }: any) => {
        console.log({ statusCode, message, list });
        let tabList = tabTitle.map((item, index) => {
          if (index === 0) {
            return { ...item, contents: list.flat(1) };
          } else {
            return { ...item, contents: list[index - 1] };
          }
        });

        setTabList(tabList);
        Taro.hideLoading();
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
      });
  };

  useReady(() => {
    let { cid, name, desc, type, premium } = getCurrentInstance().router.params;
    setParams({ cid, name, desc, type, premium });
    loadDetails(cid, type);
    Taro.setNavigationBarTitle({ title: name });
  });

  useDidShow(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  const handleFabClick = () =>
    Taro.showActionSheet({
      itemList: ["开始上课", "创建考勤", "上传课件", "发布公告"]
    })
      .then(({ tapIndex }) => {
        if (tapIndex == 0) {
          console.log(tapIndex);
        }
      })
      .catch(res => {
        console.log(res.errMsg);
      });

  const options = [
    {
      title: "成员",
      icon: "user",
      path: `/pages/member/member?cid=${params.cid}&type=${params.type}&premium=${params.premium}`
    },
    {
      title: "课件库",
      icon: "folder",
      path: `/pages/courseware/courseware?cid=${params.cid}`
    },
    { title: "分析", icon: "analytics" },
    { title: "设置", icon: "settings" }
  ];

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
                  <Text className="premium_text">认证课程</Text>
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
          {tabList.map(({ contents }) => (
            <AtTabsPane current={current} index={0}>
              <View className="tab">
                {contents?.length ?? 0 > 0 ? (
                  <CourseList
                    cardType="detail"
                    items={contents}
                    type={params.type}
                  />
                ) : (
                  <View className="empty">
                    {params.type == 1
                      ? "点击 + 发布教学活动"
                      : "老师还未发布教学活动"}
                  </View>
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
