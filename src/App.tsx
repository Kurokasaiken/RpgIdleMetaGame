import { AppHeader } from '@/components/ui/AppHeder';
import { BalancerProvider } from '@/core/BalancerContext';
import { ModuleTabs } from '@/components/ModuleTabs';

export default function App() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <AppHeader />
      <BalancerProvider>
        <main className="p-4">
          <ModuleTabs />
        </main>
      </BalancerProvider>
    </div>
  );
}
