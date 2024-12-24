// app/login/actions.tsx

"use server"

import { signIn, auth } from "@/auth"

export async function handleLogin(username, password) {
    try {
        const res = await signIn("credentials", {
            // redirect: false,
            // redirectTo: "/main/",
            username: username,
            password: password,
        });
        console.log(res)
        if (!res?.error) {
            const session = await auth()

            // console.log("SESSION", session?.user)
        }
        return res
    } catch {
    }
}
