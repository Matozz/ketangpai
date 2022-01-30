import { Map, Picker, Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useMemo, useState } from "react";
import { AtButton, AtInput, AtList, AtListItem, AtSwitch } from "taro-ui";

import "./create_event.scss";

const EVENT_TYPE = {
  detail: "开始上课",
  checkin: "创建考勤",
  file: "上传课件",
  notice: "发布公告"
};

const CHECKIN_TYPE = [
  { id: "number", name: "数字考勤" },
  { id: "qrcode", name: "二维码考勤" },
  { id: "gps", name: "GPS考勤" }
];

const CreateEvent = () => {
  const [cid, setCid] = useState("");
  const [type, setType] = useState("");
  const [premium, setPremium] = useState("");
  const [checkinData, setCheckinData] = useState<any>({
    checkinType: CHECKIN_TYPE[0]
  });
  const [circle, setCircle] = useState([]);
  const [isImmediate, setIsImmediate] = useState(true);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useReady(() => {
    let { cid, type, premium } = getCurrentInstance().router.params;
    setCid(cid);
    setType(type);
    setPremium(premium);
    Taro.setNavigationBarTitle({ title: EVENT_TYPE[type] });
  });

  const isButtonDisabled = useMemo(() => {
    let { title, checkinType, content } = checkinData;
    if (!endDate || !endTime) return true;
    if (!isImmediate && (!scheduleDate || !scheduleTime)) return true;
    if (title && checkinType) {
      if (
        checkinType?.id == "qrcode" ||
        (checkinType?.id == "gps" && content?.latitude) ||
        (checkinType?.id == "number" && content)
      ) {
        return false;
      }
      return true;
    }
    return true;
  }, [
    checkinData.title,
    checkinData.checkinType?.id,
    checkinData.content,
    isImmediate,
    scheduleDate,
    scheduleTime,
    endDate,
    endTime
  ]);

  const handleImmediateToggle = value => {
    setIsImmediate(value);
  };

  const handleScheduleChange = mode => e => {
    if (mode == "time") setScheduleTime(e.detail.value);
    else setScheduleDate(e.detail.value);
  };

  const handleDeadLineChange = mode => e => {
    if (mode == "time") setEndTime(e.detail.value);
    else setEndDate(e.detail.value);
  };

  const handlePickerChange = e => {
    setCheckinData({
      checkinType: CHECKIN_TYPE[e.detail.value]
    });
  };

  const handleCheckinTitleChange = value => {
    setCheckinData({ ...checkinData, title: value });
  };

  const handleCheckinDescChange = value => {
    setCheckinData({ ...checkinData, desc: value });
  };

  const handleCheckinContentChange = value => {
    setCheckinData({ ...checkinData, content: value });
  };

  const handleCheckinRangeChange = value => {
    setCheckinData({
      ...checkinData,
      content: { ...checkinData.content, range: parseInt(value) }
    });
    if (checkinData.content?.longitude) {
      setCircle([{ ...circle[0], radius: parseInt(value) }]);
    }
  };

  const handleGetLocation = () => {
    Taro.showLoading({ title: "位置获取中" });
    Taro.getLocation({
      type: "gcj02"
    }).then(res => {
      const latitude = res.latitude;
      const longitude = res.longitude;

      setCheckinData({
        ...checkinData,
        content: { range: 160, longitude, latitude }
      });
      setCircle([
        {
          latitude,
          longitude,
          color: "#5383eb",
          fillColor: "#7cb5ec88",
          radius: 160,
          strokeWidth: 2
        }
      ]);
      Taro.hideLoading();
    });
  };

  const handleCreateEvent = event => () => {
    Taro.showLoading({ title: "创建中" });
    const { checkinType, title, desc, content } = checkinData;
    Taro.cloud
      .callFunction({
        name: "create_checkin",
        data: {
          checkinType: checkinType.id,
          cid,
          title,
          desc,
          content,
          isImmediate,
          schedule: `${scheduleDate} ${scheduleTime} GMT+8`,
          finish: `${endDate} ${endTime} GMT+8`
        }
      })
      .then(({ result: { statusCode, message, checkin_id } }: any) => {
        if (statusCode === 200) {
          Taro.hideLoading();
          Taro.showToast({
            title: "创建成功",
            icon: "success",
            duration: 1500
          });
          const timer = setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/course_checkin/course_checkin?_id=${checkin_id}&cid=${cid}&viewType=1&premium=${premium}`
            });
            clearTimeout(timer);
          }, 1500);
        } else {
          Taro.showModal({
            title: "创建失败",
            content: message,
            showCancel: false
          });
          Taro.hideLoading();
        }
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
        Taro.showToast({
          title: "服务器开小差了",
          icon: "none",
          duration: 1500
        });
      });
  };

  return (
    <View className="create_event">
      {type === "detail" && <View>创建课程</View>}
      {type === "checkin" && (
        <View>
          <Picker
            mode="selector"
            range={CHECKIN_TYPE}
            rangeKey="name"
            onChange={handlePickerChange}
          >
            <AtList>
              <AtListItem
                title="考勤方式"
                className={checkinData?.checkinType ? "" : "item-placeholder"}
                extraText={
                  checkinData?.checkinType
                    ? checkinData.checkinType.name
                    : "请选择考勤方式"
                }
              />
            </AtList>
          </Picker>
          <AtInput
            name="title"
            title="名称"
            type="text"
            placeholder="请输入考勤名称"
            value={checkinData.title}
            placeholderStyle="color:#cecece"
            onChange={handleCheckinTitleChange}
          />
          <AtInput
            name="desc"
            title="描述"
            type="text"
            placeholder="请输入考勤描述"
            value={checkinData.desc}
            placeholderStyle="color:#cecece"
            onChange={handleCheckinDescChange}
          />
          {checkinData?.checkinType?.id == "number" && (
            <AtInput
              name="content"
              title="签到码"
              type="number"
              placeholder="请输入4位数签到码"
              value={checkinData.content}
              placeholderStyle="color:#cecece"
              onChange={handleCheckinContentChange}
            />
          )}
          {checkinData?.checkinType?.id == "gps" && (
            <>
              <AtInput
                name="range"
                title="签到范围"
                type="number"
                placeholder="请输入签到范围（米）"
                value={checkinData.content?.range}
                placeholderStyle="color:#cecece"
                onChange={handleCheckinRangeChange}
              />
              <View className="map_container">
                <Map
                  style="width: 100%; height: 480rpx;"
                  latitude={checkinData?.content?.latitude ?? 0}
                  longitude={checkinData?.content?.longitude ?? 0}
                  circles={circle}
                  enableScroll={!!checkinData?.content?.latitude}
                ></Map>
                {!checkinData.content?.latitude && (
                  <View className="map_cover">
                    <AtButton type="primary" onClick={handleGetLocation}>
                      获取位置
                    </AtButton>
                  </View>
                )}
              </View>
            </>
          )}
          <AtSwitch
            title="立即发布"
            checked={isImmediate}
            onChange={handleImmediateToggle}
          />
          {!isImmediate && (
            <>
              <Picker
                mode="date"
                value="YYYY-MM-DD"
                onChange={handleScheduleChange("date")}
              >
                <AtList>
                  <AtListItem
                    title="计划日期"
                    className={scheduleDate ? "" : "item-placeholder"}
                    extraText={
                      scheduleDate ? scheduleDate : "请选择计划发布日期"
                    }
                  />
                </AtList>
              </Picker>
              <Picker
                mode="time"
                value="hh:mm"
                onChange={handleScheduleChange("time")}
              >
                <AtList>
                  <AtListItem
                    title="计划时间"
                    className={scheduleTime ? "" : "item-placeholder"}
                    extraText={
                      scheduleTime ? scheduleTime : "请选择计划发布时间"
                    }
                  />
                </AtList>
              </Picker>
            </>
          )}
          <Picker
            mode="date"
            value="YYYY-MM-DD"
            onChange={handleDeadLineChange("date")}
          >
            <AtList>
              <AtListItem
                title="截止日期"
                className={endDate ? "" : "item-placeholder"}
                extraText={endDate ? endDate : "请选择截止日期"}
              />
            </AtList>
          </Picker>
          <Picker
            mode="time"
            value="hh:mm"
            onChange={handleDeadLineChange("time")}
          >
            <AtList>
              <AtListItem
                title="截止时间"
                className={endTime ? "" : "item-placeholder"}
                extraText={endTime ? endTime : "请选择截止时间"}
              />
            </AtList>
          </Picker>
          <AtButton
            disabled={isButtonDisabled}
            className="submit_btn"
            type="primary"
            onClick={handleCreateEvent("checkin")}
          >
            创建
          </AtButton>
        </View>
      )}
      {type === "file" && <View></View>}

      {type === "notice" && <View></View>}
    </View>
  );
};

export default CreateEvent;
