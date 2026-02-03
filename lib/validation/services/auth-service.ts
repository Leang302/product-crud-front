import { LoginFormData } from "../auth-schema"

export const loginService =async (data: LoginFormData) =>{
   return   await fetch("http://localhost:8080/api/v1/auths/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: data.username,
            password: data.password
        })      
} )}