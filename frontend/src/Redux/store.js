import { configureStore } from '@reduxjs/toolkit'
import { allUsersReducer, postOfFollowingReducer, userReducer } from './Reducers/User';

const store = configureStore({
    reducer: {
        user: userReducer,
        postsOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer
    }
})

export default store;