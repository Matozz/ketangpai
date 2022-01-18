import { ScrollView, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { AtDivider } from "taro-ui";
import { CourseCard } from "..";
import course from "../../pages/course/course";
import { getContainerHeight } from "../../utils";

import "./CourseList.scss";

const CourseList = ({
  items,
  onRefresh
}: {
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
      {items.map(({ cid, type, user, class: _class }, index) => (
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
      {/* <AtDivider
        height={150}
        content="没有更多了"
        fontColor="#6190E8"
        lineColor="#6190E8"
      /> */}
    </ScrollView>
  );
};

export default CourseList;
