"use client";
import { useUserInfo } from "@/hook/useUserInfo";
import { getFontClass } from "@/lib/fontManager";
import { useEffect } from "react";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo?.design?.backgroundColor) {
      document.body.style.backgroundColor = userInfo.design.backgroundColor;
    }
  }, [userInfo?.design?.backgroundColor]);

  useEffect(() => {
    if (userInfo?.design?.font) {
      const fontClass = getFontClass(userInfo.design.font);
      document.body.className = document.body.className.replace(
        /font-\w+/g,
        ""
      );
      document.body.classList.add(fontClass);
    }
  }, [userInfo?.design?.font]);

  useEffect(() => {
    if (userInfo?.basic) {
      document.title = userInfo.basic.storeName || "وبسایت";

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          userInfo.basic.description || "ساخته شده با سایکو"
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = userInfo.basic.description || "ساخته شده با سایکو";
        document.head.appendChild(meta);
      }

      if (userInfo.basic.logo) {
        let favicon = document.querySelector(
          'link[rel="icon"]'
        ) as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement("link");
          favicon.rel = "icon";
          document.head.appendChild(favicon);
        }
        favicon.href = userInfo.basic.logo;
      }
    }
  }, [userInfo?.basic]);

  return <>{children}</>;
}
