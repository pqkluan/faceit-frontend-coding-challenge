import React, { FC, useCallback, useMemo } from 'react';
import Button from './Button';
import H6 from './H6';
import { useAppSelector } from '../hooks/custom';
import { selectors } from '../selectors/tournaments';
import { Tournament } from '../types';

import styled from 'styled-components';
import theme from '../theme';
import { useAppDispatch } from '../hooks/custom';
import { thunkActions } from '../actions/tournaments';
import { isValidTournamentName } from '../utils';

export const TournamentCard: FC<{ tournamentId: string }> = (props) => {
  const { tournamentId } = props;

  const tour = useAppSelector(selectors.selectTournamentById(tournamentId));

  // This shouldn't happen, but just to be safe
  if (!tour) return null;

  return <TournamentCardContent tour={tour} />;
};

const TournamentCardContent: FC<{ tour: Tournament }> = (props) => {
  const { tour } = props;

  const dispatch = useAppDispatch();

  const displayDate = useMemo(() => {
    return new Date(tour.startDate).toLocaleDateString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [tour.startDate]);

  const handleEdit = useCallback(() => {
    const name = prompt('New Tournament Name:', tour.name);

    // User don't update the name
    if (name === tour.name) return;
    // User cancel the prompt
    if (name === null) return;

    if (!isValidTournamentName(name)) {
      return alert(
        'The tournament name must contain only Latin letters, numbers, and spaces, not an empty string or only spaces!'
      );
    }

    dispatch(thunkActions.editTournamentName({ id: tour.id, name: name }));
  }, [dispatch, tour.id, tour.name]);

  const handleDelete = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    const ok = confirm('Do you really want to delete this tournament?');
    if (!ok) return;

    dispatch(thunkActions.deleteTournament({ id: tour.id }));
  }, [dispatch, tour.id]);

  return (
    <Card>
      <H6>{tour.name}</H6>

      <span>{`Organizer: ${tour.organizer}`}</span>
      <span>{`Game: ${tour.game}`}</span>
      <span>{`Participants: ${tour.participants.current}/${tour.participants.max}`}</span>
      <span>{`Start: ${displayDate}`}</span>
      <ButtonsRow>
        <Button onClick={handleEdit}>{'EDIT'}</Button>
        <Button onClick={handleDelete}>{'DELETE'}</Button>
      </ButtonsRow>
    </Card>
  );
};

const Card = styled.div`
  background: ${theme.palette.background.base};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.borderRadius};
  color: ${theme.palette.text.primary};
`;

const ButtonsRow = styled.div`
  display: flex;
  column-gap: 8px;
  margin-top: 8px;
`;
