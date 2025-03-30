import React from 'react'
import { Icon } from "@iconify/react";
import Link from 'next/link'

interface GithubButtonProps {
    url: string;
}
const GithubButton = ({ url }: GithubButtonProps) => {
    return (
        <Link
            href={url} 
            className='absolute top-8 right-10 reveal-less'>
            <Icon icon="bi:github" width={30} />
        </Link>
    )
}

export default GithubButton