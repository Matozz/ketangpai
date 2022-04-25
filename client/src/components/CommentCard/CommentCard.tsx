import React from "react";
import { AtCard } from "taro-ui";
import { formatTime } from "../../utils";

import "./CommentCard.scss";

const CommentCard = ({ title, content, user, createTime }) => {
  return (
    <AtCard note={formatTime(new Date(createTime))} extra={user} title={title}>
      {content}
    </AtCard>
  );
};

export default CommentCard;
