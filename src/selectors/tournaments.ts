import { RootState } from '../reducers';
import { Tournament } from '../types';

export const selectors = {
  selectTournamentIds: (state: RootState) => state.tournaments.ids,
  selectTournamentById:
    (id: string) =>
    (state: RootState): Tournament | undefined =>
      state.tournaments.tournamentById[id],
  selectFetchingStatus: (state: RootState) => state.tournaments.fetching,
  selectFetchingError: (state: RootState) => state.tournaments.fetchingError,
};
