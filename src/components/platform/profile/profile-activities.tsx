interface ProfileActivitiesProps {
  user: {
    partyMember: boolean | null;
    partyName: string | null;
    unionMember: boolean | null;
    unionName: string | null;
    ngoMember: boolean | null;
    ngoName: string | null;
    ngoActivity: string | null;
    clubMember: boolean | null;
    clubName: string | null;
    clubType: string | null;
  };
}

export function ProfileActivities({ user }: ProfileActivitiesProps) {
  return (
    <div className="p-4 bg-background rounded-lg shadow-sm border mt-2">
      <h2 className="text-xl font-bold mb-4">النشاطات</h2>
      
      <div className="space-y-6">
        {user.partyMember && (
          <div className="border-b pb-4">
            <h3 className="font-semibold">نشاط سياسي</h3>
            <p>{user.partyName || ""}</p>
          </div>
        )}
        
        {user.unionMember && (
          <div className="border-b pb-4">
            <h3 className="font-semibold">نشاط نقابي</h3>
            <p>{user.unionName || ""}</p>
          </div>
        )}
        
        {user.ngoMember && (
          <div className="border-b pb-4">
            <h3 className="font-semibold">نشاط اجتماعي</h3>
            <p>{user.ngoName || ""}</p>
            <p>{user.ngoActivity || ""}</p>
          </div>
        )}
        
        {user.clubMember && (
          <div className="pb-4">
            <h3 className="font-semibold">نشاط شبابي</h3>
            <p>{user.clubName || ""}</p>
            <p>{user.clubType || ""}</p>
          </div>
        )}
        
        {!user.partyMember && !user.unionMember && 
          !user.ngoMember && !user.clubMember && (
          <p className="text-muted-foreground">لا توجد نشاطات متاحة</p>
        )}
      </div>
    </div>
  );
} 