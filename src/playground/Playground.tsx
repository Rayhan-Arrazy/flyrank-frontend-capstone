function Playground() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Accessible Component Playground
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            FE-05: Build accessible Modal, Tabs, and Disclosure components and
            compare them against shadcn/ui implementations.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-slate-600">
          Select a component from the navigation to get started.
        </p>
      </main>
    </div>
  );
}

export default Playground;
