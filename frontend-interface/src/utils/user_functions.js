import axios from "axios"

export async function deleteUser(user_id) {
    let res = await axios.delete(`/SCA/user/delete/${user_id}`)
    // console.log(res)
    return res.data
}

export async function getUsers() {
    let res = await axios.get(`/SCA/get_users`)
    // console.log(res)
    return res.data
}