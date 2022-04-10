import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Button,
  Cell,
  Checkbox,
  Form,
  Input,
  Slider,
  Textarea
} from "@taroify/core";
import { BaseEventOrig, FormProps, Map, Text, View } from "@tarojs/components";
import PickerField from "../FormItem/PickerField/PickerField";
import DateTimeField from "../FormItem/DateTimeField/DateTimeField";
import Taro from "@tarojs/taro";
import { getCurrentTime } from "../../utils";

interface CheckinFormProps {
  type: "create" | "course";
  courseConfig?: {
    startTime: Date;
    finishTime: Date;
  };
  onSubmit?: (values: any) => void;
  valueRef?: any;
}

const CheckinForm = ({
  type,
  courseConfig,
  onSubmit,
  valueRef
}: CheckinFormProps) => {
  const currentTime = getCurrentTime();

  const formInitValues = {
    startTime: new Date(currentTime),
    finishTime: new Date(currentTime + 20 * 60 * 1000),
    config: ["0"],
    range: 150
  };

  const [formValues, setFormValues] = useState<any>({ ...formInitValues });
  const [checkinType, setCheckinType] = useState();
  const [circle, setCircle] = useState([]);
  const formRef = useRef<any>();

  const handleSubmit = (
    event?: BaseEventOrig<FormProps.onSubmitEventDetail>,
    values?: any
  ) => {
    const formValue = event ? event.detail.value : values;
    const { content, config } = formValues;
    let startTime: Date, finishTime: Date;

    if (config?.includes("0")) {
      startTime = new Date(getCurrentTime());
    }
    if (config?.includes("1")) {
      startTime = courseConfig.startTime;
    }
    if (config?.includes("2")) {
      finishTime = courseConfig.finishTime;
    }
    const result = {
      ...formValue,
      checkinType,
      content: checkinType == "gps" ? content : formValue.content,
      config: undefined,
      startTime: startTime ?? formValue.startTime,
      finishTime: finishTime ?? formValue.finishTime
    };

    onSubmit?.(result);

    return result;
  };

  useImperativeHandle(
    valueRef,
    () => ({
      validate: () =>
        formRef.current.validate().then(res => handleSubmit(null, res))
    }),
    [checkinType, formValues]
  );

  const rules = useMemo(
    () => ({
      required: [{ required: true, message: "必填项" }]
    }),
    []
  );

  useEffect(() => {
    setCheckinType(formValues?.checkinType?.[0]?.value);
  }, [formValues]);

  const handleGetLocation = () => {
    Taro.showLoading({ title: "位置获取中" });
    Taro.getLocation({
      type: "gcj02"
    }).then(res => {
      const latitude = res.latitude;
      const longitude = res.longitude;

      setFormValues({
        ...formValues,
        content: { range: 150, longitude, latitude }
      });
      setCircle([
        {
          latitude,
          longitude,
          color: "#5383eb",
          fillColor: "#7cb5ec88",
          radius: 150,
          strokeWidth: 2
        }
      ]);
      Taro.hideLoading();
    });
  };

  const handleRangeChange = (v: number) => {
    setFormValues({
      ...formValues,
      content: { ...formValues.content, range: v }
    });
    setCircle([
      {
        ...circle[0],
        radius: v
      }
    ]);
  };

  return (
    <View style={{ paddingTop: "32rpx", paddingBottom: "32rpx" }}>
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        onValuesChange={(_, v) => setFormValues({ ...formValues, ...v })}
        defaultValues={formInitValues}
      >
        <Cell.Group inset>
          <PickerField
            label="考勤方式"
            placeholder="请选择考勤方式"
            field="checkinType"
            rules={rules.required}
            options={[
              { value: "number", label: "数字考勤" },
              { value: "qrcode", label: "二维码考勤" },
              { value: "gps", label: "GPS考勤" },
              { value: "quiz", label: "题目考勤" }
            ]}
          />
          <Form.Item name="title" rules={rules.required}>
            <Form.Label>名称</Form.Label>
            <Form.Control>
              <Input placeholder="请输入考勤名称" />
            </Form.Control>
          </Form.Item>
          <Form.Item name="desc">
            <Form.Label>描述</Form.Label>
            <Form.Control>
              <Input placeholder="请输入考勤描述" />
            </Form.Control>
          </Form.Item>
          {checkinType === "number" && (
            <Form.Item name="content" rules={rules.required}>
              <Form.Label>签到码</Form.Label>
              <Form.Control>
                <Input placeholder="请输入签到码" />
              </Form.Control>
            </Form.Item>
          )}

          {checkinType === "quiz" && (
            <Form.Item name="content" rules={rules.required}>
              <Form.Label>题目</Form.Label>
              <Form.Control>
                <Textarea placeholder="请输入题目信息" />
              </Form.Control>
            </Form.Item>
          )}

          {checkinType === "gps" && (
            <>
              <View className="map_container">
                <Map
                  style="width: 100%; height: 480rpx;"
                  latitude={formValues?.content?.latitude ?? 0}
                  longitude={formValues?.content?.longitude ?? 0}
                  circles={circle}
                  enableScroll={!!formValues?.content?.latitude}
                ></Map>
                {!formValues.content?.latitude && (
                  <View className="map_cover">
                    <Button onClick={handleGetLocation}>获取位置</Button>
                  </View>
                )}
              </View>
              <Form.Item name="range" defaultValue={150}>
                <Form.Label>签到范围</Form.Label>
                <Form.Control>
                  <Slider
                    disabled={!formValues?.content?.latitude}
                    min={50}
                    max={500}
                    step={50}
                    onChange={handleRangeChange}
                  />
                  <Text style={{ marginLeft: 20 }}>
                    {circle?.[0]?.radius ?? 150}M
                  </Text>
                </Form.Control>
              </Form.Item>
            </>
          )}

          <Form.Item name="config">
            <Form.Label>发布设置</Form.Label>
            <Form.Control>
              <Checkbox.Group>
                <Checkbox name="0" shape="square">
                  立即发布
                </Checkbox>
                {type === "course" && (
                  <>
                    <Checkbox name="1" shape="square">
                      跟随上课时间
                    </Checkbox>
                    <Checkbox name="2" shape="square">
                      跟随下课时间
                    </Checkbox>
                  </>
                )}
              </Checkbox.Group>
            </Form.Control>
          </Form.Item>
          {!formValues?.config?.includes("0") &&
            !formValues?.config?.includes("1") && (
              <DateTimeField
                field="startTime"
                label="开始时间"
                defaultValue={formInitValues.startTime}
              />
            )}
          {!formValues?.config?.includes("2") && (
            <DateTimeField
              field="finishTime"
              label="截止时间"
              defaultValue={formInitValues.finishTime}
            />
          )}
        </Cell.Group>
        {onSubmit && (
          <View style={{ margin: "16px" }}>
            <Button block color="primary" formType="submit">
              提交
            </Button>
          </View>
        )}
      </Form>
    </View>
  );
};

export default CheckinForm;
