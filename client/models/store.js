import { createSlice, configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';

const user = createSlice({
  name: 'user',
  initialState: {
    // value: {
    //     email: '',
    //     loggedIn: false,
    //     token: '',
    //     alerts: []
    // }
    email: '',
    loggedIn: false,
    token: '',
    alerts: []
  },
  reducers: {

    setUserInfoSuccessfulLogIn: (state, userData) => {

        state.email = userData.payload.user.email;
        state.token = userData.payload.token;
        state.loggedIn = true;

    },

    setAlerts: (state, alertData) => {

        state.alerts.push(alertData);

    },

    getAlerts: (state) => {

        return state.alerts;

        // return state.value.alerts;

    }
    
  }
})

export const { setUserInfoSuccessfulLogIn, setAlerts, getAlerts } = user.actions

export const store = configureStore({
  reducer: user.reducer
})
