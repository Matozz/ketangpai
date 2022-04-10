import { Map, Picker, Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useMemo, useState } from "react";
import { AtButton, AtInput, AtList, AtListItem, AtSwitch } from "taro-ui";
import CheckinForm from "../../components/CheckinForm/CheckinForm";
import CreateCourse from "../../components/CreateCourse/CreateCourse";

import "./create_event.scss";

const EVENT_TYPE = {
  detail: "开始上课",
  checkin: "创建考勤",
  file: "上传课件",
  notice: "发布公告"
};

const CreateEvent = () => {
  const [cid, setCid] = useState("");
  const [type, setType] = useState("");
  const [premium, setPremium] = useState("");

  useReady(() => {
    let { cid, type, premium } = getCurrentInstance().router.params;
    setCid(cid);
    setType(type);
    setPremium(premium);
    Taro.setNavigationBarTitle({ title: EVENT_TYPE[type] });
  });

  const handleCreateCheckin = (values: any) => {
    Taro.showLoading({ title: "创建中" });
    const { checkinType, title, desc, content, startTime, finishTime } = values;
    Taro.cloud
      .callFunction({
        name: "create_checkin",
        data: {
          checkinType,
          cid,
          title,
          desc,
          content,
          schedule: startTime,
          finish: finishTime
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

  const handleCreateCourse = (values: any) => {
    Taro.showLoading({ title: "创建中" });
    const { info, checkin } = values;
    Taro.cloud
      .callFunction({
        name: "create_course_detail",
        data: {
          cid,
          info,
          checkin
        }
      })
      .then(({ result: { statusCode, message, detail_id } }: any) => {
        if (statusCode === 200) {
          Taro.hideLoading();
          Taro.showToast({
            title: "创建成功",
            icon: "success",
            duration: 1500
          });
          const timer = setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/course_detail/course_detail?_id=${detail_id}&viewType=1`
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
      {type === "detail" && <CreateCourse onSubmit={handleCreateCourse} />}
      {type === "checkin" && (
        <CheckinForm type="create" onSubmit={handleCreateCheckin} />
      )}
      {type === "file" && <View></View>}

      {type === "notice" && <View></View>}
    </View>
  );
};

export default CreateEvent;
