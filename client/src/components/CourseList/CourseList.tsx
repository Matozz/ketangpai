import { ScrollView, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { AtDivider } from "taro-ui";
import { CourseCard } from "..";
import { getContainerHeight } from "../../utils";

import "./CourseList.scss";

const CourseList = () => {
  const [height, setHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      getContainerHeight().then(res => setHeight(res));
    }, 100);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    console.log("Refreshing");

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
      <CourseCard />
      <CourseCard />
      <CourseCard />
      <CourseCard />
      <CourseCard />
      <AtDivider
        height={150}
        content="没有更多了"
        fontColor="#6190E8"
        lineColor="#6190E8"
      />
    </ScrollView>
  );
};

export default CourseList;
