import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HappinessRepositoryImpl } from "./data/repositories/HappinessRepository";
import Entries from "./pages/Entries";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  const happinessRepository = new HappinessRepositoryImpl();
  const queryClient = new QueryClient();

  useEffect(() => {
    // @ts-ignore
    import("preline");
  }, []);

  const privateRoutes = (
    <Routes>
      <Route
        path="/home"
        element={USE_NEW_UI ? <ScrollableCalendar /> : <SubmitHappiness />}
      />
      <Route
        path="/statistics"
        element={
          <div className={bgStyle}>
            <Statistics />
          </div>
        }
      />
      <Route
        path="/profile/:userID"
        element={
          <div className={bgStyle}>
            <Profile />
          </div>
        }
      />
      <Route
        path="/groups"
        element={
          <div className={bgStyle}>
            {USE_NEW_UI ? <NewUserGroups /> : <UserGroups />}
          </div>
        }
      />
      <Route
        path="/groups/:groupID"
        element={
          <div className={bgStyle}>{USE_NEW_UI ? <NewGroup /> : <Group />}</div>
        }
      />
      <Route
        path="/settings"
        element={
          <div className={bgStyle}>
            <Settings />
          </div>
        }
      />
      <Route
        path="/history/:userID"
        element={
          <div className={bgStyle}>
            <History />
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Sidebar element={privateRoutes} />
                </PrivateRoute>
              }
            />
          </Routes>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <div className="h-screen w-full">
  //       <Entries happinessRepository={happinessRepository} />
  //       <p className="text-black">Hello world!</p>
  //     </div>
  //   </QueryClientProvider>
  // );
}
