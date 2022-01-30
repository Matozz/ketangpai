import { ScrollView, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { AtCard, AtDivider, AtTimeline } from "taro-ui";
import { CourseCard, DetailCard } from "..";
import course from "../../pages/course/course";
import { getContainerHeight } from "../../utils";

import "./CourseList.scss";

const CourseList = ({
  cardType = "course",
  items = [],
  premium,
  type,
  onRefresh
}: {
  cardType?: "course" | "detail";
  items?: any;
  premium?: number;
  type?: 0 | 1;
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

    await onRefresh();
    setRefreshing(false);
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
            key={cid}
          />
        ))}
      {cardType == "detail" &&
        items.map(item => (
          <DetailCard
            item={item}
            viewType={type}
            premium={premium}
            key={item._id}
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
