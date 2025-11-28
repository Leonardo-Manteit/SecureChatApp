import axios from 'axios'

export async function login(userInfo) {
    let res = await axios.post(`/SCA/login`, userInfo) 
    // console.log(res)
    return res.data.token
}

export async function signUp(userInfo) {
    let res = await axios.post(`/SCA/signUp`, userInfo) 
    // console.log(res)
    return res.data.token
}
