import { useApplicoStore } from "../store/applicoStore";

export default function Settings() {
  const { applications, savedCVs, currentCV, setCurrentCV } = useApplicoStore();

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem("applico-storage");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = { applications, savedCVs, currentCV };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applico-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Settings</h2>
        <p className="text-navy-600 mt-1">Manage your data and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-navy-900">Data Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-navy-50 rounded-lg">
              <p className="text-2xl font-bold text-navy-900">{applications.length}</p>
              <p className="text-sm text-navy-600">Applications</p>
            </div>
            <div className="p-4 bg-navy-50 rounded-lg">
              <p className="text-2xl font-bold text-navy-900">{savedCVs.length}</p>
              <p className="text-sm text-navy-600">Saved CVs</p>
            </div>
            <div className="p-4 bg-navy-50 rounded-lg">
              <p className="text-2xl font-bold text-navy-900">{currentCV ? "1" : "0"}</p>
              <p className="text-sm text-navy-600">Active CV</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-navy-900">Current CV</h3>
          {currentCV ? (
            <div className="p-4 border border-navy-100 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-900">{currentCV.fullName || "Untitled"}</p>
                <p className="text-xs text-navy-500">{currentCV.email}</p>
              </div>
              <button onClick={() => setCurrentCV(null)} className="text-xs text-red-600 hover:text-red-800">Clear</button>
            </div>
          ) : (
            <p className="text-sm text-navy-500">No active CV set</p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-navy-900">Data Management</h3>
          <div className="flex gap-3">
            <button onClick={handleExportData} className="px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">
              Export Data
            </button>
            <button onClick={handleClearData} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              Clear All Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
