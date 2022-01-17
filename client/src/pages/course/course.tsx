import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import { useReady, useDidShow, useDidHide } from "@tarojs/taro";
import {
  AtActivityIndicator,
  AtFab,
  AtFloatLayout,
  AtInput,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
  AtTabs,
  AtTabsPane
} from "taro-ui";

import "./course.scss";
import Taro from "@tarojs/taro";
import { CourseList, OptionsBar } from "../../components";
import { getGlobalData } from "../../data/global";
import login from "../../db/login";

const tabList = [{ title: "我教的课" }, { title: "我听的课" }];
const options = [
  { title: "课件库", icon: "file-code", path: "courseware" },
  { title: "试卷库", icon: "folder" },
  { title: "收藏", icon: "heart" }
];

const Course = () => {
  const [current, setCurrent] = useState(0);
  const [techList, setTechList] = useState([]);
  const [learnList, setLearnList] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isBinded, setIsBinded] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [focus, setFocus] = useState(false);

  const loadPage = () => {
    return new Promise((resolve, reject) => {
      setIsloading(true);
      login(
        ({ userInfo, isBinded }) => {
          setCurrent(isBinded && !userInfo.type ? 1 : 0);
          setIsBinded(isBinded);
          resolve(userInfo);
          let timer = setTimeout(() => {
            setIsloading(false);
            clearTimeout(timer);
          }, 300);
        },
        () => reject("Authentication failed")
      );
    });
  };

  const loadCourseList = userInfo => {
    Taro.cloud
      .callFunction({
        name: "get_course",
        data: {
          uid: userInfo?.uid ?? null
        }
      })
      .then(({ result: { statusCode, learnList, techList } }: any) => {
        console.log({ statusCode, learnList, techList });
        if (statusCode === 200) {
          setTechList(techList);
          setLearnList(learnList);
        }
      })
      .catch(err => {
        console.log(err);
        Taro.showToast({
          title: "课程信息请求失败",
          icon: "none",
          duration: 2000
        });
      });
  };

  useEffect(() => {});

  useReady(() => {
    loadPage()
      .then(userInfo => {
        loadCourseList(userInfo);
      })
      .catch(err => {
        Taro.showToast({
          title: "获取用户信息失败，请检查网络连接状态！",
          icon: "none",
          duration: 2000
        });
      });
  });

  useDidShow(() => {
    if (isBinded !== getGlobalData("BIND")) {
      loadPage();
    }
    if (getGlobalData("USERINFO")) {
      loadCourseList(getGlobalData("USERINFO"));
    }
  });

  useDidHide(() => {});

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  const handleFabClick = () =>
    Taro.showActionSheet({
      itemList: ["创建课程", "加入班级"]
    })
      .then(({ tapIndex }) => {
        if (tapIndex == 0) {
          Taro.navigateTo({
            url: "/pages/course_create/course_create"
          });
        } else {
          setShowModal(true);
          let timer = setTimeout(() => {
            setFocus(true);
            clearTimeout(timer);
          }, 300);
        }
      })
      .catch(res => {
        console.log(res.errMsg);
      });

  const handleModalClose = () => {
    setInputValue("");
    setShowModal(false);
    setFocus(false);
  };

  const handleInputChange = (value: any) => {
    setInputValue(value);
  };

  const handleJoinCourse = () => {
    console.log({ cid: inputValue });
  };

  return (
    <View className="index">
      <OptionsBar options={options} />

      <AtModal isOpened={showModal} onClose={handleModalClose}>
        <AtModalHeader>加入课程</AtModalHeader>
        <AtModalContent>
          {showModal && (
            <AtInput
              name="cid"
              type="text"
              placeholder="请输入课程码"
              value={inputValue}
              placeholderStyle="color:#cecece"
              onChange={handleInputChange}
              focus={focus}
            />
          )}
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleModalClose}>取消</Button>
          <Button disabled={inputValue == ""} onClick={handleJoinCourse}>
            确定
          </Button>
        </AtModalAction>
      </AtModal>

      {isLoading ? (
        <View className="loading">
          <AtActivityIndicator size={50} mode="center"></AtActivityIndicator>
        </View>
      ) : (
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
                <CourseList items={techList} />
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View className="tab">
              {learnList.length === 0 ? (
                <View className="empty">点击 + 按钮加入班级</View>
              ) : (
                <CourseList items={learnList} />
              )}
            </View>
          </AtTabsPane>
        </AtTabs>
      )}

      <View className="fab_btn">
        <AtFab onClick={handleFabClick}>
          <Text className="at-fab__icon at-icon at-icon-add"></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default Course;
