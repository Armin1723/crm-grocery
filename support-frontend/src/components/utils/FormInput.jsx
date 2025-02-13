import React from "react";

const FormInput = ({
  withAsterisk = false,
  otherClasses = "",
  label = "",
  error,
  children,
  noLabel = false,
}) => {
  return (
    <div className={` max-sm:w-full flex flex-col relative group my-2 ${otherClasses}`}>
        {children}
      {!noLabel && <label
        htmlFor={label}
        className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
          error && "!text-red-500"
        }`}
      >
        {label}
        {withAsterisk && <span>*</span>}
      </label>}
      {error && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
};

export default FormInput;
