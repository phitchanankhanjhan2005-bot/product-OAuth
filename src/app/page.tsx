import { auth } from "../auth";
import { AuthButtons } from "../components/auth-buttons";
import ProductExplorer from "@/components/ProductExplorer";

export default async function HomePage() {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      {/* ส่วน OAuth */}
      <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Product Explorer
          </h1>

          <p className="text-sm text-slate-500">
            ระบบจัดการและค้นหาสินค้า
          </p>
        </div>

        <AuthButtons
          isLoggedIn={isLoggedIn}
          userName={session?.user?.name}
        />
      </header>

      {/* ส่วน Project Explorer */}
      <ProductExplorer />
    </main>
  );
}