import { Button, Cell, Form, Input, Textarea, Toast } from "@taroify/core";
import { BaseEventOrig, FormProps, View } from "@tarojs/components";
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro";
import React, { useMemo, useRef, useState } from "react";
import { formatBytes } from "../../utils";

const FileForm = ({ onSubmit }) => {
  const formRef = useRef<any>();
  const [fileTemp, setFileTemp] = useState<any>();
  const handleSubmit = (
    event: BaseEventOrig<FormProps.onSubmitEventDetail>
  ) => {
    const formValue = event.detail.value;

    if (!fileTemp) {
      Taro.showToast({
        title: "请选择文件",
        icon: "error"
      });
      return;
    }

    onSubmit?.({ ...formValue, ...fileTemp });
  };

  const rules = useMemo(
    () => ({
      required: [{ required: true, message: "必填项" }]
    }),
    []
  );

  const onSelectFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: "file",
      extension: ["doc", "docx", "ppt", "pptx", "pdf", "xls", "xlsx", "txt"]
    }).then(res => {
      setFileTemp(res.tempFiles[0]);
      console.log(res);
    });
  };

  return (
    <View style={{ paddingTop: 16 }}>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Cell.Group inset>
          <Form.Item name="title" rules={rules.required}>
            <Form.Label>文件标题</Form.Label>
            <Form.Control>
              <Input placeholder="输入文件标题" />
            </Form.Control>
          </Form.Item>
          <Form.Item name="content" rules={rules.required}>
            <Form.Label>文件描述</Form.Label>
            <Form.Control>
              <Input placeholder="请输入文件描述" />
            </Form.Control>
          </Form.Item>
          <Form.Item name="content">
            <Form.Label>选择文件</Form.Label>
            <Form.Control>
              {!fileTemp ? (
                <Button
                  onClick={onSelectFile}
                  color="primary"
                  shape="circle"
                  size="small"
                  style={{ width: "30px" }}
                >
                  {`   +   `}
                </Button>
              ) : (
                <View>
                  <View>文件名：{fileTemp.name}</View>
                  <View>大小：{formatBytes(fileTemp.size)}</View>
                  <Button
                    onClick={() => {
                      setFileTemp(undefined);
                      onSelectFile();
                    }}
                    color="primary"
                    shape="circle"
                    size="small"
                  >
                    重选
                  </Button>
                </View>
              )}
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

export default FileForm;
