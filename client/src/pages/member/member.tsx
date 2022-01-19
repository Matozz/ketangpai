import { Picker, Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useCallback, useState } from "react";
import {
  AtButton,
  AtIcon,
  AtList,
  AtListItem,
  AtTabs,
  AtTabsPane
} from "taro-ui";

import "./member.scss";

declare let wx: any;

const Member = () => {
  const [params, setParams] = useState<any>({});
  const [classList, setClassList] = useState([
    { name: "18信计", classid: "5b049cc861e7dd960706ded42845f3f3" }
  ]);

  useReady(() => {
    let { cid, type, premium } = getCurrentInstance().router.params;
    setParams({ cid, type, premium });
  });

  const handlePickerChange = e => {
    Taro.showLoading({ title: "加载中" });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showModal({
        title: `导入${classList[e.detail.value].name}学生名单`,
        content: "该班级共有1名学生",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }, 1000);
  };

  const handleAddStudent = () => {
    // Wechat miniprogram scope!!!
    wx.showModal({
      title: "添加学生",
      editable: true,
      placeholderText: "请输入学生学号",
      confirmText: "添加",
      success: res => {
        if (res.confirm) {
          console.log("用户点击确定");
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };

  return (
    <View className="member">
      {params.type && params.premium && (
        <View className="header">
          <Picker
            mode="selector"
            rangeKey="name"
            range={classList}
            onChange={handlePickerChange}
            className="left_btn"
          >
            <AtButton type="secondary" size="small">
              <AtIcon value="download-cloud" size="20" color="#6190E8"></AtIcon>
              导入班级学生
            </AtButton>
          </Picker>
          <View className="right_btn">
            <AtButton type="secondary" size="small" onClick={handleAddStudent}>
              <AtIcon value="add-circle" size="20" color="#6190E8"></AtIcon>
              手动添加学生
            </AtButton>
          </View>
        </View>
      )}

      {[1, 2, 3].map(() => (
        <AtList>
          <AtListItem title="学生" />
        </AtList>
      ))}
    </View>
  );
};

export default Member;
