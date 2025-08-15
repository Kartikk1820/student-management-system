import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import "../../styles/globals.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen ">
      {/*SideBar*/}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-800 flex-1">{children}</main>
      </div>
    </div>
  );
}
