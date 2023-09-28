import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  loading: () => <p>Loading...</p>,
});

export default function ChatPage(props: any) {
  return (
    <MainLayout {...props}>
      <Chat />
    </MainLayout>
  );
}
