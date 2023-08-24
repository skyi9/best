import axios from 'axios'

export const loginUser = (email, password) => async (dispatch) => {

    try {

        dispatch({
            type: "LoginRequest"
        })

        const { data } = await axios.post("http://localhost:5000/api/v1/login", { email, password }, {
            headers: {
                'content-type': 'application/json'
            }
        })
        dispatch({
            type: "LoginSuccess",
            payload: data
        })

    } catch (error) {
        dispatch({
            type: "LoginSuccess",
            payload: error.message
        })
    }
}