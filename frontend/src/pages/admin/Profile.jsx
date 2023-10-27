import React from "react";
import Navbar from "../../components/Navbar";
import ProfileUser from "../../components/ProfileUser";

export default function Profile() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <ProfileUser />
      </div>
    </>
  );
}
