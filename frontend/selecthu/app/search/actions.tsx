"use server"

// import { cookies } from "next/headers"
import { auth } from "@/auth"

export async function searchCourses(filters) {
    try {
        console.log(filters)
        const session = await auth()
        // console.log("SESSION", session)
        const jwt = session.user.backend_jwt
        /* const cookieStore = await cookies()
        const jwt = cookieStore.get("jwt-token").value */
        var url = process.env.BACKEND_URL + "/courses/?search_mode=fuzzy"
        for (const filter of filters) {
            console.log("filter", filter)
            if (filter.type == "courseName") {
                url = url + "&name=" + filter.value
            }
            else if (filter.type == "department") {
                url = url + "&department=" + filter.value
            }
            else if (filter.type == "courseAttribute") {
                // url = url + "&department=" + filter.value
            }
            else if (filter.type == "instructor") {
                url = url + "&teacher=" + filter.value
            }
        }
        console.log(url)
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + jwt,
            },
        })
        const json = await res.json()
        console.log(json)
        return json["courses-main"]
    } catch (error) {
        console.log(error.message)
        return error.message
    }
    // const json = await res.json()

    // return json
}

export async function addCourse(courseId) {
    const url = process.env.BACKEND_URL + "/modify-course-condition/"
    const session = await auth()
    const jwt = session.user.backend_jwt
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt,
        },
        body: JSON.stringify({
            "course_id": courseId,
            "condition": "favorite",
        }),
    })

    console.log(res)
}
