import { actions } from '../actions/tournaments';
import { Tournament, ValueOf } from '../types';

type State = {
  ids: Tournament['id'][];
  tournamentById: Record<string, Tournament>;
  fetching: boolean;
  fetchingError?: string;
};

type Action = ReturnType<ValueOf<typeof actions>>;

const initialState = {
  ids: [],
  tournamentById: {},
  fetching: false,
  fetchingError: undefined,
};

export default function tournaments(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case 'tournaments/fetch_started': {
      return { ...state, fetching: true };
    }
    case 'tournaments/fetch_success': {
      const tournaments = action.payload;
      const ids = tournaments.map<string>((tournament) => tournament.id);
      const tournamentById = tournaments.reduce<Record<string, Tournament>>(
        (acc, tournament) => ({ ...acc, [tournament.id]: tournament }),
        {}
      );
      return { ...state, fetching: false, ids, tournamentById };
    }
    case 'tournaments/fetch_error': {
      const fetchingError = action.payload;
      return { ...state, fetching: false, fetchingError };
    }
    case 'tournaments/update_name': {
      const { id, name } = action.payload;
      const tour = state.tournamentById[id];
      if (!tour) return state;

      return {
        ...state,
        tournamentById: {
          ...state.tournamentById,
          [id]: { ...tour, name },
        },
      };
    }
    case 'tournaments/delete': {
      const { id } = action.payload;
      const ids = state.ids.filter((tournamentId) => tournamentId !== id);
      const { [id]: _, ...tournamentById } = state.tournamentById;
      return { ...state, ids, tournamentById };
    }
    case 'tournaments/add': {
      const { tour, atIndex = 0 } = action.payload;

      const ids = [...state.ids];
      // Insert the new tournament id at the given index
      ids.splice(atIndex, 0, tour.id);

      return {
        ...state,
        ids,
        tournamentById: { ...state.tournamentById, [tour.id]: tour },
      };
    }
    default: {
      return state;
    }
  }
}
