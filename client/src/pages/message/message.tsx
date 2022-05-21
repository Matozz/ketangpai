import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useCallback, useEffect, useState } from "react";
import { AtButton, AtCard, AtTabs, AtTabsPane } from "taro-ui";
import { getGlobalData } from "../../data/global";
import { getNotification } from "../../db/notification";
import { formatTime } from "../../utils";
import EventCard from "./card";

import "./message.scss";

const tabList = [{ title: "通知" }, { title: "留言" }];

const Message = () => {
  const [current, setCurrent] = useState(0);
  const [notification, setNotication] = useState<any>([]);

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  useDidShow(async () => {
    if (getGlobalData("USERINFO")) {
      const { data }: any = await getNotification(
        getGlobalData("USERINFO").uid
      );
      setNotication(data);
    }
  });

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
                {notification.length > 0 ? (
                  <View>
                    {notification.map((item: any) => (
                      <EventCard item={item} />
                    ))}
                  </View>
                ) : (
                  <View className="empty">还没有收到通知</View>
                )}
              </View>
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    </View>
  );
};

export default Message;
