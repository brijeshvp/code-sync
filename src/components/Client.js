// 'rfce'
import React from 'react'
import Avatar from 'react-avatar'
Avatar
function Client({username}) {
  return (
    <div className='client'>
        {/* avatar */}
        <Avatar name={username} size={50} round="14px" /> 
        <span className='userName'>{username}</span>
    </div>
  )
}

export default Client