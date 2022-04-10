import { FormItemInstance, FormRule } from "@taroify/core/form";
import { Form, Input, Picker, Popup } from "@taroify/core";
import { ArrowRight } from "@taroify/icons";

import React, { useRef, useState } from "react";

interface PickerFieldProps {
  field: string;
  label: string;
  rules?: FormRule[];
  placeholder?: string;
  options: { label: any; value: any }[];
  onChange?: () => void;
}

const PickerField = ({
  field,
  label,
  rules,
  placeholder,
  options,
  onChange
}: PickerFieldProps) => {
  const itemRef = useRef<FormItemInstance>();
  const [open, setOpen] = useState(false);

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
              readonly
              value={controller.value?.[0]?.label}
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
        <Picker
          onCancel={() => setOpen(false)}
          onConfirm={newValue => {
            itemRef.current?.setValue(newValue);
            setOpen(false);
            onChange?.();
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {options.map(item => (
              <Picker.Option label={item}>{item.label}</Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>
    </>
  );
};

export default PickerField;
