import MainLayout from "@/layouts/MainLayout";
import Transactions from "@/modules/Transactions";
import React from "react";

const GamesPage = (props: any) => {
  return (
    <MainLayout {...props}>
      <Transactions />
    </MainLayout>
  );
};

export default GamesPage;
