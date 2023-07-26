import React, {useState} from 'react'


interface ITags {
    tags: string[]
    setTags: Function
    title?: string
}


export default function Tags({tags, setTags, title}: ITags) {


  function handleKeyDown(e:any){
    if(e.key !== 'Enter') return
    let value = e.target.value
    if(!value.trim()) return

    value = value.replace(/\\/g, "/").split('/');
    setTags([...tags, ...value])
    e.target.value = ''
  }

  function removeTag(index: number){
        setTags(tags.filter((el, i) => i !== index))
  }
  return (

    <div>
        { title && <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">{title}</label> }
    
        <div
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-800 block w-full p-2 overflow-y-auto h-17'
          id="tags"
        >
            { tags.map((tag, index) => (

                <span
                className="bg-purple-900 text-purple-300 text-xs font-medium mr-1 px-1 py-0.5 rounded mt-3"
                key={index}
                >
                    <span className="text">{tag}</span>
                      <span
                        className="mx-1"
                        style={{cursor: 'pointer'}}
                        onClick={() => removeTag(index)}
                      >
                    &times;
                    </span>
                </span>

            )) }
            <input
              onKeyDown={handleKeyDown}
              type="text"
              pattern="[A-Za-z0-9]:[A-Za-z0-9]"
              className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              placeholder="Add tag or path"
            />
        </div>
    </div>
  )
}


