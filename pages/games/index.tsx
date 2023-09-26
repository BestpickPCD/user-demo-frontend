import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";

const Games = dynamic(() => import("@/modules/Games"), {
  loading: () => <p>Loading...</p>,
});

export default function GamesPage(props: any) {
  return (
    <MainLayout {...props}>
      <Games />
    </MainLayout>
  );
}
