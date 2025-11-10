import React from 'react';
import {
    RouterProvider, createHashRouter,
} from 'react-router';
import Redirect from './components/Redirect';

const routes = [];
((r) => {
    r.keys()
        .forEach((key) => {
            const module = r(key);
            const md = {
                Element: module.default,
                path: `/${key.split('/')[1]}/*`,
            };
            routes.push(md);
        });
})(require.context('./views/', true, /\.\/[^/]+\/_index\.js$/));

const router = createHashRouter(
    [...routes.map(({
                        path,
                        Element,
                    }) => ({
        path,
        element: <Element/>,
    })), {
        path: '/*',
        element: <Redirect to="/demo"/>,
    }],
);

const Routes = () => {
    return (
        <RouterProvider router={router}/>
    );
};
export default Routes;
