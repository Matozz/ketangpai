import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useMemo, useState } from "react";
import { AtActivityIndicator, AtDivider, AtFab, AtTimeline } from "taro-ui";
import { CommentList } from "../../components";
import { getCourseDetail } from "../../db/detail";
import { formatTime } from "../../utils";

import "./course_detail.scss";

const CourseDetail = () => {
  const [params, setParams] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetail, setCourseDetail] = useState<any>({});

  const createTime = useMemo(
    () => formatTime(new Date(courseDetail.createTime)),
    [courseDetail.createTime]
  );

  const loadDetail = (_id: string) => {
    getCourseDetail(_id).then(res => {
      setCourseDetail(res);
      setIsLoading(false);
    });
  };

  const handleFabClick = () => {
    let items = ["发表评论"];

    if (params.viewType == 1) {
      items = items.concat(["删除课程"]);
    }

    Taro.showActionSheet({
      itemList: items
    })
      .then(({ tapIndex }) => {
        console.log(tapIndex);
        if (tapIndex === 0) {
          Taro.navigateTo({
            url: `/pages/comment/comment?event_type=detail&event_id=${params._id}&cid=${params.cid}`
          });
        }
      })
      .catch(err => console.log(err));
  };

  useReady(() => {
    let { _id, viewType, cid } = getCurrentInstance().router.params;
    setParams({ _id, viewType, cid });

    loadDetail(_id);
  });

  return (
    <View className="container">
      <View className={`top ${isLoading ? "hidden" : ""}`}>
        <View className="header">
          <View className="header-top">
            <Text className="title">{courseDetail.title}</Text>
            <Text className="desc">{courseDetail.extra}</Text>
          </View>

          <AtTimeline items={courseDetail.content}></AtTimeline>
        </View>
        <AtDivider lineColor="#EEEEEE" height={30} />
        <Text className="create">创建于 {createTime}</Text>
      </View>

      {isLoading && (
        <View className="loading">
          <AtActivityIndicator size={50} mode="center"></AtActivityIndicator>
        </View>
      )}

      <CommentList event_type="detail" event_id={params._id} />

      <View className="fab_btn">
        <AtFab onClick={handleFabClick}>
          <Text className="at-fab__icon at-icon at-icon-menu"></Text>
        </AtFab>
      </View>
    </View>
  );
};

export default CourseDetail;
