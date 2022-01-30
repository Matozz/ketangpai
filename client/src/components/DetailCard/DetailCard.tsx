import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtButton, AtCard, AtCountdown, AtTimeline } from "taro-ui";
import { getGlobalData } from "../../data/global";
import { getStudentCheckin, setCheckinFinish } from "../../db/checkin";
import { DetailCardProps } from "../../types/type";
import { formatTime, countdownTime } from "../../utils";

import "./DetailCard.scss";

declare let wx: any;

const DetailCard = ({
  item: {
    _id,
    cid,
    title,
    extra,
    type,
    content,
    fileID,
    createTime,
    scheduleTime,
    finishTime
  },
  viewType,
  premium
}: DetailCardProps) => {
  const [scheduledNote, setScheduledNote] = useState("");
  const [isCheckedin, setIsCheckedin] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState(formatTime(new Date(scheduleTime)));
  const [isTimeOverflow, setIsTimeOverflow] = useState(false);
  const [countdown, setCountdown] = useState<{
    hours?: number;
    minutes?: number;
    seconds?: number;
  }>({});

  useEffect(() => {
    if (Date.now() < new Date(scheduleTime).getTime()) {
      setScheduledNote("计划开始时间 ");
    } else {
      setScheduledNote("已开始 ");
    }
    if (type === "checkin") {
      let countdown = countdownTime(finishTime);
      if (countdown.milliseconds > 360060000) {
        setIsTimeOverflow(true);
      }
      setCountdown(countdown.part);
      setIsFinished(countdown.isFinished);

      getStudentCheckin(_id, getGlobalData("USERINFO")?.uid).then(
        ({ data }) => {
          if (data.length > 0) {
            setIsCheckedin(true);
          }
          setIsLoading(false);
        }
      );
    }
  }, []);

  const handleCountDownTimeUp = () => {
    setIsFinished(true);
  };

  const handleCheckin = e => {};

  const handleStopCheckin = e => {
    e.stopPropagation();
    setIsLoading(true);

    // Database to change finishTime
    setCheckinFinish(_id).then(() => {
      setCountdown({
        hours: 0,
        minutes: 0,
        seconds: 0
      });
      setIsFinished(true);
      setIsLoading(false);
    });
  };

  const handleOpenFile = e => {
    e.stopPropagation();
    Taro.showLoading({ title: "文件加载中" });
    Taro.cloud.downloadFile({
      fileID,
      success: function(res) {
        const filePath = res.tempFilePath;
        Taro.openDocument({
          filePath: filePath,
          success: function(res) {
            console.log("打开文档成功");
            Taro.hideLoading();
          }
        });
      }
    });
  };

  const handleCardClick = () => {
    Taro.navigateTo({
      url: `/pages/course_${type}/course_${type}?_id=${_id}&cid=${cid}&viewType=${viewType}&premium=${premium}`
    });
  };

  return (
    <AtCard
      note={(viewType == 1 ? scheduledNote : "") + note}
      extra={extra}
      title={title}
      onClick={handleCardClick}
    >
      {type === "detail" && <AtTimeline items={content}></AtTimeline>}

      {type === "file" && (
        <View>
          <Text>{content}</Text>
          <AtButton
            type="secondary"
            size="small"
            className="button"
            onClick={handleOpenFile}
          >
            查看
          </AtButton>
        </View>
      )}

      {type === "checkin" && (
        <View>
          <View className="checkin_box">
            {isTimeOverflow ? (
              <Text>考勤结束时间：{formatTime(new Date(finishTime))}</Text>
            ) : (
              <>
                <Text className="checkin_title">距离考勤结束还有：</Text>
                <AtCountdown
                  isCard
                  format={{ hours: ":", minutes: ":", seconds: "" }}
                  hours={countdown.hours}
                  minutes={countdown.minutes}
                  seconds={countdown.seconds}
                  onTimeUp={handleCountDownTimeUp}
                />
              </>
            )}
          </View>

          {viewType == 0 ? (
            <AtButton
              type="secondary"
              size="small"
              className="button"
              onClick={handleCheckin}
              loading={isLoading}
              disabled={isCheckedin || isFinished}
            >
              {isLoading
                ? "加载中"
                : isFinished
                ? "考勤已结束"
                : isCheckedin
                ? "已签到"
                : "去签到"}
            </AtButton>
          ) : (
            <AtButton
              type="secondary"
              size="small"
              className="button"
              onClick={handleStopCheckin}
              loading={isLoading}
              disabled={isFinished}
            >
              {isLoading ? "加载中" : isFinished ? "考勤已结束" : "结束考勤"}
            </AtButton>
          )}
        </View>
      )}

      {type === "notice" && <Text>{content}</Text>}
    </AtCard>
  );
};

export default DetailCard;
