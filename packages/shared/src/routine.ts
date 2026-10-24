export interface RoutineTaskDto {
  id: string;
  title: string;
  minutes: number;
  checked: boolean;
}

export interface RoutineTodayDto {
  date: string;
  /** False on days with no scheduled tasks, such as weekends. */
  isStudyDay: boolean;
  tasks: RoutineTaskDto[];
  completed: boolean;
  streak: number;
}
