'use client';

import { useState, useMemo } from "react";
import { columns } from "./column";
import { UserTable } from "./user-table";
import { ModalProvider } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";

export default function AllUsers({ users: initialUsers, currentUserId }: { users: any[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);

  // Callback to update a user's applicationStatus
  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, applicationStatus: newStatus } : user
      )
    );
  };

  // Callback to update a user's role
  const updateUserRole = (userId: string, newRole: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Combined status options in Arabic
  const statusOptions = [
    { value: "ALL", label: "الكل" },
    { value: "COMPLETED", label: "مكتمل" },
    { value: "INCOMPLETE", label: "ناقص" },
    { value: "APPROVED", label: "مقبول" },
    { value: "REJECTED", label: "مرفوض" },
    { value: "NO_RESPONSE", label: "بدون رد" },
  ];

  // Role options in Arabic
  const roleLabel = (role: string) => {
    if (role === "ADMIN") return "مشرف";
    if (role === "USER") return "عضو";
    return role;
  };
  const allRoles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(users.map(u => u.role).filter(Boolean)));
    return ["ALL", ...uniqueRoles];
  }, [users]);
  const roleOptions = allRoles.map(role => ({ value: role, label: role === "ALL" ? "الكل" : roleLabel(role) }));

  // State for filters
  const [status, setStatus] = useState<string>("ALL");
  const [role, setRole] = useState<string>("ALL");

  // Filter users based on selected status and role
  const filteredUsers = users.filter((user) => {
    // Status filter
    let statusMatch = true;
    switch (status) {
      case "COMPLETED":
        statusMatch = user.onboardingStatus === "COMPLETED";
        break;
      case "INCOMPLETE":
        statusMatch = user.onboardingStatus === "PENDING" || user.onboardingStatus === "IN_PROGRESS";
        break;
      case "APPROVED":
        statusMatch = user.applicationStatus === "APPROVED";
        break;
      case "REJECTED":
        statusMatch = user.applicationStatus === "REJECTED";
        break;
      case "NO_RESPONSE":
        statusMatch = !user.applicationStatus || user.applicationStatus === "PENDING";
        break;
      default:
        statusMatch = true;
    }
    // Role filter
    const roleMatch = role === "ALL" || user.role === role;
    
    return statusMatch && roleMatch;
  });

  // Create table columns with the callbacks
  const userColumns = useMemo(
    () => columns(updateUserStatus, updateUserRole), 
    [updateUserStatus, updateUserRole]
  );

  return (
    <ModalProvider>
      <div className="scroll-x">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed mt-8 p-8 text-center">
            <h2 className="text-2xl font-semibold">لا يوجد مستخدمون</h2>
            <p className="text-muted-foreground max-w-[500px] mt-2">
              لا يوجد مستخدمون مسجلون بعد.
            </p>
          </div>
        ) : (
          <UserTable 
            columns={userColumns} 
            data={filteredUsers}
            statusOptions={statusOptions}
            roleOptions={roleOptions}
            onStatusChange={setStatus}
            onRoleChange={setRole}
            currentStatus={status}
            currentRole={role}
          />
        )}
      </div>
    </ModalProvider>
  );
} 