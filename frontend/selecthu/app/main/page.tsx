import ClientPage from "./page2"
import { auth } from "@/auth"

import { getFavCourses, getSelectedCourses, getCurriculum } from "@/app/search/actions"

export default async function MainPage() {

    const courses = await getFavCourses()

    const curriculum = await getCurriculum()

    const selCourses = await getSelectedCourses()

    return (
        <ClientPage favoriteCourses={courses} selCourses={selCourses} curriculum={curriculum} />
    )
}
