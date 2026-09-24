import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function ProductsLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
