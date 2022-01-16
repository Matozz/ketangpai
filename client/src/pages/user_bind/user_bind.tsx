import { Picker, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import { AtButton, AtForm, AtInput, AtList, AtListItem } from "taro-ui";
import { getGlobalData, setGlobalData } from "../../data/global";

import "./user_bind.scss";

const schoolList = ["厦门理工学院"];

const UserBind = () => {
  const [school, setSchool] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [isBinded, setIsBinded] = useState(false);

  useDidShow(() => {
    if (getGlobalData("USERINFO")?.uid) {
      setIsBinded(true);
      setUid(getGlobalData("USERINFO").uid);
    }
  });

  const handleUidChange = (value: any) => {
    setUid(value);
  };

  const handlePasswordChange = (value: any) => {
    setPassword(value);
  };

  const handlePickerChange = e => {
    setSchool(schoolList[e.detail.value]);
  };

  const handleBind = (method: string) => () => {
    Taro.showLoading({ title: method == "bind" ? "身份绑定中" : "解绑中" });

    Taro.cloud
      .callFunction({
        name: "binduser",
        data: {
          method: method,
          credits: {
            uid,
            password
          }
        }
      })
      .then(({ result: { statusCode, userInfo } }: any) => {
        console.log({ statusCode, userInfo });
        if (statusCode == 200) {
          Taro.hideLoading();
          Taro.showToast({
            title: method == "bind" ? "绑定成功" : "解绑成功",
            icon: "success",
            duration: 1500
          });
          setGlobalData("USERINFO", userInfo);
          setTimeout(() => {
            Taro.navigateBack({ delta: 1 });
          }, 1500);
        } else {
          Taro.hideLoading();
          Taro.showToast({
            title: method == "bind" ? "绑定失败" : "解绑失败",
            icon: "none",
            duration: 1500
          });
        }
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
        Taro.showToast({
          title: method == "bind" ? "绑定失败" : "解绑失败",
          icon: "none",
          duration: 1500
        });
      });
  };

  return (
    <View className="userbind">
      {!isBinded ? (
        <View>
          <Picker
            mode="selector"
            range={schoolList}
            onChange={handlePickerChange}
          >
            <AtList>
              <AtListItem
                title="学校"
                className={school ? "" : "item-placeholder"}
                extraText={school ? school : "请选择您的学校"}
              />
            </AtList>
          </Picker>
          <AtInput
            name="uid"
            title="账号"
            type="text"
            placeholder="请输入您的工号或学号"
            value={uid}
            placeholderStyle="color:#cecece"
            onChange={handleUidChange}
          />
          <AtInput
            name="password"
            title="密码"
            type="password"
            placeholder="默认密码为工号或学号的后六位"
            value={password}
            placeholderStyle="color:#cecece"
            onChange={handlePasswordChange}
          />
          <AtButton
            disabled={!school || !uid || !password}
            className="submit_btn"
            type="primary"
            onClick={handleBind("bind")}
          >
            确认绑定
          </AtButton>
        </View>
      ) : (
        <View>
          <AtButton
            className="submit_btn"
            type="primary"
            onClick={handleBind("unbind")}
          >
            解除绑定
          </AtButton>
        </View>
      )}
    </View>
  );
};

export default UserBind;
