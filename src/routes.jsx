 
import React, {useEffect} from 'react';
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import {
    RouterProvider, createHashRouter,
} from 'react-router';
import Redirect from './components/Redirect';
import {evtBus} from 'mtor';
import {debounce} from '~/common/utils';

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
        element: <Element />,
    })), {
        path: '/*',
        element: <Redirect to="/app" />,
    }],
);


window.eventBus = evtBus;
let rootFontSize = Number(document.documentElement.style.fontSize.replace('px', ''));
const Routes = () => {
    const [trans, setTrans] = React.useState([px2remTransformer({rootValue: rootFontSize})]);
    useEffect(() => {
        const db = debounce(() => {
            setTrans([px2remTransformer({rootValue: rootFontSize})]);
        });
        return evtBus.on('switchSize', ({rFontSize}) => {
            rootFontSize = rFontSize;
            db();
        });
    }, []);


    return (
        <StyleProvider transformers={trans}>
            <RouterProvider router={router}/>
        </StyleProvider>

    );
};
export default Routes;