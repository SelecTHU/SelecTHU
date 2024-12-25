import ClientPage from "./page2"
import { auth } from "@/auth"

import { getFavCourses } from "@/app/search/actions"

export default async function MainPage() {

    const courses = await getFavCourses()

    console.log(courses)

    return (
        <ClientPage favoriteCourses={courses}/>
    )
}
