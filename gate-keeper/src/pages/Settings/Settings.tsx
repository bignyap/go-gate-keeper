import { useParams, Outlet, useLocation } from 'react-router-dom'; 
import ScrollableTabsButtonAuto from '../../components/Tab/Tab';

import '../../styles/main.css';

export function SettingsPage () {

    const { tab } = useParams();
    const location = useLocation();

    const tabs = [
        { label: "Endpoints", value: "endpoints" },
        { label: "Resources", value: "types" },
    ];

    const initialIndex = tabs.findIndex(t => location.pathname.includes(t.value));
    const validIndex = initialIndex !== -1 ? initialIndex : 0;

    return (
        <div className='container'>
            <div className='tabs-wrapper'>
                <ScrollableTabsButtonAuto 
                    tabs={tabs}
                    onTabChange={() => {}}
                    initialIndex={validIndex}
                />
            </div>
            <div className='settings--container'>
                <Outlet />
            </div>
        </div>
    )
}