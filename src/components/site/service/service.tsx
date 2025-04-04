'use client'
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { 
  CheckCircle,
  Wrench,
  ArrowRight,
  Phone,
  ChevronRight,
  List
} from "lucide-react";
import { servicesItems } from "./constant";
import { Timeline } from "@/components/template/timeline/timeline";

export function ServiceDetailPage() {
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get("id");
  const [activeService, setActiveService] = useState(serviceIdParam || servicesItems[0].id);
  const [activeSection, setActiveSection] = useState("overview");
  
  const overviewRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const advantagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (serviceIdParam) {
      setActiveService(serviceIdParam);
    }
  }, [serviceIdParam]);

  // Observe which section is currently in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = [
      overviewRef.current,
      featuresRef.current,
      processRef.current,
      advantagesRef.current
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedService = servicesItems.find(service => service.id === activeService) || servicesItems[0];
  const Icon = selectedService.icon;

  return (
    <section className="py-16 bg-primary text-white">
      <div className="">
        {/* Hero Banner */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src={selectedService.image} 
              alt={`${selectedService.title.firstLine} ${selectedService.title.secondLine}`}
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 pt-14 pl-8 h-80 text-background">
            {/* <h4 className="text-primary-foreground/80 text-lg mb-2">Our Services</h4> */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="block">{selectedService.title.firstLine}</span>
              <span className="block">{selectedService.title.secondLine}</span>
            </h1>
            <p className="max-w-2xl text-lg text-white/90 mb-8">
              <span className="block">{selectedService.description.firstLine}</span>
              <span className="block">{selectedService.description.secondLine}</span>
            </p>
            <div className="flex justify-end space-x-2 m-4">
              {servicesItems.map(service => {
                const ServiceIcon = service.icon;
                const isActive = service.id === activeService;
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setActiveService(service.id);
                    }}
                    className={`flex flex-col items-center text-center text-xs p-1 transition ${
                      isActive 
                        ? "bg-white text-black" 
                        : "bg-black/30 text-white hover:bg-white/20"
                    }`}
                  >
                    <span className="">{service.title.firstLine}</span>
                    <span className="">{service.title.secondLine}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content with Right Side Navigation */}
        <div className="relative mb-20 mt-12">
          {/* Right Side Navigation */}
          <div className="hidden fixed lg:block lg:absolute lg:right-4 lg:w-40 xl:w-64 z-10">
            <div className=" ">
              
              <nav className="space-y-4">
                <button 
                  onClick={() => scrollToSection(overviewRef)}
                  className={`w-full text-left px-4 py-2 border-l-2 transition ${
                    activeSection === "overview" 
                      ? "text-white border-white" 
                      : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollToSection(featuresRef)}
                  className={`w-full text-left px-4 py-2 border-l-2 transition ${
                    activeSection === "features" 
                      ? "text-white border-white" 
                      : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
                  }`}
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection(processRef)}
                  className={`w-full text-left px-4 py-2 border-l-2 transition ${
                    activeSection === "process" 
                      ? "text-white border-white" 
                      : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
                  }`}
                >
                  Process
                </button>
                <button 
                  onClick={() => scrollToSection(advantagesRef)}
                  className={`w-full text-left px-4 py-2 border-l-2 transition ${
                    activeSection === "advantages" 
                      ? "text-white border-white" 
                      : "text-neutral-300 border-transparent hover:border-white/50 hover:text-white/80"
                  }`}
                >
                  Advantages
                </button>
              </nav>
              
              {/* Service Specifications */}
              {/* <div className="border-t border-white/10 my-6 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Service Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Response Time</span>
                    <span className="font-medium text-white">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Service Area</span>
                    <span className="font-medium text-white">Nationwide</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Warranty</span>
                    <span className="font-medium text-white">1 Year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Certification</span>
                    <span className="font-medium text-white">ISO 9001</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Content Sections (Vertical Layout) */}
          <div className="pr-0 lg:pr-80 xl:pr-80 px-8">
            {/* Overview Section */}
            <div ref={overviewRef} id="overview" className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12">
                  <div className="flex items-center gap-3 mb-6">
                    
                      {/* <Icon className="w-8 h-8 text-background" /> */}
                   
                    <h2 className="text-3xl font-bold text-background">
                      Overview
                    </h2>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg mb-6 text-neutral-300">
                      <span>{selectedService.description.firstLine} </span>
                      <span>{selectedService.description.secondLine}</span>
                    </p>
                    <p className="text-base text-neutral-300 mb-8">{selectedService.detailedDescription}</p>
                    
                    <h3 className="text-xl font-semibold mb-4 text-white">Why Choose Our {selectedService.title.firstLine} {selectedService.title.secondLine} Service</h3>
                    <p className="text-neutral-300">Our team of certified professionals brings years of experience and industry knowledge to each project. We use cutting-edge technology and follow rigorous quality control processes to deliver reliable results every time.</p>
                    
                    <ul className="mt-6 space-y-2">
                      {selectedService.advantages.slice(0, 3).map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-300">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* <div className="mt-10 flex gap-4">
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black py-3 px-6 rounded-md transition duration-300"
                    >
                      Request This Service
                      <Wrench className="w-4 h-4" />
                    </Link>
                    
                    <Link 
                      href="tel:+1234567890" 
                      className="inline-flex items-center gap-2 border border-white text-white hover:bg-white/10 py-3 px-6 rounded-md transition duration-300"
                    >
                      <Phone className="w-4 h-4" />
                      Call for Inquiry
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div ref={featuresRef} id="features" className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-white">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="bg-white/5 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-white">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.split(" ").slice(0, 2).join(" ")}</h3>
                    <p className="text-neutral-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Process Section */}
            <div ref={processRef} id="process" className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-white">Process</h2>
              <Timeline 
                data={[
                  { 
                    title: "Assessment", 
                    content: (
                      <div className=" p-4">
                        
                        <p className="text-neutral-300">
                          We begin with a thorough evaluation of your current systems and requirements to establish baseline performance and identify areas for improvement.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Planning", 
                    content: (
                      <div className="p-4">
                        
                        <p className="text-neutral-300">
                          Our engineering team designs a comprehensive plan tailored to your specific needs, considering technical requirements and budget constraints.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Preparation", 
                    content: (
                      <div className=" p-4">
                       
                        <p className="text-neutral-300">
                          We prepare all necessary equipment and materials, ensuring everything meets our rigorous quality standards before implementation.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Execution", 
                    content: (
                      <div className=" p-4">
                        
                        <p className="text-neutral-300">
                          Our certified technicians execute the plan with precision, adhering to industry best practices and safety protocols.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Verification", 
                    content: (
                      <div className=" p-4">
                        
                        <p className="text-neutral-300">
                          All results are meticulously documented and analyzed to verify performance meets or exceeds expected standards.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Maintenance", 
                    content: (
                      <div className=" p-4">
                        
                        <p className="text-neutral-300">
                          We provide detailed recommendations for ongoing maintenance and future improvements to maximize system performance and longevity.
                        </p>
                      </div>
                    ) 
                  },
                  { 
                    title: "Handover", 
                    content: (
                      <div className="p-4">
                        
                        <p className="text-neutral-300">
                          Final project documentation is delivered along with training for your team, ensuring a smooth transition and successful project completion.
                        </p>
                      </div>
                    ) 
                  }
                ]}
              />
            </div>
            
            {/* Advantages Section */}
            <div ref={advantagesRef} id="advantages" className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-white">Advantages</h2>
              <div>
                <p className="text-lg mb-8 text-neutral-300">
                  When you choose our {selectedService.title.firstLine} {selectedService.title.secondLine} service, you benefit from our years of industry experience, 
                  technical expertise, and commitment to excellence. Here's why our clients trust us with their critical infrastructure:
                </p>
                <div className="space-y-6">
                  {selectedService.advantages.map((advantage, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-white">{advantage}</h3>
                        <p className="text-neutral-300">
                          {index === 0 
                            ? "Our proactive approach helps identify and address potential issues before they lead to costly failures or downtime."
                            : index === 1
                            ? "We strictly adhere to all relevant industry standards and regulations, ensuring your systems meet or exceed compliance requirements."
                            : index === 2
                            ? "Regular maintenance and optimized operations significantly extend the useful life of your valuable equipment."
                            : index === 3
                            ? "Our solutions are designed to enhance overall system efficiency, resulting in improved performance and reliability."
                            : "Strategic maintenance planning and system optimization lead to significant cost savings over the lifecycle of your equipment."
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-white/5 p-10 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
            Contact our team today to discuss your {selectedService.title.firstLine.toLowerCase()} {selectedService.title.secondLine.toLowerCase()} needs and discover how we can help optimize your electrical systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black py-3 px-8 rounded-md transition duration-300"
            >
              Get Quote
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 border border-white text-white hover:bg-white/20 py-3 px-8 rounded-md transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Other Services */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center text-white px-8">Explore Our Other Services</h3>
          <div className="flex items-center justify-center gap-8 px-4">
            {servicesItems.filter(service => service.id !== activeService).map(service => {
              const ServiceIcon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveService(service.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center text-center p-6 border border-white/10 rounded-lg hover:border-white hover:bg-white/5 transition duration-300 text-white"
                >
                  <ServiceIcon className="w-10 h-10 text-white mb-3" />
                  <span className="font-medium">{service.title.firstLine}</span>
                  <span className="font-medium">{service.title.secondLine}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
