import React, {
  ReactNode,
  useState,
  createContext,
  useContext,
  ReactElement,
  ButtonHTMLAttributes,
  FC,
  useMemo,
} from 'react';

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

// -----------------------------------
// Tab Root
// -----------------------------------

interface TabsProps {
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

const TabsRoot: FC<TabsProps> = ({ defaultValue, children, className }) => {
  const allTriggers = React.Children.toArray(children).flatMap((child: any) =>
    child?.type === TabsList
      ? React.Children.toArray(child.props.children)
      : []
  );

  const firstValue =
    defaultValue ?? (allTriggers[0] as any)?.props?.value ?? '';
  const [selected, setSelected] = useState(firstValue);

  const contextValue = useMemo(
    () => ({ activeValue: selected, setActiveValue: setSelected }),
    [selected]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// -----------------------------------
// Tab List
// -----------------------------------

const TabsList: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex space-x-2 border-b p-2">{children}</div>;
};

// -----------------------------------
// Tab Trigger
// -----------------------------------

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

const TabsTrigger: FC<TabsTriggerProps> = ({ value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within a Tabs');

  const { activeValue, setActiveValue } = context;
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => setActiveValue(value)}
      className={
        'px-4 py-2 text-sm font-medium rounded-t ' +
        (isActive
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-600 hover:bg-gray-100') +
        ' ' +
        (props.className || '')
      }
      {...props}
    >
      {children}
    </button>
  );
};

// -----------------------------------
// Tab Content
// -----------------------------------

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

const TabsContent: FC<TabsContentProps> = ({ value, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within a Tabs');

  const { activeValue } = context;
  if (activeValue !== value) return null;

  return <div className="mt-4">{children}</div>;
};

// -----------------------------------
// Attach subcomponents
// -----------------------------------

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
