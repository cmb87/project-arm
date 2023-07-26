import React, {useState} from 'react'

interface ISlider {
    name: string
    value: string
    setValue: Function
    max?: string
    min?: string
    step?: string
    nameAppendix?: string
}


export default function Slider({name, value, setValue, max, min ,step, nameAppendix}:ISlider) {
  const [valueLocal, setValueLocal] = useState<string>(value);

  return (
    <>
        <label
          htmlFor={`${name}-id`}
          className="block mb-2 text-sm font-medium text-gray-900">
            {name}: {valueLocal} {nameAppendix}
        </label>
        <input
          id={`${name}-id`}
          type="range"
          value={valueLocal}
          min={min ? min : 0}
          max={max ? max : 100}
          step={step ? step : "1"}
          onChange={(e) => setValueLocal(e.target.value)}
          onMouseUp={(e) => setValue(valueLocal)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
        </input>
    </>
  )
}
