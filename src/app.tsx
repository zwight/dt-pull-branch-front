import { ConfigProvider, Empty } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import Home from './pages/home';

function App() {
    return (
        <ConfigProvider
            locale={zhCN}
            autoInsertSpaceInButton={false}
            renderEmpty={() => <Empty />}
        >
			<Home />
        </ConfigProvider>
    );
}

export default App;
