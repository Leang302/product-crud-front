import { AuthSchema } from "../validation/auth-schema"
import http from "./http";
const BASE_URL = process.env.BASE_URL;
export const loginService =async (data: AuthSchema) =>{
   return   await fetch(`${BASE_URL}/auths/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: data.username,
            password: data.password
        })      
} )
    // return http.post(`${BASE_URL}/auths/login`, {
    //     username: data.username,
    //     password: data.password
    // })
}

export const registerService = async (data: AuthSchema) =>{
    return await fetch(`${BASE_URL}/auths/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
            roles: ["USER"]
        })
    })
}