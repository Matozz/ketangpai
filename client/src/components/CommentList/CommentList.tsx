import { Text, View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { CommentCard } from "..";
import { getComments } from "../../db/comment";

import "./CommentList.scss";

const CommentList = ({ event_type, event_id }) => {
  const [comments, setComments] = useState([]);

  useDidShow(() => {
    getComments(event_id, event_type).then((res: any) =>
      setComments(res?.data ?? [])
    );
  });

  return (
    <View className="comments">
      <Text className="title">评论</Text>
      {comments.map((comment: any) => (
        <CommentCard {...comment} />
      ))}
    </View>
  );
};

export default CommentList;
