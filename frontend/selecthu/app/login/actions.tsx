"use server"

import { signIn } from "@/auth"

export async function handleLogin() {
    const res = await signIn("credentials", {
        redirect: false,
        username: "",
        password: "",
    })
    return res
}
