
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import OwlMascot from './OwlMascot';

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar className="h-screen fixed" />

      <main className="flex-1 p-6 h-screen overflow-y-auto ml-4">
        <div className="flex justify-end">
          <button
            className="bg-black text-white hover:cursor-pointer px-4 py-1 rounded-lg"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>

        <Outlet />
      </main>

      <OwlMascot to="/student-dashboard/advisor" />
    </div>
  );
};

export default DashboardLayout;
