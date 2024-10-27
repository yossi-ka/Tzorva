import React, { useEffect, useContext } from 'react'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom'
// import { getArchive } from '../data-base/select'

function Archive() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

useEffect(() => {
  const access_permissions = user.access_permissions;
  if (!access_permissions?.archive) {
    navigate(-1);
  }
  document.title = "ארכיון"
}, [ navigate, user ]);

  return (
    <div>Archive</div>
  )
}

export default Archive