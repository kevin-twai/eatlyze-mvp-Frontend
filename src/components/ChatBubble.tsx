import { ReactNode } from 'react'
export default function ChatBubble({ role='assistant', children }:{role?:'user'|'assistant',children:ReactNode}){
  const isUser = role==='user'
  return <div className={`w-full flex my-2 ${isUser?'justify-end':'justify-start'}`}>
    <div className={`max-w-[720px] px-4 py-3 rounded-2xl text-sm shadow-soft ${isUser?'bg-white text-black':'bg-white/5 text-white'}`}>{children}</div>
  </div>
}