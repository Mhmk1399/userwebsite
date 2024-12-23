import SignIn from "@/components/signIn";
import Dashboard from "@/components/userdashboard";
import React from "react";

const page = () => {
  return (
    <div className="text-black top-5">
      <SignIn />
      {/* <Dashboard /> */}
    </div>
  );
};

export default page;
