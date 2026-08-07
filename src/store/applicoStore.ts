import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Application, ApplicationStatus, CVData, JobSuggestion } from "../types";

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
  deleteCV: (index: number) => void;
  updateCV: (index: number, cv: CVData) => void;
  setJobSuggestions: (cvIndex: number, suggestions: JobSuggestion[]) => void;
}

export const useApplicoStore = create<ApplicoState>()(
  persist(
    (set, get) => ({
      applications: [],
      currentCV: null,
      savedCVs: [],

      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, { ...application, id: crypto.randomUUID() }],
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

      deleteCV: (index) =>
        set((state) => ({
          savedCVs: state.savedCVs.filter((_, i) => i !== index),
        })),

      updateCV: (index, cv) =>
        set((state) => {
          const updated = [...state.savedCVs];
          updated[index] = cv;
          return { savedCVs: updated, currentCV: cv };
        }),

      setJobSuggestions: (cvIndex, suggestions) =>
        set((state) => {
          const updated = [...state.savedCVs];
          if (updated[cvIndex]) {
            updated[cvIndex] = { ...updated[cvIndex], aiSuggestions: suggestions };
          }
          return { savedCVs: updated };
        }),
    }),
    { name: "applico-storage" }
  )
);
