import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../utils/Avatar";
import LogoutButton from "../utils/LogoutButton";

const UserProfile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <Avatar image={user?.avatar} />
      <LogoutButton />
    </div>
  );
};

export default UserProfile;
