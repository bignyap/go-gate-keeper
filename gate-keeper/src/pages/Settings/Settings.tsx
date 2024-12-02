import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import ScrollableTabsButtonAuto from '../../components/Tab/Tab'
import { EndpointTab } from './Endpoint/Endpoint';
import { SubScriptionTierTab } from './SubscriptionTier/SubscriptionTier';
import { OrganizationTypeTab } from './OrganizationType/OrganizationType';
import { ResourceTypeTab } from './ResourceType/ResourceType';

import '../../styles/main.css';

export function SettingsPage () {
    const { tab } = useParams();
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState(() => tab || "endpoints");

    useEffect(() => {
        if (tab && tab !== selectedTab) {
            setSelectedTab(tab);
        }
    }, [tab]);

    useEffect(() => {
        if (tab !== selectedTab) {
            navigate(`/settings/${selectedTab}`);
        }
    }, [selectedTab, navigate, tab]);

    const handleTabChange = (newTab: string) => {
        setSelectedTab(newTab);
    };

    const tabs = [
        { label: "Endpoints", value: "endpoints" },
        { label: "Resources", value: "resources" },
        { label: "Organization Types", value: "organization-types" },
        { label: "Subscription Tiers", value: "subscription-tiers" }
    ];

    const initialIndex = tabs.findIndex(tab => tab.value === selectedTab);

    return (
        <div className='container'>
            <div className='tabs-wrapper'>
                <ScrollableTabsButtonAuto 
                    tabs={tabs}
                    onTabChange={handleTabChange}
                    initialIndex={initialIndex}
                />
            </div>
            <div className='settings--container'>
                {selectedTab === "endpoints" && <EndpointTab />}
                {selectedTab === "resources" && <ResourceTypeTab />}
                {selectedTab === "organization-types" && <OrganizationTypeTab />}
                {selectedTab === "subscription-tiers" && <SubScriptionTierTab />}
            </div>
        </div>
    )
}