import Sidebar from "../components/common/staking/sidebar";
import Dashboard from "../components/common/staking/dashboard";

function Staking() {
  return (
    <div id="staking" className="h-screen md:flex">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default Staking;
