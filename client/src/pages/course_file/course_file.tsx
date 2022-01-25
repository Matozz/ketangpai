import { Text, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useState } from "react";

import "./course_file.scss";

const CourseFile = () => {
  const [params, setParams] = useState({});

  const loadDetail = (_id: string) => {
    Taro.showNavigationBarLoading();

    setTimeout(() => {
      Taro.hideNavigationBarLoading();
    }, 1000);
  };

  useReady(() => {
    let { _id, viewType } = getCurrentInstance().router.params;
    setParams({ _id, viewType });

    loadDetail(_id);
  });

  return <View className="container"></View>;
};

export default CourseFile;
