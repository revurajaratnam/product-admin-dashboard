import "./globals.css";
import { ToastProvider } from "../components/common/Toast";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Admin dashboard for managing products, built on DummyJSON.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
