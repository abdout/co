import TaxonomyHeader from "@/components/template/header-taxonomy/taxonomy-header";


interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center ">
      <TaxonomyHeader />
      {children}
    </div>
   );
}
 
export default ProtectedLayout;