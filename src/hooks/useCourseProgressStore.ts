import { create } from 'zustand';

export type SessionStatus = 'not_started' | 'in_progress' | 'completed';

export interface SessionProgress {
  status: SessionStatus;
  scrollPercent: number;
  timeSpent: number;
}

export interface CourseProgressState {
  activeSessionId: string;
  sessionsProgress: Record<string, SessionProgress>;
  courseProgress: number;
  courseCompleted?: boolean;
  totalSections?: number;
  setTotalSections: (n: number) => void;
  // callback when course reaches 100%
  onCourseComplete?: (() => void) | null;
  setOnCourseComplete: (fn: (() => void) | null) => void;
  // ensure sessions exist in the progress map (mark as not_started if missing)
  ensureSessions: (ids: string[]) => void;
  setCourseCompleted: (v: boolean) => void;
  setActiveSession: (id: string) => void;
  markSessionCompleted: (id: string) => void;
  updateSessionScroll: (id: string, percent: number) => void;
  updateSessionTime: (id: string, time: number) => void;
}

export const useCourseProgressStore = create<CourseProgressState>((set, get) => {
  // helper: load persisted state
  const load = () => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('courseProgress');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  };

  const persisted = load();

  const save = (state: Partial<CourseProgressState>) => {
    try {
      if (typeof window === 'undefined') return;
      const toSave = {
        activeSessionId: state.activeSessionId ?? get().activeSessionId,
        sessionsProgress: state.sessionsProgress ?? get().sessionsProgress,
        courseProgress: state.courseProgress ?? get().courseProgress,
        totalSections: state.totalSections ?? get().totalSections,
        courseCompleted: state.courseCompleted ?? get().courseCompleted,
      };
      localStorage.setItem('courseProgress', JSON.stringify(toSave));
    } catch (e) {}
  };

  const initial: CourseProgressState = {
    activeSessionId: persisted?.activeSessionId ?? '',
    sessionsProgress: persisted?.sessionsProgress ?? {},
    courseProgress: persisted?.courseProgress ?? 0,
    totalSections: persisted?.totalSections ?? undefined,
    setTotalSections: (n: number) => set((state) => {
      const next = { ...state, totalSections: n };
      save(next as Partial<CourseProgressState>);
      return { totalSections: n } as any;
    }),
    courseCompleted: persisted?.courseCompleted ?? false,
    setCourseCompleted: (v: boolean) => set((state) => {
      const next = { courseCompleted: v } as Partial<CourseProgressState>;
      save(next);
      return next as any;
    }),
    ensureSessions: (ids: string[]) => set((state) => {
      const updated = { ...state.sessionsProgress };
      ids.forEach(id => {
        if (!updated[id]) {
          updated[id] = { status: 'not_started', scrollPercent: 0, timeSpent: 0 };
        }
      });
      const nextState = { sessionsProgress: updated } as Partial<CourseProgressState>;
      save(nextState);
      return nextState as any;
    }),
    onCourseComplete: null,
    setOnCourseComplete: (fn: (() => void) | null) => set(() => ({ onCourseComplete: fn } as any)),
    setActiveSession: (id: string) => set((state) => {
      const existing = state.sessionsProgress[id];
      const nextState = {
        activeSessionId: id,
        sessionsProgress: {
          ...state.sessionsProgress,
          [id]: {
            status: (existing?.status === 'completed' ? 'completed' : 'in_progress') as SessionStatus,
            scrollPercent: existing?.scrollPercent ?? 0,
            timeSpent: existing?.timeSpent ?? 0,
          },
        },
      } as Partial<CourseProgressState>;
      try { console.log('[progress] setActiveSession ->', id); } catch (e) {}
      save(nextState);
      return nextState as any;
    }),
    markSessionCompleted: (id: string) => set((state) => {
      const existing = state.sessionsProgress[id];
      const updated = {
        ...state.sessionsProgress,
        [id]: {
          status: 'completed' as SessionStatus,
          scrollPercent: existing?.scrollPercent ?? 100,
          timeSpent: existing?.timeSpent ?? 0,
        },
      };
      // determine total sections: prefer most recent persisted totalSections, else infer from updated keys
      const totalFromGet = (get() as any).totalSections as number | undefined;
      const total = totalFromGet ?? state.totalSections ?? Object.keys(updated).length;
      // warn if there's a mismatch between known sessions and persisted total
      try {
        const inferred = Object.keys(updated).length;
        if (typeof total === 'number' && total !== inferred) {
          // eslint-disable-next-line no-console
          console.warn('[progress] totalSections mismatch:', { total, inferred });
        }
      } catch (e) {}
      const completedCount = Object.values(updated).filter(s => s.status === 'completed').length;
      const newProgress = total ? Math.round((completedCount / total) * 100) : 0;
      try { console.log('[progress] markSessionCompleted ->', id); } catch (e) {}
      const nextState = { sessionsProgress: updated, courseProgress: newProgress } as Partial<CourseProgressState>;
      save(nextState);
      // trigger onCourseComplete if reached 100
      if (newProgress === 100) {
        const cb = (get() as any).onCourseComplete;
        try { if (typeof cb === 'function') cb(); } catch (e) {}
      }
      return nextState as any;
    }),
    updateSessionScroll: (id: string, percent: number) => set((state) => {
      const existing = state.sessionsProgress[id];
      const updated = {
        ...state.sessionsProgress,
        [id]: {
          status: (existing?.status ?? 'in_progress') as SessionStatus,
          scrollPercent: percent,
          timeSpent: existing?.timeSpent ?? 0,
        },
      };
      const nextState = { sessionsProgress: updated } as Partial<CourseProgressState>;
      save(nextState);
      return nextState as any;
    }),
    updateSessionTime: (id: string, time: number) => set((state) => {
      const existing = state.sessionsProgress[id];
      const updated = {
        ...state.sessionsProgress,
        [id]: {
          status: (existing?.status ?? 'in_progress') as SessionStatus,
          scrollPercent: existing?.scrollPercent ?? 0,
          timeSpent: time,
        },
      };
      const nextState = { sessionsProgress: updated } as Partial<CourseProgressState>;
      save(nextState);
      return nextState as any;
    }),
  };

  return initial;
});
