export type Tournament = {
  id: string;
  name: string;
  organizer: string;
  game: string;
  participants: { current: number; max: number };
  startDate: string;
};

export type ValueOf<T> = T[keyof T];
