import { Footer, Sidebar, TopMenu } from "@/components";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log({ session });
  if (!session?.user) {
    redirect("/auth/login");
  }
  return (
    <main className="min-h-screen">
      <TopMenu />
      <Sidebar />
      <div className="px-0 sm:px-10">{children}</div>
      <Footer />
    </main>
  );
}
