import Home from "@/components/home/Home";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/home/components/Sidebar";

export default function Page() {
  const isDashboard = false; 

  return (
    <>
      {isDashboard ? (
        <ProtectedRoute>
          <Sidebar>
            <Home />
          </Sidebar>
        </ProtectedRoute>
      ) : (
        <Home />
      )}
    </>
  );
}
