import React, { FC, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';

import { thunkActions } from '../actions/tournaments';
import { selectors } from '../selectors/tournaments';
import { useAppDispatch, useAppSelector } from '../hooks/custom';

import { TournamentCard } from './TournamentCard';

export const TournamentsContainer: FC = () => {
  const dispatch = useAppDispatch();

  const tournamentIds = useAppSelector(selectors.selectTournamentIds);
  const fetching = useAppSelector(selectors.selectFetchingStatus);
  const hasError = !!useAppSelector(selectors.selectFetchingError);

  const fetchTournaments = useCallback((searchStr = '') => {
    dispatch(thunkActions.fetchTournaments({ query: searchStr }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fetching) {
    return (
      <Center>
        <p>{'Loading tournaments ...'}</p>
      </Center>
    );
  }

  if (hasError) {
    return (
      <Center>
        <p>{'Something went wrong.'}</p>
        <Button onClick={() => fetchTournaments()}>{'RETRY'}</Button>
      </Center>
    );
  }

  if (tournamentIds.length === 0) {
    return (
      <Center>
        <p>{'No tournaments found.'}</p>
      </Center>
    );
  }

  return (
    <Container>
      {tournamentIds.map((id) => (
        <TournamentCard key={id} tournamentId={id} />
      ))}
    </Container>
  );
};

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: inline-grid;
  justify-content: center;
  align-items: center;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
