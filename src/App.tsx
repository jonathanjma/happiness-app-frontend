import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Entries from "./pages/Entries";
import SignIn from "./pages/SignIn";
import ApiProvider from "./contexts/ApiProvider";

export default function App() {
  useEffect(() => {
    // @ts-ignore
    import("preline");
  }, []);

  return (
    <BrowserRouter>
      <ApiProvider>
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
      </ApiProvider>

    </BrowserRouter>
  );
}
