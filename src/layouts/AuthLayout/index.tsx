import Image from "next/image";
import React from "react";
import { imgs } from "../../../public";
import { Container, useTheme } from "@mui/material";
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const theme = useTheme();
  return (
    <div>
      <Image
        src={imgs.backgroundImg}
        alt={""}
        fill
        style={{ objectFit: "fill" }}
      />
      <div
        className=" absolute w-[100%] h-[100%] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] flex justify-center items-center"
        style={{
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255, 0.1)"
              : "rgba(0,0,0, 0.3)",
        }}
      >
        <Container
          className="text-white p-12 rounded-lg "
          maxWidth="sm"
          sx={{
            width: "90%",
            background:
              theme.palette.mode === "light"
                ? "rgba(255,255,255, 0.8)"
                : "rgba(0,0,0, 0.6)",
          }}
        >
          {children}
        </Container>
      </div>
    </div>
  );
};

export default AuthLayout;
