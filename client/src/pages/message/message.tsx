import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import { AtButton, AtTabs, AtTabsPane } from "taro-ui";

import "./message.scss";

const tabList = [{ title: "通知" }, { title: "留言" }];

const Message = () => {
  const [current, setCurrent] = useState(0);

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  return (
    <View className="message">
      <View className="tabs">
        <AtTabs
          current={current}
          tabList={tabList}
          onClick={handleTabClick.bind(this)}
        >
          {tabList.map(() => (
            <AtTabsPane current={current} index={0}>
              <View className="tab">
                <View className="empty">还没有收到通知</View>
              </View>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    </View>
  );
};

export default Message;
