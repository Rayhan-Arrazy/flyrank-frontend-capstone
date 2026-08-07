import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Application, ApplicationStatus, CVData } from "../types";

interface ApplicoState {
  applications: Application[];
  currentCV: CVData | null;
  savedCVs: CVData[];

  addApplication: (application: Omit<Application, "id">) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getApplicationsByStatus: (status: ApplicationStatus | "All") => Application[];

  saveCV: (cv: CVData) => void;
  setCurrentCV: (cv: CVData | null) => void;
  deleteSavedCV: (index: number) => void;
}

export const useApplicoStore = create<ApplicoState>()(
  persist(
    (set, get) => ({
      applications: [],
      currentCV: null,
      savedCVs: [],

      addApplication: (application) =>
        set((state) => ({
          applications: [
            ...state.applications,
            { ...application, id: crypto.randomUUID() },
          ],
        })),

      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          ),
        })),

      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),

      getApplicationsByStatus: (status) => {
        const { applications } = get();
        if (status === "All") return applications;
        return applications.filter((app) => app.status === status);
      },

      saveCV: (cv) =>
        set((state) => ({
          savedCVs: [...state.savedCVs, cv],
          currentCV: cv,
        })),

      setCurrentCV: (cv) => set({ currentCV: cv }),

      deleteSavedCV: (index) =>
        set((state) => ({
          savedCVs: state.savedCVs.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "applico-storage",
    }
  )
);
