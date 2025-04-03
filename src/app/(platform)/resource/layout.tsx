"use client";

export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="py-4">{children}</main>
    </>
  );
}