import { Text, View } from "@tarojs/components";
import React from "react";
import { AtIcon } from "taro-ui";

import "./OptionsBar.scss";

type Option = {
  title: string;
  icon: string;
  size?: number;
  color?: string;
};

interface Options {
  options: Array<Option>;
}

const OptionsBar = ({ options }: Options) => {
  return (
    <View className="options">
      {options.map(({ title, icon, size, color }: Option) => (
        <View className="option" key={title}>
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
