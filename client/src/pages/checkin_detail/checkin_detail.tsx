import { Image } from "@taroify/core";
import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useState } from "react";
import { AtList, AtListItem } from "taro-ui";
import { formatTime } from "../../utils";
import getLocation from "../../utils/getLocation";
import LocationItem from "./locationItem";

const CheckinDetail = () => {
  const [params, setParams] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [checkinList, setCheckinList] = useState([]);
  const [unCheckinList, setUnCheckinList] = useState([]);

  const loadDetail = (_id, cid) => {
    setIsLoading(true);
    Taro.cloud
      .callFunction({
        name: "get_checkin_detail",
        data: {
          _id,
          cid
        }
      })
      .then(({ result: { statusCode, detail, extra, message } }: any) => {
        console.log({ statusCode, detail, message, extra });
        if (statusCode === 200) {
          setCheckinList(detail);
          setUnCheckinList(extra);
          Taro.hideLoading();
        }
      })
      .catch(err => {
        console.log(err);
        Taro.hideLoading();
        Taro.showToast({
          title: "签到信息请求失败",
          icon: "none",
          duration: 1500
        });
      });
  };

  useReady(() => {
    let { checkin_id, cid } = getCurrentInstance().router.params;
    setParams({ checkin_id, cid });

    loadDetail(checkin_id, cid);
  });

  return (
    <View className="checkin_detail">
      <AtList>
        {checkinList.map(item => {
          const { createTime, user, content } = item;
          const { avatarUrl, nickName, realName } = user;
          const isGps = typeof content === "object";

          return (
            <View
              style={{
                padding: "32rpx",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderColor: "#e6e6e6"
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Image
                  style={{ width: "60rpx", height: "60rpx" }}
                  mode="scaleToFill"
                  src={avatarUrl}
                />
                <Text style={{ flex: 1, marginLeft: "32rpx" }}>
                  {realName ? `${realName} (${nickName})` : nickName}
                </Text>
                <Text style={{ color: "#999" }}>
                  {formatTime(new Date(createTime))}
                </Text>
              </View>
              {content && (
                <View style={{ marginTop: "32rpx" }}>
                  {isGps ? <LocationItem content={content} /> : content}
                </View>
              )}
            </View>
          );
        })}
      </AtList>

      {unCheckinList.length > 0 && (
        <>
          <View style={{ padding: 16 }}>未签到</View>
          <AtList className="checkin_detail">
            {unCheckinList.map(item => {
              const { realName, avatarUrl } = item;

              return (
                <View
                  style={{
                    padding: "32rpx",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderColor: "#e6e6e6"
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Image
                      style={{ width: "60rpx", height: "60rpx" }}
                      mode="scaleToFill"
                      src={avatarUrl}
                    />
                    <Text style={{ flex: 1, marginLeft: "32rpx" }}>
                      {realName}
                    </Text>
                  </View>
                </View>
              );
            })}
          </AtList>
        </>
      )}
    </View>
  );
};

export default CheckinDetail;
