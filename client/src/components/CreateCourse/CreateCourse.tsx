import {
  Cell,
  Steps,
  Field,
  Input,
  Switch,
  Button,
  Popup,
  DatetimePicker,
  Picker
} from "@taroify/core";
import { View } from "@tarojs/components";
import React, { useRef, useState } from "react";
import { getGlobalData, setGlobalData } from "../../data/global";
import { getCurrentTime } from "../../utils";
import CheckinForm from "../CheckinForm/CheckinForm";
import DatePicker from "../DatePicker/DatePicker";
import DateTimeField from "../FormItem/DateTimeField/DateTimeField";

const CreateCourse = ({ onSubmit }) => {
  const [step, setStep] = useState(0);

  const [infoConfig, setInfoConfig] = useState<any>({ checkin: false });
  const [testConfig, setTestConfig] = useState<any>({});
  const [workConfig, setWorkConfig] = useState<any>({});

  const timeFormRef = useRef<any>();

  const handleSubmitTime = () => {
    const submit = (res?: any) => {
      setGlobalData("COURSE_INFO", { infoConfig });
      setGlobalData("COURSE_CHECKIN", [
        ...(getGlobalData("COURSE_CHECKIN") ?? []),
        res
      ]);
      setStep(step + 1);
    };
    timeFormRef.current?.validate()?.then(submit) ?? submit();
  };

  const handleSubmitTest = () => {
    setGlobalData("COURSE_INFO", {
      ...getGlobalData("COURSE_INFO"),
      testConfig: Object.keys(testConfig).length > 0 ? testConfig : undefined
    });
    setStep(step + 1);
  };

  const handleSubmitWork = () => {
    setGlobalData("COURSE_INFO", {
      ...getGlobalData("COURSE_INFO"),
      workConfig: Object.keys(workConfig).length > 0 ? workConfig : undefined
    });
    onSubmit({
      info: getGlobalData("COURSE_INFO"),
      checkin: getGlobalData("COURSE_CHECKIN")
    });
  };

  return (
    <>
      <Steps value={step}>
        <Steps.Step>课堂信息</Steps.Step>
        <Steps.Step>课堂小测</Steps.Step>
        <Steps.Step>作业</Steps.Step>
      </Steps>

      {step === 0 && (
        <View style={{ paddingTop: "32rpx" }}>
          <Cell.Group inset>
            <Field label="课堂名称">
              <Input
                placeholder="请输入课堂名称"
                value={infoConfig.title}
                onChange={e =>
                  setInfoConfig({ ...infoConfig, title: e.detail.value })
                }
              />
            </Field>
            <Field label="课堂描述">
              <Input
                placeholder="请输入课堂描述"
                value={infoConfig.desc}
                onChange={e =>
                  setInfoConfig({ ...infoConfig, desc: e.detail.value })
                }
              />
            </Field>
            <DatePicker
              label="上课时间"
              placeholder="选择上课时间"
              value={infoConfig.startTime}
              onChange={startTime =>
                setInfoConfig({ ...infoConfig, startTime })
              }
            />
            <DatePicker
              label="下课时间"
              placeholder="选择下课时间"
              value={infoConfig.finishTime}
              onChange={finishTime =>
                setInfoConfig({ ...infoConfig, finishTime })
              }
            />
            <Field label="开启考勤">
              <Switch
                size="20"
                disabled={!infoConfig.startTime || !infoConfig.finishTime}
                defaultChecked={infoConfig.checkin}
                onChange={checkin => setInfoConfig({ ...infoConfig, checkin })}
              />
            </Field>
          </Cell.Group>
          {infoConfig.checkin && (
            <CheckinForm
              type="course"
              valueRef={timeFormRef}
              courseConfig={infoConfig}
            />
          )}

          <View
            style={{
              margin: "0 32rpx",
              marginTop: !infoConfig.checkin ? "32rpx" : "0",
              marginBottom: "60rpx"
            }}
          >
            <Button
              disabled={
                !infoConfig.title ||
                !infoConfig.startTime ||
                !infoConfig.finishTime ||
                infoConfig.startTime > infoConfig.finishTime
              }
              block
              color="primary"
              onClick={handleSubmitTime}
            >
              下一步
            </Button>
          </View>
        </View>
      )}
      {step === 1 && (
        <View style={{ paddingTop: "32rpx" }}>
          <Cell.Group inset>
            <DatePicker
              label="开始时间"
              placeholder="选择开始时间"
              value={testConfig.startTime}
              onChange={startTime =>
                setTestConfig({ ...testConfig, startTime })
              }
            />
            <DatePicker
              label="截止时间"
              placeholder="选择截止时间"
              value={testConfig.finishTime}
              onChange={finishTime =>
                setTestConfig({ ...testConfig, finishTime })
              }
            />
          </Cell.Group>
          <View
            style={{
              margin: "0 32rpx",
              marginTop: "32rpx",
              marginBottom: "60rpx"
            }}
          >
            <Button
              disabled={testConfig.startTime > testConfig.finishTime}
              block
              color="primary"
              onClick={handleSubmitTest}
            >
              下一步
            </Button>
          </View>
        </View>
      )}
      {step === 2 && (
        <View style={{ paddingTop: "32rpx" }}>
          <Cell.Group inset>
            <DatePicker
              label="开始时间"
              placeholder="选择开始时间"
              value={workConfig.startTime}
              onChange={startTime =>
                setWorkConfig({ ...workConfig, startTime })
              }
            />
            <DatePicker
              label="截止时间"
              placeholder="选择截止时间"
              value={workConfig.finishTime}
              onChange={finishTime =>
                setWorkConfig({ ...workConfig, finishTime })
              }
            />
          </Cell.Group>
          <View
            style={{
              margin: "0 32rpx",
              marginTop: "32rpx",
              marginBottom: "60rpx"
            }}
          >
            <Button
              disabled={workConfig.startTime > workConfig.finishTime}
              block
              color="primary"
              onClick={handleSubmitWork}
            >
              完成
            </Button>
          </View>
        </View>
      )}
    </>
  );
};

export default CreateCourse;
