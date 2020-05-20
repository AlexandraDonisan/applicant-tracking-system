import React from 'react'
import { Field, reduxForm } from 'redux-form';

const adaptFileEventToValue = delegate => e => delegate(e.target.files[0]);

const FileInput = ({
  input: { value: omitValue, onChange, onBlur, ...inputProps },
  meta: omitMeta,
  ...props
}) => {
  return (
    <input
      onChange={(e) => {
        e.preventDefault();
        console.log("Files", ...e.target.files);
        const files = [...e.target.files];
        onChange(files);}
      }
      onBlur={adaptFileEventToValue(onBlur)}
      type="file"
      {...props.input}
      {...props}
    />
  );
};

export default FileInput