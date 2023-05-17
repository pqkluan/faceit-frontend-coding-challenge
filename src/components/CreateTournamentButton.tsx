import React, { FC, useCallback } from 'react';

import { thunkActions } from '../actions/tournaments';
import { useAppDispatch } from '../hooks/custom';
import { isValidTournamentName } from '../utils';

import Button from './Button';

export const CreateTournamentButton: FC = () => {
  const dispatch = useAppDispatch();

  const handleCreate = useCallback(() => {
    const name = prompt('Tournament Name:');

    // User cancel the prompt
    if (name === null) return;

    if (!isValidTournamentName(name)) {
      return alert(
        'The tournament name must contain only Latin letters, numbers, and spaces, not an empty string or only spaces!'
      );
    }

    dispatch(thunkActions.createTournament({ name }));
  }, [dispatch]);

  return <Button onClick={handleCreate}>{'CREATE TOURNAMENT'}</Button>;
};
