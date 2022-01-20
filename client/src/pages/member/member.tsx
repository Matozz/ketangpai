import { Picker, Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useState } from "react";
import { AtButton, AtIcon, AtList, AtListItem } from "taro-ui";
import getClasses from "../../db/classes";

import "./member.scss";

declare let wx: any;

const Member = () => {
  const [params, setParams] = useState<any>({});
  const [teacher, setTeacher] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [classList, setClassList] = useState([]);

  const loadMembers = (cid: string, premium: string) => {
    Taro.showLoading({ title: "加载中" });
    Taro.cloud
      .callFunction({
        name: "get_member",
        data: {
          cid,
          premium
        }
      })
      .then(({ result: { statusCode, teacher, studentList } }: any) => {
        console.log({ statusCode, teacher, studentList });
        if (statusCode === 200) {
          setTeacher(teacher);
          setStudentList(studentList);
          Taro.hideLoading();
        }
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
        Taro.showToast({
          title: "成员信息请求失败",
          icon: "none",
          duration: 1500
        });
      });
  };

  const loadClasses = async () => {
    getClasses().then(classes => {
      setClassList(classes);
    });
  };

  useReady(() => {
    let { cid, type, premium } = getCurrentInstance().router.params;
    setParams({ cid, type, premium });
    loadMembers(cid, premium);
    loadClasses();
  });

  const handleJoinCourse = (type: string, studentList?: string[]) => (e?) => {
    Taro.showLoading({ title: "添加中" });
    Taro.cloud
      .callFunction({
        name: "join_course",
        data: {
          method: type,
          info: {
            cid: params.cid,
            uid: e?.content,
            uidList: studentList,
            teacher_uid: teacher[0].user.uid
          }
        }
      })
      .then(({ result: { statusCode, message } }: any) => {
        console.log({ statusCode, message });
        Taro.hideLoading();

        if (statusCode == 200) {
          Taro.showToast({
            title: message,
            icon: "success",
            duration: 1500
          });
          loadMembers(params.cid, params.premium);
        } else if (statusCode == 403) {
          Taro.showToast({
            title: message,
            icon: "none",
            duration: 1500
          });
        }
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
      });
  };

  const handlePickerChange = e => {
    Taro.showLoading({ title: "加载中" });

    const { name, students } = classList[e.detail.value];

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showModal({
        title: `导入${name}学生名单`,
        content: `该班级共有${students.length}名学生`,
        success: res => {
          if (res.confirm) {
            handleJoinCourse("byGroup", students)();
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
          handleJoinCourse("byUid")(res);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };

  return (
    <View className="member">
      {params.type == 1 && params.premium == 1 && (
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

      <Text className="title">教师</Text>
      {teacher.map(({ user }) => (
        <AtList>
          <AtListItem
            title={user?.realName ?? user.nickName}
            extraText={user.uid}
          />
        </AtList>
      ))}

      <Text className="title">学生</Text>
      {studentList.map(({ user }) => (
        <AtList>
          <AtListItem
            title={user?.realName ?? user.nickName}
            extraText={user?.uid}
          />
        </AtList>
      ))}
    </View>
  );
};

export default Member;
