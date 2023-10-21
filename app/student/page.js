
"use client"
import React from 'react';

import { useState, useEffect } from "react"
import { getDocs, collection, query, where, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "@/config/firebase"

import Courses from '../courses/page';

export default function Student() {

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [course, setCourse] = useState("")
  const [studentId, setStudentId] = useState(null)
  const onSubmitHanlder = async () => {
    let student = {
      name: userName,
      studentId,
      email,
      course
    }
    try {
      const collectionName = collection(db, "student")
      if (student.name === "" || student.email === "" || student.course === "" || student.studentId === null) {
        alert("please Fill all field")
      }
      else {
        let emailMatch = false;
        for (const std of students) {
          if (student.email === std.email) {
            emailMatch = true;
            break;
          }
        }
        if (emailMatch) {
          alert("email already exist")
        }
        else {
          addDoc(collectionName, student)
          await fetchDocs()
        }


      }

    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }
  const closeModal = () => {
    setSelectedStudent(null)
  }
  const openModal = (items) => {
    console.log("items", items.course,items.name)
    setSelectedStudent(items)

    setCourse(items.course ||" ")
    setEmail(items.email ||" ")
    setStudentId(items.studentId ||" ")
    setUserName(items.name ||" ")
  }
  const [students, setStudents] = useState([])
  const fetchDocs = async () => {
    try {
      setLoading(true)
      const collectionName = collection(db, "student")
      const docs = await getDocs(collectionName)
      const studentsData = []
      docs.forEach((doc) => {
        studentsData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setStudents(studentsData)
      setLoading(false)
      return students

    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    fetchDocs()
  }, [])
  const onDeletHandler = async (id) => {
    const docRef = doc(db, "student", id)

    try {
      await deleteDoc(docRef)

      const newStudents = students.filter((student) => id !== student.id)
      setStudents(newStudents)
    } catch (error) {
      alert("error")
    }
  }
  const UpdateHandler = async () => {
    if (!selectedStudent) {
      return
    }
    try {
      const docRef = doc(db, "student", selectedStudent.id)
      await updateDoc(docRef, {
        name:userName,
        studentId,
        email,
        course
      })
      closeModal();
      fetchDocs();
    } catch (error) {
      console.log("error", error)
    }
  }

  
  return (

    <div>
      <p className="text-gray-700 text-3xl mb-16 font-bold">Dashboard</p>

      {/* <div className="grid lg:grid-cols-3 gap-5 mb-16">
        <div className="rounded text-white  text-center pt-5 text-2xl font-bold bg-green-600 h-40 shadow-sm">Total Students <br />{students.length}</div>
        <div className="rounded text-white  text-center pt-5 text-2xl font-bold bg-red-600 h-40 shadow-sm">Total Courses <br />{Courses.length}</div>
        <div className="rounded text-white  text-center pt-5 text-2xl font-bold bg-blue-600 h-40 shadow-sm">Attendence <br />20</div>
      </div> */}
      <div className="grid col-1 bg-white h-auto shadow-sm pb-20">


        <div className="bg-white p-4 rounded-lg shadow-md">

          <h2 className="text-xl font-semibold mb-2 text-center">Add Student</h2>

          <div className='py-8'>
            <label htmlFor='Name' className='pl-10 pr-5 my-1 text-lg'>Name:</label><input className='border rounded my-1 px-3 py-1' id='Name' type="text" placeholder="Enter name" onChange={(e) => setUserName(e.target.value)} /><br />
            <label htmlFor='id' className='pl-10 pr-5 my-1 text-lg'>Std Id:</label><input className='border  rounded my-1 px-3 py-1' id='id' type="number" placeholder="Enter id" value={studentId} onChange={(e) => setStudentId(e.target.value)} /><br />
            <label htmlFor='course' className='pl-10 pr-3 my-1 text-lg'>Course:</label><input className='border my-1 rounded px-3 py-1' type="email" placeholder="Enter Course" id='Course' onChange={(e) => setCourse(e.target.value)} /><br />
            <label htmlFor='email' className='pl-10 pr-5 my-1 text-lg'>Email:</label> <input className='border my-1 rounded px-3 py-1' id='email' type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='text-center mx-auto'><button className="bg-red-500 mx-auto hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4" onClick={onSubmitHanlder}>Add Student</button>
          </div>





        </div>
        <div className="relative overflow-x-auto">
          <table style={{zIndex:"999"}} className="min-w-full text-sm text-left text-black dark:text-gray-400">
            <thead className="text-md bg-black text-white  uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Course
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
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
            ) : (students.map((student, i) => {

                return <tr key={i} className="bg-white dark:bg-gray-800">
                  <td scope="row" className="px-4 py-4   dark:text-white">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-4">
                    {student.name}
                  </td>
                  <td className="px-4 py-4">
                    {student.course}
                  </td>
                  <td className="px-4 py-4">
                    {student.email}
                  </td>
                  <td className="px-4 py-4 flex space-x-3">
                    <button onClick={() => onDeletHandler(student.id)} className=' text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl mx-1'>Delete</button>
                    <button onClick={() => openModal(student)} className=' text-white bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl mx-1'>Update</button>
                  </td>
                </tr>
              }))}
            </tbody>
          </table>
        </div>
        {selectedStudent && <div id="updateProductModal" tabindex="-1" className=" flex  rounded-3xl overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
          <div className="relative shadow-lg rounded-2xl shadow-slate-800  w-full max-w-2xl h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-slate-300 rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* <!-- Modal header --> */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Student
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
                      <label htmlFor='Name' className='pl-10 pr-5 my-1 text-lg'>Name:</label>
                      <input className='md:w-3/6 border rounded my-1 px-3 py-1' id='Name' value={userName} type="text"  onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor='studentId' className='pl-10 pr-5 my-1 text-lg'>Std Id:</label>
                      <input className='md:w-3/6 border rounded my-1 px-3 py-1' id='studentId' type="number" value={studentId}  onChange={(e) => setStudentId(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor='course' className='pl-10 pr-3 my-1 text-lg'>Course:</label>
                      <input className='md:w-3/6 border my-1 rounded px-3 py-1' type="email" value={course} id='Course' onChange={(e) => setCourse(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor='email' className='pl-10 pr-5 my-1 text-lg'>Email:</label>
                      <input className='md:w-3/6 border my-1 rounded px-3 py-1' id='email' value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
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
