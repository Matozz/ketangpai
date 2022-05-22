import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import React, { useCallback, useEffect, useState } from "react";
import { AtButton, AtCard, AtTabs, AtTabsPane } from "taro-ui";
import { getGlobalData } from "../../data/global";
import { getMessage } from "../../db/message";
import { getNotification } from "../../db/notification";
import { formatTime } from "../../utils";
import EventCard from "./card";

import "./message.scss";

const tabList = [{ title: "通知" }, { title: "留言" }];

const Message = () => {
  const [current, setCurrent] = useState(0);
  const [notification, setNotication] = useState<any>([]);
  const [message, setMessage] = useState<any>([]);

  const handleTabClick = useCallback(value => setCurrent(value), [current]);

  useDidShow(async () => {
    if (getGlobalData("USERINFO")) {
      Taro.showNavigationBarLoading();
      (async () => {
        const { data }: any = await getNotification(
          getGlobalData("USERINFO").uid
        );
        setNotication(data);
      })();

      (async () => {
        const {
          result: { statusCode, message, messageList }
        }: any = await Taro.cloud.callFunction({
          name: "get_message",
          data: {
            uid: getGlobalData("USERINFO").uid
          }
        });

        setMessage(messageList);
      })();

      Taro.hideNavigationBarLoading();
    }
  });

  const handleCardClick = (event_type, event_id, cid) => {
    Taro.navigateTo({
      url: `/pages/course_${event_type}/course_${event_type}?_id=${event_id}&cid=${cid}&viewType=${1}&premium=${1}`
    });
  };

  return (
    <View className="message">
      <View className="tabs">
        <AtTabs
          current={current}
          tabList={tabList}
          onClick={handleTabClick.bind(this)}
        >
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
          <AtTabsPane current={current} index={1}>
            <View className="tab">
              {message.length > 0 ? (
                <View>
                  {message.map((item: any) => (
                    <AtCard
                      note={formatTime(new Date(item.createTime))}
                      extra={item.class.name}
                      title={"评论留言提醒"}
                      onClick={() =>
                        handleCardClick(item.type, item.event_id, item.cid)
                      }
                    >
                      <View>{item.title + " - " + item.content}</View>
                      <View>发送人：{item.user}</View>
                    </AtCard>
                  ))}
                </View>
              ) : (
                <View className="empty">还没有收到通知</View>
              )}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    </View>
  );
};

export default Message;
