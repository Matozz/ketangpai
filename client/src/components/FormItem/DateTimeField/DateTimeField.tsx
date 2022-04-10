import { FormItemInstance, FormRule } from "@taroify/core/form";
import { DatetimePicker, Form, Input, Picker, Popup } from "@taroify/core";
import { ArrowRight } from "@taroify/icons";
import React, { useEffect, useRef, useState } from "react";
import formatTime from "../../../utils/formatTime";
import { getCurrentTime } from "../../../utils";

interface DateTimeFieldProps {
  field: string;
  label: string;
  rules?: FormRule[];
  placeholder?: string;
  defaultValue?: any;
}

const DateTimeField = ({
  field,
  label,
  rules,
  placeholder,
  defaultValue
}: DateTimeFieldProps) => {
  const itemRef = useRef<FormItemInstance>();
  const [open, setOpen] = useState(false);
  const currentTime = getCurrentTime();
  const [minDate] = useState(new Date(currentTime - 30 * 24 * 60 * 60 * 1000));
  const [maxDate] = useState(new Date(currentTime + 30 * 24 * 60 * 60 * 1000));
  const [_defaultValue] = useState(new Date(defaultValue));

  useEffect(() => itemRef.current?.setValue(defaultValue), [itemRef]);

  return (
    <>
      <Form.Item
        ref={itemRef}
        name={field}
        clickable
        rules={rules}
        onClick={() => setOpen(true)}
        rightIcon={<ArrowRight />}
      >
        <Form.Label>{label}</Form.Label>
        <Form.Control>
          {controller => (
            <Input
              value={formatTime(new Date(controller?.value || defaultValue))}
              readonly
              placeholder={placeholder}
            />
          )}
        </Form.Control>
      </Form.Item>
      <Popup
        mountOnEnter={false}
        open={open}
        rounded
        placement="bottom"
        onClose={setOpen}
      >
        <DatetimePicker
          type="date-minute"
          onCancel={() => setOpen(false)}
          defaultValue={_defaultValue}
          min={minDate}
          max={maxDate}
          onConfirm={newValue => {
            itemRef.current?.setValue(newValue);
            setOpen(false);
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
        </DatetimePicker>
      </Popup>
    </>
  );
};

export default DateTimeField;
