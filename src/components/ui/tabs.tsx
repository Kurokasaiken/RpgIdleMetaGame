import React, {
  ReactNode,
  useState,
  createContext,
  useContext,
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
  // Trova tutti i trigger per estrarre i valori
  const allTriggers = React.Children.toArray(children).flatMap((child: any) =>
    child?.type === TabsList
      ? React.Children.toArray(child.props.children)
      : []
  );

  const firstValue =
    defaultValue ?? (allTriggers[0] as React.ReactElement<{ value: string }>)?.props?.value ?? '';
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
  return (
    <div role="tablist" aria-orientation="horizontal" className="flex space-x-2 border-b p-2">
      {children}
    </div>
  );
};

// -----------------------------------
// Tab Trigger
// -----------------------------------

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

const TabsTrigger: FC<TabsTriggerProps> = ({ value, children, className = '', ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within a Tabs');

  const { activeValue, setActiveValue } = context;
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveValue(value)}
      className={
        'px-4 py-2 text-sm font-medium rounded-t focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
        (isActive
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-600 hover:bg-gray-100') +
        ' ' +
        className
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

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className="mt-4"
    >
      {children}
    </div>
  );
};

// -----------------------------------
// Attach subcomponents
// -----------------------------------

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
