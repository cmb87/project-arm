import React, { useEffect } from 'react'

interface IButton {
  title?: string
  onClick?: Function
  disabled?: boolean
  style?: string
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset';
}


export default function Button(props: IButton) {
  
  let className = `bg-purple-900 hover:bg-purple-700 duration-150 ease-in-out text-white font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-purple-900 shadow-md`;


  switch (props.style) {
    case 'primary':
      className = `bg-purple-900 hover:bg-purple-700 duration-150 ease-in-out text-white font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-purple-900 shadow-md`;
      break;
    case 'secondary':
      className = `bg-gray-700 hover:bg-gray-400 duration-150 ease-in-out text-white font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-gray-300 shadow-md`;
      break;
      case 'tertiary':
        className = `bg-gray-100 hover:bg-gray-400 duration-150 ease-in-out text-gray-800 font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-gray-300 shadow-md border border-gray-400`;
        break;
    case 'warning':
      className = `bg-red-900 hover:bg-red-700 duration-150 ease-in-out text-white font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-red-900 shadow-md`;
      break;
    default:

  }


  //const className = `bg-${colorBg} hover:fill-${colorHover} duration-150 ease-in-out text-white font-bold py-2 px-4 rounded-xl disabled:opacity-75 disabled:bg-${colorDisabled} shadow-md`;
  

  return (
    <button
      type={props.type ? props.type : "button"}
      className={className}
      onClick={() => props.onClick ? props.onClick(): {}}
      disabled={props.disabled}
    >
      {props.title}{props.children}
    </button>
  )
}
