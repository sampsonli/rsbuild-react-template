import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import React, {useEffect} from 'react';
import {evtBus} from 'mtor';
import {debounce} from '~/common/utils';
import {ConfigProvider, theme} from 'antd';
import zhCN from 'antd/locale/zh_CN';

let rootFontSize = Number(document.documentElement.style.fontSize.replace('px', ''));
// eslint-disable-next-line react/prop-types
const AntdProvider = ({children}) => {
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

    return (<ConfigProvider theme={theme.darkAlgorithm} locale={zhCN}>
        <StyleProvider transformers={trans}>
            {children}
        </StyleProvider>
    </ConfigProvider>);
};

export default AntdProvider;