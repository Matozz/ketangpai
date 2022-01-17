import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtButton, AtInput, AtList, AtListItem, AtNoticebar } from "taro-ui";
import { CourseCard } from "../../components";
import { getGlobalData } from "../../data/global";
import { UserInfo } from "../../types/type";

import "./course_create.scss";

const generateCourseId = (randomLength: number) => {
  return Number(
    Math.random()
      .toString()
      .substr(2, randomLength) + Date.now()
  )
    .toString(36)
    .substring(0, 8)
    .toUpperCase();
};

const CourseCreate = () => {
  const [isBinded, setIsBinded] = useState(false);
  const [cid, setCid] = useState(generateCourseId(4));
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});

  useDidShow(() => {
    setIsBinded(getGlobalData("USERINFO")?.type == 1);
    setUserInfo(getGlobalData("USERINFO"));
  });

  const handleNameChange = (value: any) => {
    setName(value);
  };

  const handleDescChange = (value: any) => {
    setDesc(value);
  };

  const handleCreateCourse = () => {
    Taro.showLoading({ title: "创建中" });
    console.log({ cid, name, desc, premium: isBinded, uid: userInfo.uid });

    Taro.cloud
      .callFunction({
        name: "create_course",
        data: { cid, name, desc, premium: isBinded, uid: userInfo.uid }
      })
      .then(({ result: { statusCode, message } }: any) => {
        console.log({ statusCode, message });
        if (statusCode == 200) {
          Taro.showToast({
            title: "创建成功",
            icon: "success",
            duration: 1500
          });
        } else if (statusCode == 403) {
          Taro.showToast({
            title: "课程码已存在，已生成新的课程码",
            icon: "none",
            duration: 1500
          });
          setCid(generateCourseId(4));
        }
        Taro.hideLoading();
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
      });
  };

  return (
    <View className="course_create">
      {isBinded ? (
        <AtNoticebar className="notification" icon="lightning-bolt">
          认证课程，可以通过学号添加学生
        </AtNoticebar>
      ) : (
        <AtNoticebar className="notification" icon="alert-circle">
          未认证课程仅可通过课程码加入
        </AtNoticebar>
      )}
      <View>
        <AtList>
          <AtListItem title="课程码" extraText={cid} />
        </AtList>
        <AtInput
          name="name"
          title="课程"
          type="text"
          placeholder="请输入课程名称"
          value={name}
          placeholderStyle="color:#cecece"
          onChange={handleNameChange}
        />
        <AtInput
          name="desc"
          title="描述"
          placeholder="请输入课程描述"
          value={desc}
          placeholderStyle="color:#cecece"
          onChange={handleDescChange}
        />
        <View>
          <Text className="header_title">卡片预览</Text>
          <CourseCard
            name={name == "" ? "请输入课程名称" : name}
            desc={desc}
            teacher={userInfo.realName ? userInfo.realName : userInfo.nickName}
            avatarUrl={userInfo.avatarUrl}
            premium={isBinded}
          />
        </View>
        <AtButton
          disabled={!name || !cid}
          className="submit_btn"
          type="primary"
          onClick={handleCreateCourse}
        >
          创建
        </AtButton>
      </View>
    </View>
  );
};

export default CourseCreate;
