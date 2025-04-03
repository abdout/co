'use client';

import { ModalProvider } from './context';

export default function ModalProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
} 