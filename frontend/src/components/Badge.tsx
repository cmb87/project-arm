import React from 'react'

interface IBadge{
    title: string
}


export default function Badge({title}:IBadge) {

  //var randomColor = Math.floor(Math.random()*16777215).toString(16);
  
 
  return (
    <span className={`bg-purple-900 text-purple-300 text-xs font-medium mr-1 px-1.5 py-0.5 rounded`}>{title}</span>
  )
}
