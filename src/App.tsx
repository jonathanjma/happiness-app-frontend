import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Entries from "./pages/Entries/Entries";
import SignIn from "./pages/SignIn/SignIn";
import Sidebar from "./pages/Sidebar/Sidebar";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import PrivateEntries from "./pages/PrivateEntries/PrivateEntries";
import UserGroups from "./pages/UserGroups/UserGroups";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

export default function App() {
  useEffect(() => {
    // @ts-ignore
    import("preline");
    TimeAgo.addDefaultLocale(en);
  }, []);

  return (
    <BrowserRouter>
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
                        {/* <Route path="/groups/:groupID" element={<Group />} /> */}
                        {/* <Route path="/statistics" element={<Statistics />} /> */}
                        <Route path="/journal" element={<PrivateEntries />} />
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
