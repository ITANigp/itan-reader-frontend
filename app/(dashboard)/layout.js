import DashboardNav from "@/app/reader/(components)/DashboardNav";

export default function Layout({ children }) {

  return (
    <main className="bg-gray-100 min-h-screen">
      <DashboardNav />
      {children}
    </main>
  );
}