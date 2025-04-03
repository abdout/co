interface ProfileSkillsProps {
  user: {
    skills: string[] | null;
    interests: string[] | null;
  };
}

export function ProfileSkills({ user }: ProfileSkillsProps) {
  return (
    <div className="p-4 bg-background rounded-lg shadow-sm border mt-2">
      <h2 className="text-xl font-bold mb-4">المهارات</h2>
      
      {(user.skills && user.skills.length > 0) ? (
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">لا توجد مهارات متاحة</p>
      )}
      
      <h2 className="text-xl font-bold mt-6 mb-4">الاهتمامات</h2>
      
      {(user.interests && user.interests.length > 0) ? (
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest, index) => (
            <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
              {interest}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">لا توجد اهتمامات متاحة</p>
      )}
    </div>
  );
} 