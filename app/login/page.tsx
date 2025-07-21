import AuthContainer from "@/components/authContainer";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "صفحه ورود",
  description: "به سایت ورود کنید",
}

const Auth = () => {
  return (
    <div>
      <AuthContainer />
    </div>
  );
};

export default Auth;
