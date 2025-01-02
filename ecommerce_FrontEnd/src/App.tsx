import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useVerifyQuery } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { homePageRoute, notLoggedUserRoute, loggedUserRoute, adminRoute } from "./RoutesData.json";

import "./style/app.scss";

import Header from "./components/Header";
import Loader from "./components/Loader";
import { RootState } from "./redux/store";

const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const App = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const dispatch = useDispatch();

  const { data, error } = useVerifyQuery();

  useEffect(() => {
    if (data) {
      // console.log(data);
      dispatch(userExist(data.user));
    }
    if (error) {
      console.log(error);
      dispatch(userNotExist());
    }
  }, [data, error, dispatch, user]);


  return loading ? <Loader /> : (
    <Router>

      {/* Hearder */}
      <Header user={user} />

      <Suspense fallback={<Loader />}>
        <Routes>
          {homePageRoute.map((route, index) => {
            const Component = lazy(() => import(`${route.component}`));
            return <Route key={index} path={route.path} element={<Component />} />;
          })}

          {/* Not Logged In Route */}
          {notLoggedUserRoute.map((route, index) => {
            const Component = lazy(() => import(`${route.component}`));
            return <Route key={index}
              path={route.path}
              element={
                <ProtectedRoute isAuthenticated={user ? false : true}>
                  <Component />
                </ProtectedRoute>
              }
            />
          })}

          {/* Logged User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
            {loggedUserRoute.map((route, index) => {
              const Component = lazy(() => import(`${route.component}`));
              return <Route key={index} path={route.path} element={<Component />} />;
            })}
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminRoute={true}
                isAdmin={user?.role === "admin" ? true : false}
              />
            }
          >
            {adminRoute.map((route, index) => {
              const Component = lazy(() => import(`${route.component}`));
              return <Route key={index} path={route.path} element={<Component />} />;
            })}
          </Route>

        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router >
  )
}

export default App;