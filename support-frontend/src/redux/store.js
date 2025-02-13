import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user/userSlice'
import themeReducer from './features/theme/themeSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
})