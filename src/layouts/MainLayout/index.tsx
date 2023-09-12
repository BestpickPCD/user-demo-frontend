import React from "react";
import Headers from "@/layouts/MainLayout/Headers";
import Footer from "@/layouts/MainLayout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({ children, ...props }: MainLayoutProps) => {
  return (
    <>
      <Headers {...props} />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
