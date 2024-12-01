import { useState } from 'react';
import ScrollableTabsButtonAuto from '../../components/Tab/Tab'
import { EndpointTab } from './Endpoint/Endpoint';
import { SubScriptionTierTab } from './SubscriptionTier/SubscriptionTier';
import { OrganizationTypeTab } from './OrganizationType/OrganizationType';
import { ResourceTypeTab } from './ResourceType/ResourceType';

import '../../styles/main.css';

export function SettingsPage () {
    const [selectedTab, setSelectedTab] = useState("Endpoints");

    const handleTabChange = (newTab: string) => {
        setSelectedTab(newTab);
    };

    return (
        <div className = 'container'>
            <div className='tabs-wrapper'>
                <ScrollableTabsButtonAuto 
                    tabs={[
                        "Endpoints",
                        "Resources",
                        "Organization Types",
                        "Subscription Tiers",
                    ]}
                    onTabChange={handleTabChange}
                />
            </div>
            <div className = 'settings--container'>
                {selectedTab === "Endpoints" && <EndpointTab />}
                {selectedTab === "Resources" && <ResourceTypeTab />}
                {selectedTab === "Organization Types" && <OrganizationTypeTab />}
                {selectedTab === "Subscription Tiers" && <SubScriptionTierTab />}
            </div>
        </div>
    )
}