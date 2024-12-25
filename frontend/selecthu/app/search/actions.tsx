"use server"

// import { cookies } from "next/headers"
import { auth } from "@/auth"

function convertSelection(data) {
    return {
        b: [0, data.b1, data.b2, data.b3],
        x: [0, data.x1, data.x2, data.x3],
        r: [data.r0, data.r1, data.r2, data.r3],
        t: [0, data.t1, data.t2, data.t3],
        total: data.total,
    }
}

function convertCourse(data) {
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
          selection: convertSelection(data.selection),
      }
}

function convertCourseList(listData) {
    return listData.map(convertCourse)
}

export async function searchCourses(filters) {
    try {
        console.log(filters)
        const session = await auth()
        // console.log("SESSION", session)
        const jwt = session.user.backend_jwt
        /* const cookieStore = await cookies()
        const jwt = cookieStore.get("jwt-token").value */
        var url = process.env.BACKEND_URL + "/courses/?search-mode=fuzzy"
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
        console.log(json["courses-main"])
        return convertCourseList(json["courses-main"])
    } catch (error) {
        console.log(error.message)
        return error.message
    }
    // const json = await res.json()

    // return json
}

export async function getFavCourses() {
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

    const courses = convertCourseList(listData)
    return courses
}

export async function setCourseStatus(courseId, status) {
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
            "condition": status,
        }),
    })

    console.log(res)
}

export async function addCourse(courseId) {
    setCourseStatus(courseId, "favorite")
}

export async function removeCourse(courseId) {
    setCourseStatus(courseId, "dismiss")
}
