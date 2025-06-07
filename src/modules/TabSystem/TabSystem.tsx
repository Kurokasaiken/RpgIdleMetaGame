// modules/TabSystem/TabSystem.tsx
import React, { ReactNode, useState, createContext, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs as ShadTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface TabProps {
  title: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const firstTitle = children[0]?.props.title ?? '';
  const [selected, setSelected] = useState(firstTitle);

  return (
    <ShadTabs defaultValue={selected} className="w-full">
      <Card>
        <TabsList className="flex space-x-2 p-2 border-b">
          {children.map((child) => (
            <TabsTrigger
              key={child.props.title}
              value={child.props.title}
              onClick={() => setSelected(child.props.title)}
            >
              {child.props.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <CardContent className="p-4">
          {children.map((child) =>
            child.props.title === selected ? (
              <TabsContent key={child.props.title} value={child.props.title}>
                {child.props.children}
              </TabsContent>
            ) : null
          )}
        </CardContent>
      </Card>
    </ShadTabs>
  );
};
