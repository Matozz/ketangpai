import { DatetimePicker, Field, Input, Picker, Popup } from "@taroify/core";
import React, { useEffect, useState } from "react";
import { formatTime, getCurrentTime } from "../../utils";

const DatePicker = ({ label, placeholder, value: _value, onChange }) => {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const currentTime = getCurrentTime();
  const [minDate] = useState(new Date(currentTime));
  const [maxDate] = useState(new Date(currentTime + 30 * 24 * 60 * 60 * 1000));

  useEffect(() => setValue(formatTime(_value)), [_value]);

  return (
    <>
      <Field label={label} clickable onClick={() => setOpen(true)}>
        <Input placeholder={placeholder} value={value} readonly />
      </Field>
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
          min={minDate}
          max={maxDate}
          onConfirm={newValue => {
            setValue(formatTime(newValue));
            onChange?.(newValue);
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

export default DatePicker;
