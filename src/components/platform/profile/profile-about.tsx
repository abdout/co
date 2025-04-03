interface ProfileAboutProps {
  user: {
    bio: string | null;
    currentCountry: string | null;
    currentLocality: string | null;
    currentNeighborhood: string | null;
    email: string | null;
    whatsapp: string | null;
  };
}

export function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <div className="p-4 bg-background rounded-lg shadow-sm border mt-2">
      <h2 className="text-xl font-bold mb-4">نبذة شخصية</h2>
      <p className="text-muted-foreground">
        {user.bio || "لا توجد معلومات متاحة"}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="font-semibold mb-2">المعلومات الشخصية</h3>
          <ul className="space-y-2">
            <li>
              <span className="text-muted-foreground">الدولة: </span>
              <span>{user.currentCountry || "غير محدد"}</span>
            </li>
            <li>
              <span className="text-muted-foreground">المحلية: </span>
              <span>{user.currentLocality || "غير محدد"}</span>
            </li>
            <li>
              <span className="text-muted-foreground">الحي: </span>
              <span>{user.currentNeighborhood || "غير محدد"}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">معلومات الاتصال</h3>
          <ul className="space-y-2">
            <li>
              <span className="text-muted-foreground">البريد الإلكتروني: </span>
              <span>{user.email || "غير محدد"}</span>
            </li>
            <li>
              <span className="text-muted-foreground">واتساب: </span>
              <span>{user.whatsapp || "غير محدد"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 