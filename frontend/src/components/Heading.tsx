import React from 'react'

interface IHeading {
  title: string
  size?: number
}



export default function Heading({title, size}: IHeading) {

  const sizeVar = size ? size : "3";

  return (
    <h1
      className={`mb-4 text-${sizeVar}xl font-extrabold leading-none tracking-tight text-gray-600 md:text-${sizeVar}xl lg:text-${sizeVar}xl`}
    >
      {title}
    </h1>
  )
}
