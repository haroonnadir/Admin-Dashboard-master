"use client"
import { useState, useEffect } from "react"
import { getDocs, collection, query,addDoc, where, deleteDoc, doc, updateDoc} from "firebase/firestore"
import { db } from "@/config/firebase"
import React from 'react'
import Student from "../student/page";

export default function Courses() {
    const [courses, setCourses] = useState([])
    const [selectedCourse,setSeletedCourse]=useState(null)
    const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);
  const onSubmitHanlder=async()=>{
    let course={
      courseName:courseName,
      courseCode,
      description
    }
    try {
        const collectionName=collection(db,"course")
        console.log(collectionName)
        if(course.courseName===""||course.courseCode===""||course.description===""){
            alert("please Fill all field")
        }
        else{
          let matchCode=false;
          for( const crs of courses)
          {
            if(crs.courseCode===course.courseCode)
            {
              matchCode=true;
              break;
            }
          }
          if(matchCode)
          {
            alert("course Code already Exist")
          }
          else{
            await addDoc(collectionName,course)
        console.log("document added");
        await fetchDocs()
          }
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    const fetchDocs = async ()=> {
        try {
          setLoading(true)
          const collectionName = collection(db, "course")
          const docs = await getDocs(collectionName)
          const courseData = []
          docs.forEach((doc)=>{
            courseData.push({
              id:doc.id,
              ...doc.data()
            })
          })
          setCourses(courseData)
          
          console.log("students",courseData)
          setLoading(false)
        } catch (error) {
          console.log("error",error);
        }
      }
      const openModal=async(course)=>{
          setSeletedCourse(course);
          setCourseName(course.courseName ||"");
          setCourseCode(course.courseCode ||"");
          setDescription(course.description ||"");
      }
      const closeModal=async()=>{
          setSeletedCourse(null)
      }
      useEffect(() => {
       fetchDocs()
      }, [])
      const onDeletHandler = async (id)=>{
        const docRef = doc(db,"course", id )
    
       try {
        await deleteDoc(docRef)  
        const newCourses = courses.filter((course)=>id !== course.id)
        setCourses(newCourses)
       } catch (error) {
        alert("error")
       }
      }
    
      const UpdateHandler = async ()=>{
        try {
          const docRef = doc(db,"course", selectedCourse.id)
          await updateDoc(docRef, {
            courseName,
            courseCode,
            description
          })
          closeModal()
          fetchDocs()

          setLoading(false)
        } catch (error) {
          console.log("error",error)
        }
      }
  return (
    <div>
      <p className="text-gray-700 text-3xl mb-16 font-bold">Dashboard</p>

{/* <div className="grid lg:grid-cols-3 gap-5 mb-16">
  <div className="rounded text-white text-center pt-5 text-2xl font-bold bg-green-600 h-40 shadow-sm">Total Students <br/> {Student.length}</div>
  <div className="rounded text-white text-center pt-5 text-2xl font-bold bg-red-600 h-40 shadow-sm">Total  Courses <br/>{courses.length}</div>
  <div className="rounded text-white text-center pt-5 text-2xl font-bold bg-blue-600 h-40 shadow-sm">Attendence <br/> 10</div>
</div> */}
<div className="grid col-1 bg-white h-auto shadow-sm">
<div className='py-8 '>
    <div>
       <label htmlFor='Name' className='pl-10 pr-5 my-1 text-lg'>Course Name:</label><input className='border rounded my-1 px-3 py-1' id='Name' type="text" placeholder="Enter courseName"  onChange={(e)=> setCourseName(e.target.value)}  /><br/>
       <label htmlFor='course' className='pl-10 pr-3 my-1 text-lg'>Course Code:</label><input className='border my-1 rounded px-3 py-1' type="email" placeholder="Enter CourseCode" id='Course' onChange={(e)=> setCourseCode(e.target.value)}  /><br/>
       <label htmlFor='email' className='pl-10 pr-5 my-1 text-lg'>Description:</label> <input className='border my-1 rounded px-3 py-1' id='email' type="email" placeholder="Enter Description"  onChange={(e)=> setDescription(e.target.value)}  />
       </div>
       <div className='text-center mx-auto'><button className="bg-red-500 mx-auto hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4" onClick={onSubmitHanlder}>Add Course</button>
       </div>
       </div>
{/* <div className="mx-auto text-center mt-5"><button className="bg-blue-500 text-white py-2 px-4 w-32 h-10 rounded-md hover:bg-blue-600">
        Add Student
      </button></div> */}
<div class="relative overflow-x-auto py-10">
    <table class="w-full text-sm text-left text-black dark:text-gray-400">
        <thead class="text-md bg-black text-white  uppercase dark:text-gray-400">
            <tr>
                
                <th scope="col" class="px-6 py-3">
                    Course Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Course Code
                </th>
                <th scope="col" class="px-6 py-3">
                    Description
                </th>
                <th scope="col" class="px-6 py-3">
                    Options
                </th>
            </tr>
        </thead>
        <tbody>
        {loading ? (
              <tr className="text-center">
                <td colSpan="4" className="text-xl text-orange-900 font-bold mt-10">
                  Loading...
                </td>
              </tr>
            ) : (courses.map((course,i)=>{console.log(course)
                return<tr key={i} class="bg-white dark:bg-gray-800">
                <td class="px-4 py-4">
                    {course.courseName}
                </td>
                <td class="px-4 py-4">
                    {course.courseCode}
                </td>
                <td class="px-4 py-4">
                    {course.description}
                </td>
                <td class="px-4 py-4 flex space-x-3">
                   <button onClick={()=>onDeletHandler(course.id)} className=' text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl mx-1'>Delete</button>
                   <button onClick={()=>openModal(course)} className=' text-white bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl mx-1'>Update</button>
                </td>
            </tr>
})
            )}
            
            
            
            
        </tbody>
    </table>
</div>
{selectedCourse && <div id="updateProductModal" tabindex="-1" className=" flex  rounded-3xl overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
          <div className="relative shadow-lg rounded-2xl shadow-slate-800  w-full max-w-2xl h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-slate-300 rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* <!-- Modal header --> */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Course
                </h3>
                <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body -->  */}
              <form action="#" >
                <div className=" mb-4  my-auto">
                  <div className='py-8 mx-auto text-center'>
                    <div>
                      <label htmlFor='courseName' className='pl-10 pr-5 my-1 text-lg'>Course Name:</label>
                      <input className='md:w-3/6 border rounded my-1 px-3 py-1' id='courseName' value={courseName} type="text"  onChange={(e) => setCourseName(e.target.value)} />
                    </div>
                    
                    <div>
                      <label htmlFor='courseCode' className='pl-10 pr-3 my-1 text-lg'>Course Code:</label>
                      <input className='md:w-3/6 border my-1 rounded px-3 py-1' type="text" value={courseCode} id='Course' onChange={(e) => setCourseCode(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor='courseDescription' className='pl-10 pr-5 my-1 text-lg'>Description:</label>
                      <input className='md:w-3/6 border my-1 rounded px-3 py-1' id='courseDescription' value={description} type="text" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex text-center items-center space-x-4 mx-auto">
                  <button type="button" onClick={ UpdateHandler} className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>}
</div>
    </div>
  )
}
