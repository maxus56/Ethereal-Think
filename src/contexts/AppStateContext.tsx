import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface SavedIdea {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: string;
  tag: string;
  icon: string;
  topic: string;
  savedAt: string;
}

export interface PlanSubstep {
  id: string;
  text: string;
  completed?: boolean;
}

export interface PlanStep {
  number: number;
  title: string;
  status: "active" | "pending" | "upcoming" | "completed";
  description: string;
  tags: string[];
  substeps: PlanSubstep[];
}

export interface StructuredPlan {
  projectTitle: string;
  steps: PlanStep[];
}

export interface SavedPlan {
  id: string;
  user_id?: string;
  idea: string;
  plan: string | StructuredPlan;
  savedAt: string;
}

interface AppState {
  darkMode: boolean;
  notifications: boolean;
  savedIdeas: SavedIdea[];
  currentIdeas: SavedIdea[];
  savedPlans: SavedPlan[];
  ideasCreated: number;
  plansCreated: number;
  loading: boolean;
  setCurrentIdeas: (ideas: SavedIdea[]) => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  saveIdea: (idea: SavedIdea) => void;
  removeIdea: (id: string) => void;
  savePlan: (plan: SavedPlan) => void;
  removePlan: (id: string) => void;
  incrementIdeas: () => void;
  incrementPlans: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("ethereal-dark") === "true";
  });
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("ethereal-notifications") !== "false";
  });
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [currentIdeas, setCurrentIdeas] = useState<SavedIdea[]>([]);
  const [ideasCreated, setIdeasCreated] = useState(0);
  const [plansCreated, setPlansCreated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Initialize session and listeners
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        loadFromLocalStorage();
      }
    }).catch(err => {
      console.warn("Supabase session check failed, falling back to local storage:", err);
      loadFromLocalStorage();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        loadFromLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFromLocalStorage = () => {
    try {
      setSavedIdeas(JSON.parse(localStorage.getItem("ethereal-ideas") || "[]"));
      setSavedPlans(JSON.parse(localStorage.getItem("ethereal-plans") || "[]"));
      setIdeasCreated(parseInt(localStorage.getItem("ethereal-ideas-count") || "0", 10));
      setPlansCreated(parseInt(localStorage.getItem("ethereal-plans-count") || "0", 10));
    } catch (e) {
      console.error("Local storage error:", e);
    }
    setLoading(false);
  };

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      const { data: ideas } = await supabase
        .from("saved_ideas")
        .select("*")
        .eq("user_id", userId)
        .order("saved_at", { ascending: false });

      const { data: plans } = await supabase
        .from("saved_plans")
        .select("*")
        .eq("user_id", userId)
        .order("saved_at", { ascending: false });

      if (ideas) setSavedIdeas(ideas.map(i => ({ ...i, savedAt: i.saved_at })));
      if (plans) setSavedPlans(plans.map(p => ({ ...p, savedAt: p.saved_at })));
      
      setIdeasCreated(ideas?.length || 0);
      setPlansCreated(plans?.length || 0);
    } catch (e) {
      console.error("Supabase fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("ethereal-dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("ethereal-notifications", String(notifications));
  }, [notifications]);

  // Persistent storage sync (only for local mode, or as fallback)
  useEffect(() => {
    if (!session) {
      localStorage.setItem("ethereal-ideas", JSON.stringify(savedIdeas));
      localStorage.setItem("ethereal-plans", JSON.stringify(savedPlans));
      localStorage.setItem("ethereal-ideas-count", String(ideasCreated));
      localStorage.setItem("ethereal-plans-count", String(plansCreated));
    }
  }, [savedIdeas, savedPlans, ideasCreated, plansCreated, session]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleNotifications = () => setNotifications((prev) => !prev);

  const saveIdea = async (idea: SavedIdea) => {
    setSavedIdeas((prev) => [idea, ...prev]);
    if (session) {
      await supabase.from("saved_ideas").insert([{
        ...idea,
        user_id: session.user.id,
        saved_at: idea.savedAt
      }]);
    }
  };

  const removeIdea = async (id: string) => {
    setSavedIdeas((prev) => prev.filter((i) => i.id !== id));
    if (session) {
      await supabase.from("saved_ideas").delete().eq("id", id);
    }
  };

  const savePlan = async (plan: SavedPlan) => {
    setSavedPlans((prev) => [plan, ...prev]);
    if (session) {
      await supabase.from("saved_plans").insert([{
        ...plan,
        user_id: session.user.id,
        saved_at: plan.savedAt
      }]);
    }
  };

  const removePlan = async (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    if (session) {
      await supabase.from("saved_plans").delete().eq("id", id);
    }
  };

  const incrementIdeas = () => setIdeasCreated((prev) => prev + 1);
  const incrementPlans = () => setPlansCreated((prev) => prev + 1);

  return (
    <AppStateContext.Provider value={{
      darkMode, notifications, savedIdeas, currentIdeas, savedPlans, ideasCreated, plansCreated, loading,
      toggleDarkMode, toggleNotifications, saveIdea, removeIdea, savePlan, removePlan,
      incrementIdeas, incrementPlans, setCurrentIdeas,
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
};
