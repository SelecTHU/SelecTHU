"use server"

export async function searchCourses() {
    try {
        const res = await fetch("http://backend:8001/api/v1/courses/")
        return res.status
    } catch (error) {
        return error.message
    }
    // const json = await res.json()

    // return json
}
