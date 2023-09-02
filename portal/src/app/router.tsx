import React from 'react';
import {Route, Routes} from 'react-router-dom'; // import AuthRoute from '@/components/auth_route';

import combiner, {login, index} from '@/features/combine'; // import {PageContainer} from '@gwaapp/ease';
// import type {IRouteConfig} from '@/common/types';
// interface Props {
//   featureRoutes: IRouteConfig[];
//   loginRoute: IRouteConfig;
//   indexRoute: IRouteConfig;
// }

const loginRoute = login.route;
const indexRoute = index.route;

const AppRouter = () => (
    <Routes>
        <Route
            path={loginRoute.path}
            element={
                <loginRoute.component id={login.key} title={login.title} />
            }
        />
        {/* <Route path={loginRoute.path} exact render={(props) => <loginRoute.component id={loginRoute.key} {...props} />} /> */}
        <Route
            path={`${indexRoute.path}*`}
            element={
                <indexRoute.component id={indexRoute.key} features={combiner} />
            }
        />
    </Routes>
);

export default AppRouter;
