import { DroidForgeLogo } from '@/components/icons/logo';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <DroidForgeLogo className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-headline font-semibold text-foreground">
          DroidForge AI
        </h1>
      </div>
    </header>
  );
}
