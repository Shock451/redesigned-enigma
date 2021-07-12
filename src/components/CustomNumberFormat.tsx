import React from "react";
import NumberFormat from "react-number-format";

interface CustomNumberFormatProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    format: string;
}

function CustomNumberFormat(props: CustomNumberFormatProps) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
}

export default CustomNumberFormat;