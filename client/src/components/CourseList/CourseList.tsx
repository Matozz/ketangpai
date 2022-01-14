import { ScrollView, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
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
      <View style={{ height: 40 }}></View>
    </ScrollView>
  );
};

export default CourseList;
