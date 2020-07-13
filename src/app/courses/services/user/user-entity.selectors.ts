import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userEntityFeatureKey, UserEntityState, userEntityAdapter } from './user-entity.reducer';
import { memoize } from 'lodash';

const getUserEntityState = createFeatureSelector<UserEntityState>(
    userEntityFeatureKey
);

const { selectEntities, selectAll } = userEntityAdapter.getSelectors();

const getAllUserEntities = createSelector(
    getUserEntityState,
    selectEntities
);

const getUserById = createSelector(
    getAllUserEntities,
    userEntities =>
        memoize((userId: number) => userEntities[userId])
);

const getAllUsers = createSelector(getUserEntityState, selectAll);

const UserEntitySelectors = {
    getAllUserEntities,
    getUserById,
    getAllUsers
};

export default UserEntitySelectors;
