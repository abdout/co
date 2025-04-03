interface ProfileEducationProps {
  user: {
    educationLevel: string | null;
    institution: string | null;
    major: string | null;
    yearOfCompletion: string | null;
  };
}

export function ProfileEducation({ user }: ProfileEducationProps) {
  return (
    <div className="p-4 bg-background rounded-lg shadow-sm border mt-2">
      <h2 className="text-xl font-bold mb-4">المعلومات التعليمية</h2>
      
      {(user.educationLevel || user.institution) ? (
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">{user.educationLevel || "التعليم"}</h3>
            <p className="text-muted-foreground">{user.institution || ""}</p>
            <p className="text-sm text-muted-foreground">{user.major || ""}</p>
            <p className="text-sm text-muted-foreground">
              {user.yearOfCompletion ? `سنة التخرج: ${user.yearOfCompletion}` : ""}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">لا توجد معلومات تعليمية متاحة</p>
      )}
    </div>
  );
} 