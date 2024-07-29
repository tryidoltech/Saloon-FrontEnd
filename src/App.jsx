import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import WorkerSidebar from "./components/WorkerSidebar";
import AdminSidebar from "./components/AdminSidebar";
import { Suspense, lazy } from "react";
import Loader from "./components/Loader";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PendingAppointment = lazy(() => import("./pages/PendingAppointment"));
const StocksManagement = lazy(() => import("./pages/StocksManagement"));
const SaloonCalender = lazy(() => import("./pages/SaloonCalender"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ConfirmedAppointments = lazy(() =>
  import("./pages/ConfirmedAppointments")
);
const CheckInAppointments = lazy(() => import("./pages/CheckInAppointments"));
const PaidAppointments = lazy(() => import("./pages/PaidAppointments"));
const AppointmentForm = lazy(() => import("./pages/AppointmentForm"));
const WorkerAppointment = lazy(() => import("./pages/WorkerAppointment"));
const WorkerSidePage = lazy(() => import("./pages/WorkerSidePage"));
const WorkerStockPage = lazy(() => import("./pages/WorkerStockPage"));
const Invoice = lazy(() => import("./pages/Invoice"));
const AllAppointments = lazy(() => import("./pages/AllAppointments"));
const ClientInfo = lazy(() => import("./pages/ClientInfo"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminInventoryLogs = lazy(() => import("./pages/AdminInventoryLogs"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminEmployeesPage = lazy(() => import("./pages/AdminEmployeesPage"));
const CustomerSideAppt = lazy(() => import("./pages/CustomerSideAppt"));
const AdminServicesList = lazy(() => import("./pages/AdminServicesList"));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/Workerpage/*" element={<WorkerSidebar />} />
        <Route path="/Adminpage/*" element={<AdminSidebar />} />
        {/* <Route path="/Customerpage/*" element={<AdminSidebar />} /> */}
        <Route path="/*" element={<Sidebar />} />
      </Routes>
      <div className="main-content">
        <div className="app-navbar">
          <Navbar />
        </div>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path="/" element={<Dashboard />}></Route>
            <Route
              exact
              path="/AdminPage/AppointmentDashboard"
              element={<Dashboard />}
            ></Route>
            <Route
              exact
              path="/pendingappointment"
              element={<PendingAppointment />}
            ></Route>
            <Route
              exact
              path="/AdminPage/pendingappointment"
              element={<PendingAppointment />}
            ></Route>
            <Route
              exact
              path="/AdminPage/stockmanagement"
              element={<StocksManagement />}
            ></Route>
            <Route exact path="/calendar" element={<SaloonCalender />}></Route>
            <Route
              exact
              path="/AdminPage/calendar"
              element={<SaloonCalender />}
            ></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route
              exact
              path="/ConfirmedAppointments"
              element={<ConfirmedAppointments />}
            ></Route>
            <Route
              exact
              path="/AdminPage/ConfirmedAppointments"
              element={<ConfirmedAppointments />}
            ></Route>
            <Route
              exact
              path="/CheckInAppointments"
              element={<CheckInAppointments />}
            ></Route>
            <Route
              exact
              path="/AdminPage/CheckInAppointments"
              element={<CheckInAppointments />}
            ></Route>
            <Route
              exact
              path="/PaidAppointments"
              element={<PaidAppointments />}
            ></Route>
            <Route
              exact
              path="/AdminPage/PaidAppointments"
              element={<PaidAppointments />}
            ></Route>
            <Route
              exact
              path="/AppointmentForm"
              element={<AppointmentForm />}
            ></Route>
            <Route
              exact
              path="/WorkerAppointment"
              element={<WorkerAppointment />}
            ></Route>
            <Route
              exact
              path="/Workerpage"
              element={<WorkerSidePage />}
            ></Route>
            <Route
              exact
              path="/Workerpage/Workerstockpage"
              element={<WorkerStockPage />}
            ></Route>
            <Route
              exact
              path="/AdminPage/AdminDashboard"
              element={<AdminDashboard />}
            ></Route>
            <Route exact path="/invoice" element={<Invoice />}></Route>
            <Route
              exact
              path="/allappointments"
              element={<AllAppointments />}
            ></Route>
            <Route
              exact
              path="/AdminPage/allappointments"
              element={<AllAppointments />}
            ></Route>
            <Route exact path="/clientinfo" element={<ClientInfo />}></Route>
            <Route
              exact
              path="/AdminPage/clientinfo"
              element={<ClientInfo />}
            ></Route>
            <Route
              exact
              path="/AdminPage/AdminInventoryLogs"
              element={<AdminInventoryLogs />}
            ></Route>
            <Route
              exact
              path="/AdminPage/AdminSettings"
              element={<AdminSettings />}
            ></Route>
            <Route
              exact
              path="/AdminPage/AdminEmployeesPage"
              element={<AdminEmployeesPage />}
            ></Route>
            <Route
              exact
              path="/AdminPage/AdminServicesList"
              element={<AdminServicesList />}
            ></Route>
            <Route
              exact
              path="/CustomerPage/CustomerBookingForm"
              element={<CustomerSideAppt />}
            ></Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
