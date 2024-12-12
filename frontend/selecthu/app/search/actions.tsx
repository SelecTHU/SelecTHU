"use server"

import { cookies } from "next/headers"

export async function searchCourses() {
    try {
        const cookieStore = await cookies()
        const jwt = cookieStore.get("jwt-token").value
        console.log(jwt)
        const res = await fetch("http://backend:8001/api/v1/courses/", {
            headers: {
                "Authorization": "Bearer " + jwt,
            },
        })
        const json = await res.json()
        console.log(json)
        return json["courses-main"].course
    } catch (error) {
        console.log(error.message)
        return error.message
    }
    // const json = await res.json()

    // return json
}
