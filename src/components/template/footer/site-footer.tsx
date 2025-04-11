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
    <footer className="bg-primary text-background py-8 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex mb-16">
          <div className="w-[27%]">
            <NewsLetter />
          </div>
        <div className="flex w-[73%] justify-between">
          <div>
            <h3 className="text-base font-medium mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-background/70 hover:text-background transition-colors"
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
                    className="text-base text-background/70 hover:text-background transition-colors"
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
                    className="text-base text-background/70 hover:text-background transition-colors"
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
                    className="text-base text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
        <div className="pt-14">
          <div className="flex flex-col md:flex-row items-start">
            {/* <Link href="/" className="w-[26.5%] text-background font-bold text-xl mb-4 md:mb-0">
              <span className="text-2xl font-fabriga">company</span>
            </Link> */}
            <Link href="/" className="w-[26.5%] text-background font-bold flex items-center">
            <span className="text-xl font-fabriga">company</span>
          </Link>

              <div className="w-[73.5%] text-xs  text-background/70 mt-2 ">
              © 2025 COMPANY Ltd. /
              <Link href="/terms-of-use" className="hover:text-background/70 transition-colors ml-1 mr-1">
                Terms
              </Link> /
              <Link href="/privacy-policy" className="hover:text-background/70 transition-colors ml-1 mr-1">
                Privacy
              </Link> /
              <br />
              <Link href="/safety" className="hover:text-background/70 transition-colors ml-1 mr-1">
                Safety
              </Link> /
              <Link href="/status" className="hover:text-background/70 transition-colors ml-1">
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
