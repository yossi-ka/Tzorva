import React, { useEffect } from 'react'

function Students() {
    useEffect(() => {
        document.title = "ניהול תלמידים"
    }, [])
  return (
    <div>Students</div>
  )
}

export default Students