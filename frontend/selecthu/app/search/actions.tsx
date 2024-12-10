"use server"

import { cookies } from "next/headers"

export async function searchCourses() {
    try {
        const cookieStore = await cookies()
        const jwt = cookieStore.get("jwt-token")
        const res = await fetch("http://selecthu.shyuf.cn:8000/api/v1/courses/", {
            headers: {
                "Authorization": "Bearer " + jwt,
            },
        })
        const json = await res.json()
        return json["courses-main"].course
    } catch (error) {
        return error.message
    }
    // const json = await res.json()

    // return json
}
