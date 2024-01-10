import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Entries from "./pages/Entries/Entries";
import SignIn from "./pages/SignIn/SignIn";
import Sidebar from "./pages/Sidebar/Sidebar";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import UserGroups from "./pages/UserGroups/UserGroups";
import Group from "./pages/Group/Group";
import CreateGroup from "./pages/CreateGroup/CreateGroup";
import { Toaster } from "react-hot-toast";

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
                  <SignIn />
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
                        {/* <Route path="/statistics" element={<Statistics />} /> */}
                        {/* <Route path="/profile/:userID" element={<Profile />} /> */}
                        {/* <Route path="/settings" element={<Settings />} /> */}
                        {/* <Route path="/history/:userID" element={<History />} /> */}
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
