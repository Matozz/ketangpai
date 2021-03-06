import { Image, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import { AtButton, AtList, AtListItem, AtTag } from "taro-ui";
import { DefaultValue } from "../../data/default";
import { setGlobalData, getGlobalData } from "../../data/global";
import { UserInfo } from "../../types/type";
import { Button } from "@taroify/core";

import "./my.scss";

const My = () => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const [isAuthed, setIsAuthed] = useState(false);
  const [isBinded, setIsBinded] = useState(false);

  useDidShow(() => {
    if (getGlobalData("USERINFO")) {
      setIsBinded(getGlobalData("BIND"));
      setIsAuthed(true);
      setUserInfo(getGlobalData("USERINFO"));
    }
  });

  const login = () => {
    // 1. Get user from database
    // 2. If yes `setAuth -> true` OR run code below & create user in database
    Taro.getUserProfile({
      desc: "用于完善用户个人信息"
    })
      .then(res => {
        Taro.showLoading({ title: "登录中" });
        Taro.cloud
          .callFunction({
            name: "login",
            data: {
              method: "auth",
              user: res.userInfo
            }
          })
          .then(({ result }: any) => {
            if (!result.statusCode) {
              Taro.hideLoading();
              Taro.showToast({
                title: "服务器开小差了，请稍后重试",
                icon: "none",
                duration: 2000
              });
            } else {
              console.log(result);
              setUserInfo(result.userInfo);
              setGlobalData("USERINFO", result.userInfo);
              setIsAuthed(true);
              Taro.hideLoading();
            }
          })
          .catch(err => {
            console.log(err);
            Taro.hideLoading();
            Taro.showToast({
              title: "登录失败",
              icon: "none",
              duration: 1500
            });
          });
      })
      .catch(err => {
        Taro.showToast({
          title: "授权以创建用户",
          icon: "none",
          duration: 1500
        });
        console.log(err);
      });
  };

  const editProfile = () => {};

  const handleNavigate = (path: string) => () => {
    if (isAuthed) {
      Taro.navigateTo({
        url: `/pages/${path}/${path}`
      });
    } else {
      Taro.showToast({
        title: "授权登录以继续",
        icon: "none",
        duration: 1500
      });
    }
  };

  return (
    <View>
      <View className="info">
        <View className="header">
          <Text className="title">
            {isAuthed
              ? userInfo?.realName ?? `${userInfo?.nickName}（身份未绑定）`
              : DefaultValue?.NickName}
          </Text>
          <Image
            className="avatar"
            src={isAuthed ? userInfo?.avatarUrl : DefaultValue.AvatarUrl}
          />
        </View>
        <View className="footer">
          {!isAuthed && (
            <Button size="small" onClick={login}>
              授权登录
            </Button>
          )}

          {isBinded && (
            <AtTag size="small">{userInfo.type == 0 ? "学生" : "教师"}</AtTag>
          )}
        </View>
      </View>

      <AtList>
        <AtListItem
          title="我的课件库"
          arrow="right"
          onClick={handleNavigate("courseware")}
          iconInfo={{ size: 25, color: "#6190E8", value: "file-code" }}
        />
        <AtListItem
          title="我的试卷库"
          arrow="right"
          onClick={handleNavigate("courseware")}
          iconInfo={{ size: 25, color: "#6190E8", value: "folder" }}
        />

        <AtListItem
          title="身份绑定"
          arrow="right"
          extraText={userInfo?.school}
          onClick={handleNavigate("user_bind")}
          iconInfo={{ size: 25, color: "#6190E8", value: "user" }}
        />
        {/* <AtListItem
          title="考勤提醒"
          arrow="right"
          extraText="开启"
          iconInfo={{ size: 25, color: "#6190E8", value: "bell" }}
        /> */}
      </AtList>
    </View>
  );
};

export default My;
