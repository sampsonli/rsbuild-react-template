import React from 'react';
import 'dayjs/locale/zh-cn';

import Framework7 from 'framework7/lite-bundle';
import Framework7React, {App} from 'framework7-react';
Framework7.use(Framework7React);

import 'framework7/css/bundle';
import 'framework7-icons';

// eslint-disable-next-line react/prop-types
const Framework7Provider = ({children}) => {
    return (<App>
            {children}
        </App>);
};

export default Framework7Provider;