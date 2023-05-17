import { Dispatch } from 'redux';

import { API_TOURNAMENTS_URL } from '../constants/api';
import { selectors } from '../selectors/tournaments';
import { RootState } from '../reducers';
import { Tournament } from '../types';

const FETCH_TOURNAMENTS_STARTED = 'tournaments/fetch_started' as const;
const FETCH_TOURNAMENTS_SUCCESS = 'tournaments/fetch_success' as const;
const FETCH_TOURNAMENTS_ERROR = 'tournaments/fetch_error' as const;

const UPDATE_TOURNAMENT_NAME = 'tournaments/update_name' as const;
const DELETE_TOURNAMENT = 'tournaments/delete' as const;
const ADD_TOURNAMENT = 'tournaments/add' as const;

export const actions = {
  fetchTournamentsStarted: () => ({
    type: FETCH_TOURNAMENTS_STARTED,
  }),
  fetchTournamentsSuccess: (payload: Tournament[]) => ({
    type: FETCH_TOURNAMENTS_SUCCESS,
    payload,
  }),
  fetchTournamentsError: (payload: string) => ({
    type: FETCH_TOURNAMENTS_ERROR,
    payload,
  }),
  updateTournamentName: (payload: Pick<Tournament, 'id' | 'name'>) => ({
    type: UPDATE_TOURNAMENT_NAME,
    payload,
  }),
  deleteTournament: (payload: Pick<Tournament, 'id'>) => ({
    type: DELETE_TOURNAMENT,
    payload,
  }),
  addTournament: (payload: { tour: Tournament; atIndex?: number }) => ({
    type: ADD_TOURNAMENT,
    payload,
  }),
};

export const thunkActions = {
  fetchTournaments:
    (payload?: { query?: string }) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
      const { query: q = '' } = payload || {};

      try {
        const loading = selectors.selectFetchingError(getState());
        if (loading) return;

        dispatch(actions.fetchTournamentsStarted());

        const params = q ? '?' + new URLSearchParams({ q }) : '';
        const response = await fetch(API_TOURNAMENTS_URL + params, {
          method: 'GET',
        });
        const data: Tournament[] = await response.json();

        dispatch(actions.fetchTournamentsSuccess(data));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        dispatch(actions.fetchTournamentsError(message));
      }
    },
  createTournament:
    (payload: { name: string }) => async (dispatch: Dispatch) => {
      const { name } = payload;

      try {
        const response = await fetch(API_TOURNAMENTS_URL, {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Failed to create tournament name');

        const tour: Tournament = await response.json();
        dispatch(actions.addTournament({ tour, atIndex: 0 }));
      } catch {
        // Do nothing
      }
    },

  editTournamentName:
    (payload: { id: string; name: string }) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
      const { id, name } = payload;

      const tour = selectors.selectTournamentById(id)(getState());
      if (!tour) return; // Nothing to do here

      try {
        // Optimistic update local data
        dispatch(actions.updateTournamentName({ id, name }));

        const response = await fetch(API_TOURNAMENTS_URL + '/' + id, {
          method: 'PATCH',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Failed to update tournament name');

        const data: Tournament = await response.json();
        if (data.name !== name)
          throw new Error('Return name is not match with submitted name');
      } catch (error) {
        // Fallback in case of failure
        dispatch(actions.updateTournamentName({ id, name: tour.name }));
      }
    },
  deleteTournament:
    (payload: { id: string }) =>
    async (dispatch: Dispatch, getState: () => RootState) => {
      const { id } = payload;

      const tour = selectors.selectTournamentById(id)(getState());
      if (!tour) return; // Nothing to do here

      const ids = selectors.selectTournamentIds(getState());
      const tourIndex = ids.indexOf(id);
      if (tourIndex === -1) return; // Nothing to do here

      try {
        // Optimistic update local data
        dispatch(actions.deleteTournament({ id }));

        const response = await fetch(API_TOURNAMENTS_URL + '/' + id, {
          method: 'DELETE',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        if (!response.ok) throw new Error('Failed to delete tournament');
      } catch (error) {
        // Fallback in case of failure
        dispatch(actions.addTournament({ tour, atIndex: tourIndex }));
      }
    },
};
