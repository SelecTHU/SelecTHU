import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// import { cookies } from "next/headers"

declare module "next-auth" {
    interface Session {
        user: {
            backend_jwt: string
        } & DefaultSession["user"]
    }
}

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
                    console.log("URL is", process.env.BACKEND_URL)
                    const url = process.env.BACKEND_URL + "/login-default/"
                    console.log(url)
                    const resp = await fetch(url, {
                        method: "POST",
                        // body: {},
                    })

                    if (resp.ok) {
                        const resData = await resp.json()
                        if (resData.jwt) {
                            /* cookies().set("jwt-token", resData.jwt, {
                                path: "/",
                                maxAge: 60 * 60,
                                httpOnly: true,
                            })
                            console.log("resData", resData.jwt) */
                            user = {"backend_jwt": resData.jwt}
                            return user
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
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth
        },
        jwt({ token, user }) {
            if (user) {
                token.backend_jwt = user.backend_jwt
            }
            return token
        },
        session({ session, token, user }) {
            // console.log("SESSION", session, "TOKEN", token, "USER", user)
            return {
                ...session,
                user: {
                    ...session.user,
                    backend_jwt: token.backend_jwt,
                },
            }
        },
    },
    pages: {
        signIn: "/login"
    },
})
