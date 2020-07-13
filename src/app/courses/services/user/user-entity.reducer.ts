import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as UserActions from './user-entity.actions';
import { User } from '../../model/user';

export const userEntityFeatureKey = 'users';

export interface UserEntityState extends EntityState<User> {
  // additional entities state properties
}

export interface UserEntityPartialState {
  readonly [userEntityFeatureKey]: UserEntityState;
}
export const userEntityAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserEntityState = userEntityAdapter.getInitialState({
  // additional entity state properties
});


const userReducer = createReducer(
  initialState,
  on(UserActions.addUser,
    (state, action) => userEntityAdapter.addOne(action.user, state)
  ),
  on(UserActions.upsertUser,
    (state, action) => userEntityAdapter.upsertOne(action.user, state)
  ),
  on(UserActions.addUsers,
    (state, action) => userEntityAdapter.addMany(action.users, state)
  ),
  on(UserActions.upsertUsers,
    (state, action) => userEntityAdapter.upsertMany(action.users, state)
  ),
  on(UserActions.updateUser,
    (state, action) => userEntityAdapter.updateOne(action.user, state)
  ),
  on(UserActions.updateUsers,
    (state, action) => userEntityAdapter.updateMany(action.users, state)
  ),
  on(UserActions.deleteUser,
    (state, action) => userEntityAdapter.removeOne(action.id, state)
  ),
  on(UserActions.deleteUsers,
    (state, action) => userEntityAdapter.removeMany(action.ids, state)
  ),
  on(UserActions.loadUsers,
    (state, action) => userEntityAdapter.setAll(action.users, state)
  ),
  on(UserActions.clearUsers,
    state => userEntityAdapter.removeAll(state)
  ),
);

export function reducer(state: UserEntityState | undefined, action: Action) {
  return userReducer(state, action);
}


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = userEntityAdapter.getSelectors();
