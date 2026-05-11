import React, { Dispatch, SetStateAction } from 'react'
import { tabs } from './SettingComponent';

type Props = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>
}
const LeftBar = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="p-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl mb-1 transition-all
                  ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  )
}

export default LeftBar