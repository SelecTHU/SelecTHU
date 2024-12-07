"use server"

export async function searchCourses() {
    const res = await fetch("/api/v1/courses/")
    const json = await res.json()

    return json
}
