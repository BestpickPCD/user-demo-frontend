import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";

const Register = dynamic(() => import("@/modules/Auth/Register"), {
  loading: () => <p>Loading...</p>,
});

export default function RegisterPage(props: any) {
  return (
    <div className="w-screen h-screen relative">
      <MainLayout {...props}>
        <Register />;
      </MainLayout>
    </div>
  );
}
