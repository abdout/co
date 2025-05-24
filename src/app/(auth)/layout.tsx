
const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-screen flex items-center justify-center px-6">
      {children}
    </div>
   );
}
 
export default AuthLayout;