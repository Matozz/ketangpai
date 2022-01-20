import { ScrollView, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { AtCard, AtDivider, AtTimeline } from "taro-ui";
import { CourseCard } from "..";
import course from "../../pages/course/course";
import { getContainerHeight } from "../../utils";
import DetailCard from "../DetailCard/DetailCard";

import "./CourseList.scss";

const CourseList = ({
  cardType = "course",
  items = [],
  onRefresh
}: {
  cardType?: "course" | "detail";
  items?: any;
  onRefresh?: () => Promise<unknown>;
}) => {
  const [height, setHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      getContainerHeight().then(res => setHeight(res));
      clearTimeout(timer);
    }, 100);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    if (cardType == "course") {
      await onRefresh();
      setRefreshing(false);
    } else {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };

  return (
    <ScrollView
      className="scrollview"
      scrollY
      enableBackToTop
      enableFlex
      refresherEnabled
      scrollWithAnimation
      style={{ height: height }}
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
    >
      {cardType == "course" &&
        items.map(({ cid, type, user, class: _class }, index) => (
          <CourseCard
            name={_class.name}
            desc={_class.desc}
            teacher={user?.realName ?? user.nickName}
            premium={_class.premium}
            avatarUrl={user.avatarUrl}
            cid={cid}
            type={type}
            options
          />
        ))}
      {cardType == "detail" &&
        items.map(({ title, extra, note, type, content }) => (
          <DetailCard
            title={title}
            extra={extra}
            note={note}
            type={type}
            content={content}
          />
        ))}
      <View style="height:150rpx"></View>
      {/* <AtDivider
        height={150}
        content="没有更多了"
        fontColor="#777777"
        lineColor="#d6e4ef"
      /> */}
    </ScrollView>
  );
};

export default CourseList;
