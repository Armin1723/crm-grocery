import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import FormInput from "../utils/FormInput";
import { useSelector } from "react-redux";
import TagInput from "../utils/TagInput";

const TicketForm = ({ closeModal = () => {} }) => {
  const [screenshotPreview, setScreenshotPreview] = React.useState(null);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const tags = watch("tags", getValues("tags") || []);

  // Handle screenshot change
  const handleScreenshotChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) {
        event.target.value = null;
        toast.error("Image size should be less than 500kb");
        return;
      }

      const isValidFileType = ["image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      );
      if (!isValidFileType) {
        event.target.value = null;
        toast.error("Only JPG and PNG files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("screenshot", file);
    }
  };

  const submitTicket = async (values) => {
    const id = toast.loading("Adding Ticket");
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("createdBy", user._id);

    if (values.screenshot instanceof File) {
      formData.append("screenshot", values.screenshot);
    }

    //Append Tags
    values.tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPPORT_BACKEND_URL}/api/v1/tickets`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.update(id, {
          render: data.message || `Failed to create ticket`,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: `Ticket Created Successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        reset();
        setScreenshotPreview(null);
        closeModal();
      }
    } catch (error) {
      toast.update(id, {
        render: error.message || `Failed to create ticket`,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitTicket)}
      className="flex flex-col gap-4 w-full flex-1 px-3 max-sm:px-1 space-y-2"
    >
      <div className="title-input w-full flex flex-col relative group my-2">
        <label
          htmlFor="description"
          className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.title && "!text-red-500"
          }`}
        >
          Title*
        </label>
        <input
          type="text"
          placeholder="Enter ticket title"
          className={`input peer text-[var(--color-text)] ${
            errors && errors.title && "!border-red-500 focus:!border-red-500"
          }`}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title should be at least 5 characters long",
            },
          })}
        />
        {errors?.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="description-input w-full flex flex-col relative group">
        <label
          htmlFor="description"
          className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
            errors && errors.description && "!text-red-500"
          }`}
        >
          Description*
        </label>
        <textarea
          placeholder="Describe your issue in detail"
          rows={5}
          className={`input peer text-[var(--color-text)] ${
            errors &&
            errors.description &&
            "!border-red-500 focus:!border-red-500"
          }`}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 20,
              message: "Description should be at least 20 characters long",
            },
          })}
        />
        {errors?.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2 text-[var(--color-text-light)]">
        <TagInput tags={tags} setTags={(tags) => setValue("tags", tags)} />
      </div>

      <div className="space-y-2 text-[var(--color-text-light)]">
        <label htmlFor="screenshot" className="font-semibold">
          Screenshot
        </label>
        <div className="border-2 border-dashed border-neutral-500/50 rounded-lg p-4 text-center relative">
          {screenshotPreview ? (
            <div className="relative">
              <img
                src={screenshotPreview}
                alt="Screenshot Preview"
                className="mx-auto max-h-96 w-full object-contain rounded-lg"
              />
              <div
                className="absolute top-2 right-2 cursor-pointer hover:opacity-75 bg-[var(--color-card)] px-3 rounded-lg py-1"
                onClick={() => {
                  setScreenshotPreview(null);
                  setValue("screenshot", null);
                }}
              >
                <MdClose />
              </div>
            </div>
          ) : (
            <div
              onClick={() =>
                document.getElementById("screenshot-upload").click()
              }
              className="h-48 flex items-center justify-center bg-[var(--color-card)] rounded-lg cursor-pointer"
            >
              <span className="text-[var(--color-text-light)] text-xs">
                Click to upload screenshot (JPG/PNG, max 500kb)
              </span>
            </div>
          )}
          <input
            type="file"
            id="screenshot-upload"
            accept=".jpg,.jpeg,.png"
            className="w-full py-2"
            onChange={handleScreenshotChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={Object.keys(errors).length > 0 || loading}
        className="px-3 py-1.5 capitalize rounded-md bg-accent disabled:cursor-not-allowed disabled:opacity-30 hover:bg-accentDark text-white"
      >
        Create Ticket
      </button>
    </form>
  );
};

export default TicketForm;
