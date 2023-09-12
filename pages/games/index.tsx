import MainLayout from "@/layouts/MainLayout";
import Games from "@/modules/Games";
import React from "react";

const GamesPage = (props: any) => {
  return (
    <MainLayout {...props}>
      <Games />
    </MainLayout>
  );
};

export default GamesPage;
