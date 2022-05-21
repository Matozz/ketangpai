import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtCard, AtCountdown } from "taro-ui";
import { countdownTime, formatTime } from "../../utils";

const eventMap = {
  checkin: {
    number: "数字考勤",
    qrcode: "二维码考勤",
    gps: "GPS考勤",
    quiz: "题目考勤"
  },
  detail: {
    _: "课程"
  }
};

const EventCard = ({ item }) => {
  const {
    event_id,
    event_type,
    event_info,
    createTime,
    class_name,
    cid
  } = item;
  const { checkinType, title, finishTime } = event_info;
  const [countdown, setCountdown] = useState<{
    hours?: number;
    minutes?: number;
    seconds?: number;
  }>({});

  useEffect(() => {
    console.log(finishTime);
    let countdown = countdownTime(finishTime);

    setCountdown(countdown.part);
  }, []);

  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/course_${event_type}/course_${event_type}?_id=${event_id}&cid=${cid}&viewType=${0}&premium=${1}`
    });
  };

  return (
    <AtCard
      note={formatTime(new Date(createTime))}
      extra={`${eventMap[event_type][checkinType ?? "_"]}提醒`}
      title={class_name}
      onClick={handleCardClick}
    >
      {event_type === "checkin" && (
        <>
          {eventMap[event_type][checkinType ?? "_"]}提醒 - {title + "\n"}
          <View style={{ margin: "8px 0" }}>
            <Text className="checkin_title">距离考勤结束还有：</Text>
            <AtCountdown
              isCard
              format={{ hours: ":", minutes: ":", seconds: "" }}
              hours={countdown.hours}
              minutes={countdown.minutes}
              seconds={countdown.seconds}
            />
          </View>
        </>
      )}
      {event_type === "detail" && (
        <>
          <View>你有新的上课提醒「{title}」，点击查看</View>
        </>
      )}
    </AtCard>
  );
};

export default EventCard;
