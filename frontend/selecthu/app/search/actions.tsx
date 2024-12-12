"use server"

import { cookies } from "next/headers"

export async function searchCourses(filters) {
    try {
        console.log(filters)
        const cookieStore = await cookies()
        const jwt = cookieStore.get("jwt-token").value
        // const res = await fetch("http://backend:8001/api/v1/courses/", {
        // var url = "http://selecthu.shyuf.cn:8000/api/v1/courses/?search_mode=fuzzy"
        var url = "http://backend:8001/api/v1/courses/?search_mode=fuzzy"
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
        return json["courses-main"].course
    } catch (error) {
        console.log(error.message)
        return error.message
    }
    // const json = await res.json()

    // return json
}
