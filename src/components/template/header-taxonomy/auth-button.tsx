'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/components/auth/use-current-user';
import { LoginButton } from '@/components/auth/login-button';
import { LogoutButton } from '@/components/auth/logout-button';
import Link from 'next/link';
import { ExitIcon } from '@radix-ui/react-icons';

export const AuthButton = () => {
  const user = useCurrentUser();

  if (user) {
    return (
      <LogoutButton>
        <span
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4 cursor-pointer"
          )}
        >
          Logout
        </span>
      </LogoutButton>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "px-4"
      )}
    >
      Login
    </Link>
  );
}; 