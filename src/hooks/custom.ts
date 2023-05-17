import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers';

import { ValueOf } from '../types';
import { thunkActions } from '../actions/tournaments';
type Action = ReturnType<ValueOf<typeof thunkActions>>;

type DispatchFunc = () => (action: Action) => void;

export const useAppDispatch = useDispatch as DispatchFunc;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
