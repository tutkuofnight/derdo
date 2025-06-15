"use client"
import { useAtom, stepsManager } from "@/store"
import { Check } from "lucide-react"

const Circle = ({ num } : { num: number }) => {
  const [steps, setSteps] = useAtom(stepsManager)
  
  const goStepBack = () => {
    if (steps?.currentStep! > num) {
      setSteps((stepsData) => stepsData ? { ...stepsData, currentStep: num } : stepsData)
    }
  }

  return (
    <div className={`step-line 
      relative w-[50px] h-[50px] grid place-items-center text-2xl rounded-full bg-transparent border border-white 
      ${steps?.currentStep == num && "bg-white text-black"} 
      ${steps?.currentStep !== num && "opacity-50"}
      ${steps?.currentStep! > num && "cursor-pointer bg-white text-black"}  
    `} onClick={goStepBack}>
      { steps?.currentStep! > num ? <Check /> : num }
    </div>
  )
}

export default function Steps({ className }: { className?: string  }){
  const [steps,] = useAtom(stepsManager)
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <div className="my-3">
        <div className="flex items-center gap-10 w-full">
          {
            steps?.totalSteps.map((step, i) => (
              <div className="flex flex-col items-center gap-2" key={i}>
                <Circle num={i + 1} />
                <span className={`${steps.currentStep == (i + 1) ? "font-bold" : null}`}>{ step }</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}