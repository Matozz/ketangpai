import { Textarea } from "@taroify/core";
import { Image, Input, Map, Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useEffect, useMemo, useState } from "react";
import {
  AtActivityIndicator,
  AtButton,
  AtDivider,
  AtFab,
  AtTag
} from "taro-ui";
import { CommentList } from "../../components";
import { getGlobalData } from "../../data/global";
import {
  getStudentCheckin,
  setCheckinFinish,
  setCheckinProps
} from "../../db/checkin";
import { useInterval, useTimeout } from "../../hooks";
import {
  countdownTime,
  formatTime,
  getDistance,
  getRandomNumber
} from "../../utils";

import "./course_checkin.scss";

declare let wx: any;

const CHECKIN_TYPE = {
  number: "数字",
  qrcode: "二维码",
  gps: "GPS",
  quiz: "题目"
};

const UPDATE_TIME = 60 * 1000;

let timer;

const CourseCheckin = () => {
  const [params, setParams] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isCheckedin, setIsCheckedin] = useState(false);
  const [checkinDetail, setCheckinDetail] = useState<any>({});
  const [checkinStatus, setCheckinStatus] = useState({
    checked: "-",
    total: "-"
  });
  const [qrcode, setQRCode] = useState({ data: "", timestamp: 0 });
  const [number, setNumber] = useState("0000");
  const [quiz, setQuiz] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [textareaInputValue, setTextAreaValue] = useState("");
  const [circle, setCircle] = useState([
    {
      latitude: 24.624168,
      longitude: 118.087555,
      color: "#5383eb",
      fillColor: "#7cb5ec88",
      radius: 150,
      strokeWidth: 2
    }
  ]);

  // Cleanup function if checkinType is qrcode
  useEffect(() => {
    if (checkinDetail.checkinType == "qrcode" && params.viewType == 1) {
      return () => clearInterval(timer);
    }
  }, [checkinDetail.checkinType, params.viewType]);

  /**
   * 计算显示在页面上的考勤截止时间
   */
  const ddl = useMemo(() => formatTime(new Date(checkinDetail.finishTime)), [
    checkinDetail.finishTime
  ]);

  /**
   * 计算显示在页面上的考勤创建时间
   */
  const createTime = useMemo(
    () => formatTime(new Date(checkinDetail.createTime)),
    [checkinDetail.createTime]
  );

  /**
   * 处理考勤倒计时
   */
  const handleCountDown = (delay: number) => {
    if (delay > 360060000) {
      console.log("截止日期过长，实时倒计时器不会被启用！！！");
      return;
    }
    let countdown = setTimeout(() => {
      setIsFinished(true);
      clearTimeout(countdown);
    }, delay);
  };

  /**
   * 加载考勤信息，包括考勤标题，当前签到人数和考勤方式等等
   */
  const loadDetail = (_id: string, cid: string, premium: string, viewType) => {
    setIsLoading(true);
    Taro.cloud
      .callFunction({
        name: "get_checkin",
        data: {
          _id,
          cid,
          premium
        }
      })
      .then(({ result: { statusCode, detail, status } }: any) => {
        if (statusCode == 200) {
          setCheckinStatus(status);
          setCheckinDetail(detail);

          handleCountDown(countdownTime(detail.finishTime).milliseconds);

          const { content, checkinType } = detail;
          if (checkinType == "number") {
            setNumber(content);
          } else if (checkinType == "quiz") {
            setQuiz(content);
          } else if (checkinType == "qrcode") {
            setQRCode({ timestamp: Date.now() + UPDATE_TIME, data: content });
            if (viewType == "1") {
              timer = setInterval(() => {
                console.log("Update Code!");
                setQRCode({ ...qrcode, timestamp: Date.now() + UPDATE_TIME });
              }, UPDATE_TIME);
            }
          } else {
            setCircle([
              {
                ...circle[0],
                latitude: content.latitude,
                longitude: content.longitude,
                radius: content.range
              }
            ]);
          }
          setIsLoading(false);
        } else {
          Taro.showToast({
            title: "加载失败",
            icon: "none",
            duration: 1500
          });
          Taro.hideLoading();
        }
      });

    setTimeout(() => {
      Taro.hideLoading();
    }, 1000);
  };

  /**
   * 从服务器获取学生签到情况
   */
  const loadCheckin = (checkin_id, uid) => {
    getStudentCheckin(checkin_id, uid).then(({ data }) => {
      if (data.length > 0) {
        setIsCheckedin(true);
      }
    });
  };

  /**
   * 处理放弃考勤
   */
  const handleDropCheckin = checkin_id => {
    Taro.showLoading({ title: "加载中" });
    Taro.cloud
      .callFunction({
        name: "del_checkin",
        data: {
          checkin_id
        }
      })
      .then(({ result: { statusCode, message } }: any) => {
        if (statusCode == 200) {
          Taro.hideLoading();
          Taro.showToast({
            title: "操作成功",
            icon: "success",
            duration: 1500
          });
          const timer = setTimeout(() => {
            Taro.navigateBack({
              delta: 1
            });
            clearTimeout(timer);
          }, 1500);
        } else {
          Taro.hideLoading();
          Taro.showToast({
            title: message,
            icon: "none",
            duration: 1500
          });
        }
      });
  };

  /**
   * 处理点击悬浮按钮
   */
  const handleFabClick = () => {
    let items = ["考勤详情", "放弃考勤"];
    if (!isFinished) items.push("结束考勤");
    Taro.showActionSheet({
      itemList: items
    })
      .then(({ tapIndex }) => {
        if (tapIndex === 0) {
          Taro.navigateTo({
            url: `/pages/checkin_detail/checkin_detail?checkin_id=${params._id}`
          });
        } else if (tapIndex == 1) {
          wx.showModal({
            title: '该操作不可恢复，请在输入框输入"确定放弃考勤"',
            editable: true,
            placeholderText: "确定放弃本次考勤",
            confirmText: "确定",
            success: res => {
              if (res.confirm && res.content == "确定放弃本次考勤") {
                handleDropCheckin(params._id);
              } else if (res.cancel) {
                console.log("用户点击取消");
              } else {
                Taro.showToast({
                  title: "输入错误",
                  icon: "none",
                  duration: 1500
                });
              }
            }
          });
        } else if (tapIndex === 2) {
          setIsLoading(true);
          setCheckinFinish(params._id).then(() => {
            setIsFinished(true);
            setIsLoading(false);
          });
        }
      })
      .catch(err => {
        console.log(err.errMsg);
      });
  };

  /**
   * 处理教师切换GPS签到范围
   */
  const handleChangeRange = () => {
    wx.showModal({
      title: "更改范围",
      editable: true,
      placeholderText: "请输入新的签到范围",
      confirmText: "确认",
      success: ({ confirm, cancel, content }) => {
        if (confirm) {
          let range = parseInt(content);

          if (range < 20 || range > 500) {
            Taro.showModal({
              title: "更改范围失败",
              content: "请输入大于20小于500的数字",
              showCancel: false
            });
            return;
          }

          Taro.showLoading({ title: "更新中" });

          setCheckinProps(params._id, "gps", {
            ...circle[0],
            radius: range
          })
            .then(() => {
              setCircle([
                { ...circle[0], radius: range },
                ...circle.slice(1, circle.length)
              ]);
              Taro.hideLoading();
            })
            .catch(error => {
              Taro.showToast({
                title: "更改失败",
                icon: "none",
                duration: 1500
              });
              Taro.hideLoading();
            });
        } else if (cancel) {
          console.log("用户点击取消");
        }
      }
    });
  };

  /**
   * 处理教师切换/更新二维码
   */
  const handleChangeQRCode = () => {
    Taro.showNavigationBarLoading();
    setQRCode({ ...qrcode, timestamp: Date.now() + 60 * 1000 });
  };

  /**
   * 处理教师点击切换考勤码
   */
  const handleChangeNumber = () => {
    Taro.showNavigationBarLoading();
    setNumber("----");
    let number = getRandomNumber(4);
    setCheckinProps(params._id, "number", number)
      .then(() => {
        setNumber(number);
        Taro.hideNavigationBarLoading();
      })
      .catch(error => {
        Taro.showToast({
          title: "更改失败",
          icon: "none",
          duration: 1500
        });
        Taro.hideLoading();
      });
  };

  /**
   * 二维码加载成功回调
   */
  const handleQRCodeLoad = () => {
    Taro.hideNavigationBarLoading();
  };

  /**
   * 处理学生数字签到的输入事件
   */
  const handleChangeInput = e => {
    setInputValue(e.detail.value);
  };

  /**
   * 处理学生题目回答的输入事件
   */
  const handleTextAreaInput = e => {
    setTextAreaValue(e.detail.value);
  };

  /**
   * 打开扫描器进行扫码签到
   */
  const handleCheckinByCode = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: ["qrCode"],
      success: ({ result }) => {
        Taro.showLoading({ title: "签到中" });
        let data = result.split("||");
        if (data[0] === "matozz") {
          Taro.cloud
            .callFunction({
              name: "student_checkin",
              data: {
                type: "qrcode",
                checkin_id: params._id,
                uid: getGlobalData("USERINFO")?.uid,
                body: {
                  content: data[1],
                  expire: data[2]
                }
              }
            })
            .then(({ result: { statusCode, message } }: any) => {
              if (statusCode === 200) {
                setIsCheckedin(true);
              }

              Taro.hideLoading();
              Taro.showToast({
                title: message,
                icon: statusCode === 200 ? "success" : "none",
                duration: 1500
              });
            });
        } else {
          Taro.hideLoading();
          Taro.showToast({
            title: "无效考勤码",
            icon: "none",
            duration: 1500
          });
        }
      }
    }).catch(err => {
      console.log(err);
    });
  };

  /**
   * 获取GPS位置进行GPS签到
   */
  const handleCheckinByGPS = () => {
    const gpsCheckin = location => {
      Taro.showLoading({ title: "签到中" });
      Taro.cloud
        .callFunction({
          name: "student_checkin",
          data: {
            type: "gps",
            checkin_id: params._id,
            uid: getGlobalData("USERINFO")?.uid,
            body: {
              content: location
            }
          }
        })
        .then(({ result: { statusCode, message } }: any) => {
          if (statusCode === 200) {
            setIsCheckedin(true);
          }

          Taro.hideLoading();
          Taro.showToast({
            title: message,
            icon: statusCode === 200 ? "success" : "none",
            duration: 1500
          });
        });
    };
    Taro.getLocation({
      type: "gcj02"
    })
      .then(res => {
        const latitude = res.latitude;
        const longitude = res.longitude;

        let distance = getDistance(
          circle[0].latitude,
          circle[0].longitude,
          latitude,
          longitude
        );
        if (distance > circle[0].radius) {
          Taro.showModal({
            title: "确认签到",
            content: `您未在老师指定的签到范围（${circle[0].radius}m）内签到`,
            confirmText: "继续签到",
            success: function(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                gpsCheckin({ latitude, longitude });
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            }
          });
        } else {
          gpsCheckin({ latitude, longitude });
        }
      })
      .catch(err => {
        console.log(err);
        Taro.showModal({
          title: "无位置权限",
          content: `请开启地理位置授权以获取准确位置进行签到`,
          showCancel: false
        });
      });
  };

  /**
   * 获取输入内容进行数字签到
   */
  const handleCheckinByNumber = () => {
    Taro.cloud
      .callFunction({
        name: "student_checkin",
        data: {
          type: "number",
          checkin_id: params._id,
          uid: getGlobalData("USERINFO")?.uid,
          body: {
            content: inputValue
          }
        }
      })
      .then(({ result: { statusCode, message } }: any) => {
        if (statusCode === 200) {
          setIsCheckedin(true);
        }

        Taro.hideLoading();
        Taro.showToast({
          title: message,
          icon: statusCode === 200 ? "success" : "none",
          duration: 1500
        });
      });
  };

  /**
   * 获取输入内容进行数字签到
   */
  const handleCheckinByQuiz = () => {
    Taro.cloud
      .callFunction({
        name: "student_checkin",
        data: {
          type: "quiz",
          checkin_id: params._id,
          uid: getGlobalData("USERINFO")?.uid,
          body: {
            content: textareaInputValue
          }
        }
      })
      .then(({ result: { statusCode, message } }: any) => {
        if (statusCode === 200) {
          setIsCheckedin(true);
        }

        Taro.hideLoading();
        Taro.showToast({
          title: message,
          icon: statusCode === 200 ? "success" : "none",
          duration: 1500
        });
      });
  };

  useReady(() => {
    let { _id, cid, viewType, premium } = getCurrentInstance().router.params;
    setParams({ _id, cid, viewType, premium });

    loadDetail(_id, cid, premium, viewType);
    if (viewType == "0") {
      loadCheckin(_id, getGlobalData("USERINFO")?.uid);
    }
  });

  return (
    <View className="container">
      <View className={`top ${isLoading ? "hidden" : ""}`}>
        <View className="header">
          <View className="header-top">
            <Text className="title">{checkinDetail.title}</Text>
            {params.viewType == "1" && (
              <Text className="status">
                <Text className="checked">{checkinStatus.checked}</Text>/
                {checkinStatus.total}
              </Text>
            )}
          </View>
          <View className="tags">
            <AtTag size="small">{ddl}截止</AtTag>
            <AtTag size="small">
              {CHECKIN_TYPE[checkinDetail.checkinType]}考勤
            </AtTag>
          </View>
          <Text className="desc">{checkinDetail.extra}</Text>

          {isFinished ? (
            <View className="finish">考勤已结束</View>
          ) : (
            <>
              {isCheckedin ? (
                <View className="finish">已签到</View>
              ) : (
                <>
                  {checkinDetail.checkinType == "number" &&
                    (params.viewType == 1 ? (
                      <View className="checkin number">
                        <View className="title">学生通过以下数字完成签到</View>
                        <View className="change" onClick={handleChangeNumber}>
                          更换一个
                        </View>
                        <View className="num">{number}</View>
                      </View>
                    ) : (
                      <View className="checkin number student">
                        <View className="title">请输入考勤码</View>
                        <Input
                          className="num"
                          type="text"
                          value={inputValue}
                          onInput={handleChangeInput}
                        />
                        <AtButton
                          type="primary"
                          onClick={handleCheckinByNumber}
                        >
                          签到
                        </AtButton>
                      </View>
                    ))}

                  {checkinDetail.checkinType == "quiz" &&
                    (params.viewType == 1 ? (
                      <View className="checkin quiz">
                        <View className="title">学生通过回答问题完成签到</View>
                        {/* <View className="change" onClick={handleChangeNumber}>
                          更换题目
                        </View> */}
                        <View className="text">{quiz}</View>
                      </View>
                    ) : (
                      <View className="checkin quiz student">
                        <View>{quiz}</View>
                        <View className="title">请输入答案</View>
                        <Textarea
                          className="answer"
                          placeholder="请输入答案"
                          value={textareaInputValue}
                          onInput={handleTextAreaInput}
                        />
                        <AtButton
                          type="primary"
                          disabled={!textareaInputValue}
                          onClick={handleCheckinByQuiz}
                        >
                          签到
                        </AtButton>
                      </View>
                    ))}

                  {checkinDetail.checkinType == "gps" &&
                    (params.viewType == 1 ? (
                      <View className="checkin map">
                        <View className="title">学生通过GPS完成签到</View>
                        <View className="change" onClick={handleChangeRange}>
                          更改范围 ({circle[0].radius}米)
                        </View>
                        <Map
                          style="width: 90%; height: 480rpx;"
                          latitude={circle[0].latitude}
                          longitude={circle[0].longitude}
                          circles={circle}
                        ></Map>
                      </View>
                    ) : (
                      <View className="checkin map student">
                        <View className="title">开启GPS进行签到</View>
                        <Map
                          style="width: 90%; height: 480rpx; margin: 40rpx 0;"
                          latitude={circle[0].latitude}
                          longitude={circle[0].longitude}
                          circles={circle}
                        ></Map>
                        <AtButton type="primary" onClick={handleCheckinByGPS}>
                          签到
                        </AtButton>
                      </View>
                    ))}

                  {checkinDetail.checkinType == "qrcode" &&
                    (params.viewType == 1 ? (
                      <View className="checkin qrcode">
                        <View className="title">
                          学生通过扫描二维码完成签到
                        </View>
                        <View className="change" onClick={handleChangeQRCode}>
                          更换一个
                        </View>
                        <View>
                          <Image
                            className="code_img"
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=matozz||${qrcode.data}||${qrcode.timestamp}`}
                            onLoad={handleQRCodeLoad}
                            showMenuByLongpress
                          />
                        </View>
                        <AtTag size="small">二维码每分钟刷新一次</AtTag>
                      </View>
                    ) : (
                      <View className="checkin qrcode student">
                        <View className="title">点击扫码按钮进行签到</View>
                        <AtButton type="primary" onClick={handleCheckinByCode}>
                          扫码
                        </AtButton>
                      </View>
                    ))}
                </>
              )}
            </>
          )}
        </View>
        <AtDivider lineColor="#EEEEEE" height={30} />
        <Text className="create">创建于 {createTime}</Text>
      </View>

      {isLoading && (
        <View className="loading">
          <AtActivityIndicator size={50} mode="center"></AtActivityIndicator>
        </View>
      )}

      <CommentList />

      {params.viewType == 1 && (
        <View className="fab_btn">
          <AtFab onClick={handleFabClick}>
            <Text className="at-fab__icon at-icon at-icon-menu"></Text>
          </AtFab>
        </View>
      )}
    </View>
  );
};

export default CourseCheckin;
