import React from 'react'


interface IJsonViewer {
    json: object
}

export default function JsonViewer({json}:IJsonViewer) {
  return (
    <pre>{JSON.stringify(json, null, 2) }</pre>
  )
}
