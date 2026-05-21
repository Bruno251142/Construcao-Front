import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { getSettings, getTasks, completeTask } from '../../services/api';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');

    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const worker = TimerWorkerManager.getInstance();

  // Hidratação inicial: busca settings e tasks da API
  useEffect(() => {
    async function hydrate() {
      try {
        const [settings, tasks] = await Promise.all([getSettings(), getTasks()]);
        dispatch({
          type: TaskActionTypes.HYDRATE_TASKS,
          payload: {
            tasks: tasks.map((t: any) => ({
              ...t,
              startDate: Number(t.startDate),
              completeDate: t.completeDate ? Number(t.completeDate) : undefined,
              interruptDate: t.interruptDate ? Number(t.interruptDate) : undefined,
            })),
            config: {
              workTime: settings.workTime,
              shortBreakTime: settings.shortBreakTime,
              longBreakTime: settings.longBreakTime,
            },
          },
        });
      } catch {
        // API indisponível, mantém estado local
        console.warn('API indisponível, usando estado local.');
      }
    }

    hydrate();
  }, []);

  // Sincroniza conclusão de tarefa com a API
  useEffect(() => {
    const lastTask = state.tasks.at(-1);
    if (lastTask?.completeDate && lastTask.id) {
      completeTask(lastTask.id, lastTask.completeDate).catch(() => {});
    }
  }, [state.tasks]);

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));

    if (!state.activeTask) {
      worker.terminate();
    }

    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;

    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}