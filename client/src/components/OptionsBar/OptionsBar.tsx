import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useState } from "react";
import { AtIcon } from "taro-ui";
import { getGlobalData } from "../../data/global";

import "./OptionsBar.scss";

type Option = {
  title: string;
  icon: string;
  size?: number;
  color?: string;
  path?: string;
};

interface Options {
  options: Array<Option>;
}

const OptionsBar = ({ options }: Options) => {
  const handleNavigate = (path: string) => () => {
    if (getGlobalData("USERINFO")) {
      Taro.navigateTo({
        url: path
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
    <View className="options">
      {options.map(({ title, icon, size, color, path }: Option) => (
        <View className="option" key={title} onClick={handleNavigate(path)}>
          <AtIcon
            value={icon}
            size={size ?? 30}
            color={color ?? "#6190E8"}
          ></AtIcon>
          <Text>{title}</Text>
        </View>
      ))}
    </View>
  );
};

export default OptionsBar;
