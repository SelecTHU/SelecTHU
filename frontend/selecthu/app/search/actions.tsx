"use server"

export async function searchCourses() {
    const res = await fetch("http://localhost:8000/api/v1/courses/")
    return res.status
    // const json = await res.json()

    // return json
}
