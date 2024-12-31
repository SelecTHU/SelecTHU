import NextAuth, { type DefaultSession, CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// import { cookies } from "next/headers"

declare module "next-auth" {
    interface User {
        realName: string,
        backend_jwt: string,
    }
    interface Session {
        user: User
        /* user: {
            backend_jwt: string
        } & DefaultSession["user"] */
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        realName: string,
        backend_jwt: string,
    }
}

class InvalidLoginError extends CredentialsSignin {
    code = "用户名或密码错误"
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

                console.log("URL is", process.env.BACKEND_URL)
                const url = process.env.BACKEND_URL + "/login/"
                console.log(url)
                console.log("USERNAME", credentials.username)
                const resp = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "user_id": credentials.username,
                        "password": credentials.password,
                    }),
                })

                console.log("RESP", resp)
                if (resp.ok) {
                    const resData = await resp.json()
                    if (resData.jwt) {
                        /* cookies().set("jwt-token", resData.jwt, {
                            path: "/",
                            maxAge: 60 * 60,
                            httpOnly: true,
                        })
                        console.log("resData", resData.jwt) */
                        console.log("resData", resData)
                        user = {realName: resData.name, backend_jwt: resData.jwt}
                        console.log("USER", user)
                        return user
                    }
                    else {
                        console.error(resp.statusText)
                        // throw CredentialsSignin
                        return null
                    }
                }
                else if (resp.status == 401) {
                    console.error("登录失败：用户名或密码错误")
                    throw new InvalidLoginError()
                    // throw new Error("登录失败：用户名或密码错误")
                    // throw new Error( JSON.stringify({ errors: "登录失败", status: false }) )
                    return null
                }
                else if (resp.status == 400) {
                    console.error("400 Bad Request")
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
                token.realName = user.realName
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
                    realName: token.realName,
                },
            }
        },
    },
    pages: {
        signIn: "/login"
    },
})
