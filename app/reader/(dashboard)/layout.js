import DashboardNav from "../(components)/DashboardNav";

export default function Layout({ children }) {
  return (
    <main className="bg-gray-100">
      <DashboardNav />
      {children}
    </main>
  );
}
