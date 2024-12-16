import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  name = "",
  type = "text",
  passVisible = "true",
  setPassVisible = () => {},
  register,
  registerValue,
  otherClasses = "",
  errors = [],
}) => {
  return (
    <div
      className={`flex flex-col relative group my-3 ${otherClasses}`}
    >
      <input
        type={type === "password" ? (passVisible ? "text" : "password") : type}
        name={name}
        placeholder=" "
        autoComplete="off"
        aria-invalid={errors && errors[type] ? "true" : "false"}
        className={`outline-none peer border-b pl-3 border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] ${
          errors && errors[type] && "!border-red-500 focus:!border-red-500"
        } transition-all duration-300`}
        {...register(registerValue, {
          required: `${name} is required`,
        })}
      />
      <label
        htmlFor={name}
        className="absolute appearance-none capitalize text-neutral-500 transition-all duration-300 ease-in -translate-y-full -translate-x-3 scale-75 peer-focus:-translate-y-[75%] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] start-1"
      >
        {name}
      </label>
      {type === 'password' &&<div
        className="hide-icon absolute right-2 cursor-pointer z-[20] peer-focus:text-[var(--color-accent-dark)]"
        onClick={() => setPassVisible((prev) => !prev)}
      >
        {passVisible ? <FaEyeSlash /> : <FaEye />}
      </div>}
      {errors && errors[type] && (
        <span className="text-red-500 text-sm">{errors && errors[type].message}</span>
      )}
    </div>
  );
};

export default InputField;
