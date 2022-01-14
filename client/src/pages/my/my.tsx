import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { AtButton } from "taro-ui";

import "./my.scss";

const My = () => {
  const [userInfo, setUserInfo] = useState({});
  const login = () => {
    Taro.getUserProfile({
      desc: "用于完善会员资料"
    })
      .then(res => {
        setUserInfo(res.userInfo);
        console.log(res);
      })
      .catch(err => console.log(err));
  };
  return (
    <View>
      <Text>My</Text>
      <View>Login</View>
      <AtButton type="secondary" circle={true} onClick={login}>
        +
      </AtButton>
    </View>
  );
};

export default My;
