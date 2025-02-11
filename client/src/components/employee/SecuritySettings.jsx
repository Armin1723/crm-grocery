import React, { useState } from "react";
import Divider from "../utils/Divider";
import { MdEdit } from "react-icons/md";
import Modal from "../utils/Modal";
import SettingsForm from "./SettingsForm";
import { useSelector } from "react-redux";

const SecuritySettings = () => {
  const user = useSelector((state) => state.user);
  const [securitySettingsModal, setSecuritySettingsModal] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Divider
        title={
          <div className="flex items-center gap-2">
            <span>Security Settings</span>
            <MdEdit
              className="cursor-pointer"
              onClick={() => setSecuritySettingsModal((prev) => !prev)}
            />
          </div>
        }
      />
      <div className="flex items-center justify-start gap-4">
        <div>Two Factor Auth</div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={user?.preferences?.twoFactorAuth}
            readOnly
          />
          <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-accent transition-all">
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                user.preferences.twoFactorAuth ? "translate-x-5" : ""
              }`}
            />
          </div>
        </label>
      </div>

      {securitySettingsModal && (
        <Modal
          isOpen={securitySettingsModal}
          onClose={() => setSecuritySettingsModal(false)}
          title="Security Settings"
        >
          <SettingsForm closeModal={() => setSecuritySettingsModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default SecuritySettings;
