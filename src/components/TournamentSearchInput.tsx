import React, { FC, useCallback, useRef } from 'react';

import { thunkActions } from '../actions/tournaments';
import { useAppDispatch } from '../hooks/custom';

import Input from './Input';

type Timeout = ReturnType<typeof setTimeout>;

export const TournamentSearchInput: FC = () => {
  const dispatch = useAppDispatch();

  const timerRef = useRef<Timeout>();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        dispatch(thunkActions.fetchTournaments({ query: value }));
        timerRef.current = undefined;
      }, 1000);
    },
    [dispatch]
  );

  return (
    <Input placeholder="Search tournament ..." onChange={handleInputChange} />
  );
};
