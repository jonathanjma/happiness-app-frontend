import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import AllSearchResults from "./pages/AllSearchResults/AllSearchResults";
import CreateGroup from "./pages/CreateGroup/CreateGroup";
import Entries from "./pages/Entries/Entries";
import Group from "./pages/Group/Group";
import PrivateEntries from "./pages/PrivateEntries/PrivateEntries";
import Sidebar from "./pages/Sidebar/Sidebar";
import Statistics from "./pages/Statistics/Statistics";
import UserGroups from "./pages/UserGroups/UserGroups";
import UserSettings from "./pages/UserSettings/UserSettings";
import Welcome from "./pages/Welcome/Welcome";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <ApiProvider>
        <UserProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Welcome />
                </PublicRoute>
              }
            />
            <Route
              path="/reset_password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Sidebar
                    element={
                      <Routes>
                        <Route path="/home" element={<Entries />} />
                        <Route path="/groups" element={<UserGroups />} />
                        <Route path="/groups/:groupID" element={<Group />} />
                        <Route
                          path="/groups/create"
                          element={<CreateGroup />}
                        />
                        <Route path="/journal" element={<PrivateEntries />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/search" element={<AllSearchResults />} />
                        {/* <Route path="/profile/:userID" element={<Profile />} /> */}
                        <Route path="/settings" element={<UserSettings />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    }
                  />
                </PrivateRoute>
              }
            />
          </Routes>
        </UserProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}
