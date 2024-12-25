import ClientPage from "./page2"
import { auth } from "@/auth"

export default async function MainPage() {
    const session = await auth()
    const jwt = session.user.backend_jwt
    const list = await fetch(process.env.BACKEND_URL + "/courses-favorite", {
        headers: {
            "Authorization": "Bearer " + jwt,
        },
    })

    const json = await list.json()
    const listData = json["courses-favorite"]

    console.log(json)

    const courses = listData.map((data) => {
        return {
              id: data.course_id,
              courseNumber: data.code,
              sequenceNumber: data.number,
              name: data.name,
              teacher: data.teacher,
              credits: data.credit,
              department: data.department,
              time: "tbd",
              classroom: "not known",
              type: "not known",
              timeSlots: data.time.map((time) => {
                  return {
                      day: time.d,
                      start: time.t0,
                      duration: 2
                  }
              }),
              teachingInfo: "none",
              teacherInfo: "none",
              comments: [],
          }
    })

    console.log(courses)

    return (
        <ClientPage favoriteCourses={courses}/>
    )
}
