import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/modules/Auth/Login"), {
  loading: () => <p>Loading...</p>,
});

export default function LoginPage(props: any) {
  return (
    <div className="w-screen h-screen relative">
      <MainLayout {...props}>
        <Login {...props} />;
      </MainLayout>
    </div>
  );
}
