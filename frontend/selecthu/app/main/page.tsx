import ClientPage from "./page2"
import { auth } from "@/auth"

import { getFavCourses, getCurriculum } from "@/app/search/actions"

export default async function MainPage() {

    const courses = await getFavCourses()

    const curriculum = await getCurriculum()


    return (
        <ClientPage favoriteCourses={courses} curriculum={curriculum} />
    )
}
