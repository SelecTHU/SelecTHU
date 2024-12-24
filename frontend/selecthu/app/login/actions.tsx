// app/login/actions.tsx

"use server"

import { signIn, auth } from "@/auth"

export async function handleLogin() {
    const res = await signIn("credentials", {
        redirectTo: "/main",
        username: "",
        password: "",
    })
    if (!res?.error) {
        const session = await auth()

        console.log(session?.user)
    }
    return res
}
