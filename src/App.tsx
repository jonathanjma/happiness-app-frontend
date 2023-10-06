import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RepoProvider from "./contexts/RepoProvider";
import UserProvider from "./contexts/UserProvider";
import Entries from "./pages/Entries";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import SignIn from "./pages/SignIn";

export default function App() {
  useEffect(() => {
    // @ts-ignore
    import("preline");
  }, []);

  return (
    <BrowserRouter>
      <RepoProvider>
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
            {/* <Route
              path="/reset-pass"
              element={
                <PublicRoute>
                  <RequestResetPassword newPassword={false} />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-pass/change-pass/:token"
              element={
                <PublicRoute>
                  <ResetPassword newPassword={true} />
                </PublicRoute>
              }
            /> */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="/home" element={<Entries />} />
                    {/* <Route path="/statistics" element={<Statistics />} /> */}
                    {/* <Route path="/profile/:userID" element={<Profile />} /> */}
                    {/* <Route path="/groups" element={<UserGroups />} /> */}
                    {/* <Route path="/groups/:groupID" element={<Group />} /> */}
                    {/* <Route path="/settings" element={<Settings />} /> */}
                    {/* <Route path="/history/:userID" element={<History />} /> */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </UserProvider>
      </RepoProvider>
    </BrowserRouter>
  );
}
