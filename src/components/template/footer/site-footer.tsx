import Link from "next/link";
import NewsLetter from "./newsletter";

const footerLinks = {
  services: [
    { label: "Testing", href: "/services/high-voltage" },
    { label: "Commissioning", href: "/services/commissioning" },
    { label: "Protection", href: "/services/protection-systems" },
    { label: "Installation", href: "/services/design" },
    { label: "Transformers", href: "/services/transformer" },
    { label: "Cables", href: "/services/cable-termination" }
  ],
  solutions: [
    { label: "Power Gen", href: "/solutions/power-generation" },
    { label: "Industrial", href: "/solutions/industrial" },
    { label: "Commercial", href: "/solutions/commercial" },
    { label: "Renewable", href: "/solutions/renewable" }
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" },
    { label: "Certificates", href: "/certifications" },
    { label: "Projects", href: "/case-studies" }
  ],
  resources: [
    { label: "Rental", href: "/rental" },
    { label: "Knowledge", href: "/resources/knowledge" },
    { label: "Standards", href: "/resources/standards" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" }
  ]
};

export function SiteFooter() {
  return (
    <footer className="bg-primary text-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Newsletter and Links Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 mb-16">
          {/* Newsletter Section */}
          <div className="w-full lg:w-[27%] mb-8 lg:mb-0 flex justify-center lg:justify-start">
            <div className="w-full max-w-sm lg:max-w-none">
              <NewsLetter />
            </div>
          </div>
          
          {/* Links Section */}
          <div className="w-full lg:w-[73%]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 px-4 sm:px-8 lg:px-0 text-center lg:text-left">
              <div>
                <h3 className="text-base font-medium mb-4">Services</h3>
                <ul className="space-y-2">
                  {footerLinks.services.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm lg:text-base text-background/70 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Solutions</h3>
                <ul className="space-y-2">
                  {footerLinks.solutions.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm lg:text-base text-background/70 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm lg:text-base text-background/70 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  {footerLinks.resources.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm lg:text-base text-background/70 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 lg:pt-14 border-t border-background/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
                        <Link href="/" className="w-full lg:w-[26.5%] text-background font-bold items-center justify-center lg:justify-start mb-4 lg:mb-0 hidden lg:flex">              <span className="text-xl font-fabriga">company</span>            </Link>

            <div className="w-full lg:w-[73.5%] text-xs text-background/70">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1">
                <span>© 2025 COMPANY Ltd.</span>
                <span className="hidden sm:inline">/</span>
                <Link href="/terms-of-use" className="hover:text-background transition-colors">
                  Terms
                </Link>
                <span className="hidden sm:inline">/</span>
                <Link href="/privacy-policy" className="hover:text-background transition-colors">
                  Privacy
                </Link>
                <span className="hidden sm:inline">/</span>
                <Link href="/safety" className="hover:text-background transition-colors">
                  Safety
                </Link>
                <span className="hidden sm:inline">/</span>
                <Link href="/status" className="hover:text-background transition-colors">
                  Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
