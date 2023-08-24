import axios from 'axios'

export const loginUser = (email, password) => async (dispatch) => {

    try {

        dispatch({
            type: "LoginRequest"
        })

        const { data } = await axios.post("/api/v1/login", { email, password }, {
            headers: {
                'content-type': 'application/json'
            },
            withCredentials: true, // Allow sending cookies
        })
        dispatch({
            type: "LoginSuccess",
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: "LoginSuccess",
            payload: error.message
        })
    }
}