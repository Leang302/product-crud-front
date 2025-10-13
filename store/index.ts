import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Task, Generation, Class } from "@/types";

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Task Store
interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filterType: "all" | "your";
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilterType: (type: "all" | "your") => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  filterType: "all",
  isLoading: false,
  setTasks: (tasks) => set({ tasks, filteredTasks: tasks }),
  addTask: (task) => {
    const { tasks } = get();
    const newTasks = [...tasks, task];
    set({ tasks: newTasks, filteredTasks: newTasks });
  },
  updateTask: (id, updates) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
    set({ tasks: updatedTasks, filteredTasks: updatedTasks });
  },
  deleteTask: (id) => {
    const { tasks } = get();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    set({ tasks: filteredTasks, filteredTasks });
  },
  setFilterType: (filterType) => {
    const { tasks } = get();
    const filteredTasks =
      filterType === "all"
        ? tasks
        : tasks.filter((task) => task.status === "in_progress");
    set({ filterType, filteredTasks });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));

// Generation Store
interface GenerationState {
  generations: Generation[];
  isLoading: boolean;
  setGenerations: (generations: Generation[]) => void;
  addGeneration: (generation: Generation) => void;
  updateGeneration: (id: string, updates: Partial<Generation>) => void;
  deleteGeneration: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generations: [],
  isLoading: false,
  setGenerations: (generations) => set({ generations }),
  addGeneration: (generation) => {
    const { generations } = get();
    set({ generations: [...generations, generation] });
  },
  updateGeneration: (id, updates) => {
    const { generations } = get();
    const updatedGenerations = generations.map((gen) =>
      gen.id === id ? { ...gen, ...updates } : gen
    );
    set({ generations: updatedGenerations });
  },
  deleteGeneration: (id) => {
    const { generations } = get();
    const filteredGenerations = generations.filter((gen) => gen.id !== id);
    set({ generations: filteredGenerations });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));

// Class Store
interface ClassState {
  classes: Class[];
  isLoading: boolean;
  setClasses: (classes: Class[]) => void;
  addClass: (classItem: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  isLoading: false,
  setClasses: (classes) => set({ classes }),
  addClass: (classItem) => {
    const { classes } = get();
    set({ classes: [...classes, classItem] });
  },
  updateClass: (id, updates) => {
    const { classes } = get();
    const updatedClasses = classes.map((cls) =>
      cls.id === id ? { ...cls, ...updates } : cls
    );
    set({ classes: updatedClasses });
  },
  deleteClass: (id) => {
    const { classes } = get();
    const filteredClasses = classes.filter((cls) => cls.id !== id);
    set({ classes: filteredClasses });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
