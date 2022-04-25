import { Button, Cell, Form, Input, Textarea } from "@taroify/core";
import { BaseEventOrig, FormProps, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useMemo, useState } from "react";
import { getGlobalData } from "../../data/global";
import { createComment } from "../../db/comment";

const Comment = () => {
  const [params, setParams] = useState<any>({});
  const onSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    Taro.showLoading({ title: "提交中" });
    createComment(
      params.event_id,
      params.event_type,
      getGlobalData("USERINFO")?.realName ??
        getGlobalData("USERINFO")?.nickName,
      event.detail.value as any
    )
      .then(() => {
        Taro.hideLoading();
        Taro.showToast({ title: "发布成功", icon: "success" });
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      })
      .catch(err => Taro.hideLoading());
  };

  const rules = useMemo(
    () => ({
      required: [{ required: true, message: "必填项" }]
    }),
    []
  );

  useReady(() => {
    let { event_type, event_id } = getCurrentInstance().router.params;
    setParams({ event_type, event_id });
  });

  return (
    <View style={{ paddingTop: 16 }}>
      <Form onSubmit={onSubmit}>
        <Cell.Group inset>
          <Form.Item name="title" rules={rules.required}>
            <Form.Label>评论标题</Form.Label>
            <Form.Control>
              <Input placeholder="请输入标题" />
            </Form.Control>
          </Form.Item>
          <Form.Item name="content" rules={rules.required}>
            <Form.Label>评论内容</Form.Label>
            <Form.Control>
              <Textarea placeholder="请输入评论内容" />
            </Form.Control>
          </Form.Item>
        </Cell.Group>
        <View style={{ margin: "16px" }}>
          <Button shape="round" block color="primary" formType="submit">
            提交
          </Button>
        </View>
      </Form>
    </View>
  );
};

export default Comment;
