import React, { Suspense, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { Loading } from "./components/Loading/Loading";
import Redirect from "./components/Redirect";
import AuthGuard from "./components/AuthGuard";
import { Auth } from "./components/Auth/Auth";
import { NotFound } from "./components/NotFound/NotFound";
import { Home } from "./components/Home/Home";

// const ENDPOINT = "18.141.138.13:10001";
// const ENDPOINT = "localhost:10001";

const routesConfig = [
  {
    //auto forward localhost:3002 to localhost:3002/home
    exact: true,
    path: "/",
    component: () => <Redirect to="/home" />,
  },
  {
    exact: true,
    path: "/login",
    component: () => <Auth />,
  },
  //add more path
  {
    path: "*",
    routes: [
      {
        exact: true,
        guard: AuthGuard,
        path: "/home",
        component: Home,
      },
      {
        exact: true,
        path: "/404",
        component: NotFound,
      },
      {
        //anything that not match from "path" above will be route to "/404"
        exact: true,
        path: "*",
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<Loading />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {
                      route.routes ? (
                        renderRoutes(route.routes)
                      ) : (
                        <Component {...props} />
                      )
                      // console.log("route",props)
                    }
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
