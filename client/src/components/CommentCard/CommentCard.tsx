import React from "react";
import { AtCard } from "taro-ui";

import "./CommentCard.scss";

const CommentCard = () => {
  return (
    <AtCard note={"2022-01-26 12:30:07"} extra={"詹姆斯"} title={"这是评论"}>
      哈哈哈哈哈哈哈哈哈😂
    </AtCard>
  );
};

export default CommentCard;
