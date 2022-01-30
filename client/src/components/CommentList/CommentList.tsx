import { Text, View } from "@tarojs/components";
import React from "react";
import { CommentCard } from "..";

import "./CommentList.scss";

const CommentList = () => {
  return (
    <View className="comments">
      <Text className="title">评论</Text>
      <CommentCard />
      <CommentCard />
      <CommentCard />
      <CommentCard />
      <CommentCard />
      <CommentCard />
    </View>
  );
};

export default CommentList;
