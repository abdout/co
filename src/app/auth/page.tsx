import GithubButton from '@/components/atom/github-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Auth = () => {
  return (
    <>
    <GithubButton url="https://github.com/abdout/auth" />
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="space-y-4 text-center">
        <div className="flex justify-center items-center space-x-2">
      <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="h-11 w-11 fill-current"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h1 className="text-5xl font-extrabold">Auth</h1>
        </div>
        

        <p className=" text-lg font-light text-neutral-600">
          An authentication and authorization block. 
        </p>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link href="/auth/login">
            <Button className='w-20' variant="outline">Login</Button>
          </Link>
          <Link href="/auth/join">
            <Button  className='w-20'>Join</Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Auth