import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/user/userSlice";
import { toast } from "react-toastify";

const SettingsForm = ({ closeModal = () => {} }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { register, handleSubmit, watch, getValues } = useForm({
    defaultValues: {
      twoFactorAuth: user?.preferences?.twoFactorAuth || false,
    },
  });

  const formValues = watch();

  // Check if values have changed from the original user settings
  const isChanged =
    JSON.stringify(formValues) !==
    JSON.stringify({
      twoFactorAuth: user?.preferences?.twoFactorAuth || false,
    });

  const savePreferences = async (values) => {
    if (!isChanged) return;

    const id = toast.loading("Updating Preferences...");
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auth/update-preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences: {
              twoFactorAuth: values.twoFactorAuth,
            },
            uuid: user.uuid,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save preferences");
      } else {
        toast.update(id, {
          type: "success",
          render: "Preferences saved successfully",
          isLoading: false,
          autoClose: 3000,
        });
        dispatch(
          setUser({
            ...user,
            preferences: data.user.preferences,
          })
        );
        closeModal();
      }
    } catch (error) {
      toast.update(id, {
        type: "error",
        render: error.message || "Failed to save preferences",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(savePreferences)} className="space-y-3 my-4 ">
      {/* 2FA Toggle */}
      <div className="flex justify-between items-center">
        <span>Enable 2FA</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register("twoFactorAuth")}
          />
          <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-accent transition-all">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                getValues("twoFactorAuth") ? "translate-x-5" : ""
              }`}
            />
          </div>
        </label>
      </div>

      {/* Save Button (Only Active if Changes Detected) */}
      <button
        type="submit"
        disabled={!isChanged || loading}
        className={`w-full py-1 text-center text-sm rounded-lg transition-all ${
          isChanged
            ? "bg-accent hover:bg-accentDark text-white"
            : "bg-[var(--color-card-overlay)] cursor-not-allowed"
        }`}
      >
        {loading ? <p className="animate-pulse">Saving</p> : "Save Changes"}
      </button>
    </form>
  );
};

export default SettingsForm;
