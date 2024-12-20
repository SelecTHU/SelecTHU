import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth ({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null

                try {
                    const resp = await fetch("http://backend:8001/api/v1/login-default/", {
                        method: "POST",
                        // body: {},
                    })

                    if (resp.ok) {
                        const resData = await resp.json()
                        if (resData.jwt) {
                            cookies().set("jwt-token", resData.jwt, {
                                path: "/",
                                maxAge: 60 * 60,
                                httpOnly: true,
                            })
                            return resData
                        }
                        else {
                            console.error(resp.statusText)
                            return null
                        }
                    }
                } catch (error) {
                    console.error("fetch errror: ", error)
                    return null
                }
            }
        }),
    ],
})
