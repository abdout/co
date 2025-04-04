'use client'
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { 
  Zap, 
  Shield, 
  Workflow, 
  Cable, 
  BarChart4, 
  Gauge, 
  CheckCircle, 
  Wrench, 
  Clock, 
  Award,
  LucideIcon,
  Users,
  LineChart,
  ArrowRight,
  Phone,
  ChevronRight
} from "lucide-react";

// Service data with expanded content
const servicesItems = [
  {
    id: "testing-commissioning",
    title: "Testing & Commissioning",
    icon: Zap,
    description: "Comprehensive testing services for high voltage equipment and systems.",
    detailedDescription: "Our testing and commissioning services ensure your electrical systems operate at peak performance. We conduct thorough assessments of high voltage equipment, identifying potential issues before they become problems. With state-of-the-art testing tools and certified technicians, we deliver reliable results that maintain system integrity and extend equipment lifespan.",
    image: "/service/testing.jpg",
    features: [
      "High voltage electrical testing up to 765kV",
      "Circuit breaker testing and timing analysis",
      "Protection relay testing and coordination",
      "Transformer condition assessment",
      "Power quality analysis and monitoring",
      "Ground grid testing and verification"
    ],
    advantages: [
      "Minimize unexpected equipment failures",
      "Ensure compliance with industry standards",
      "Extend equipment lifespan",
      "Optimize system performance",
      "Reduce maintenance costs"
    ],
    process: [
      "Initial system assessment",
      "Test plan development",
      "Equipment setup and preparation",
      "Testing execution and data collection",
      "Results analysis and reporting",
      "Recommendations for improvements"
    ]
  },
  {
    id: "low-current-systems",
    title: "Low-Current Systems",
    icon: Shield,
    description: "Expert installation of protection and control systems for reliable operations.",
    detailedDescription: "Our low-current systems expertise covers the entire spectrum of protection and control infrastructure. From design to implementation, we ensure your systems provide reliable operation under all conditions. We specialize in advanced monitoring solutions, automation controls, and protection systems that safeguard your critical equipment and operations.",
    image: "/service/low-current.jpg",
    features: [
      "SCADA systems design and implementation",
      "Protection relay programming and testing",
      "Control system integration",
      "Alarm and monitoring system installation",
      "Emergency power shutdown systems",
      "Fire detection and suppression control"
    ],
    advantages: [
      "Enhanced system reliability and safety",
      "Reduced downtime with early fault detection",
      "Centralized monitoring and control",
      "Improved operational efficiency",
      "Comprehensive documentation and support"
    ],
    process: [
      "System requirements analysis",
      "Architecture design and specification",
      "Equipment selection and procurement",
      "Installation and wiring",
      "Programming and configuration",
      "Testing and commissioning",
      "Operator training and handover"
    ]
  },
  {
    id: "power-generation",
    title: "Power Generation",
    icon: Workflow,
    description: "Specialized services for power generation facilities and infrastructure needs.",
    detailedDescription: "We deliver comprehensive solutions for power generation facilities, helping maximize efficiency and reliability. Our team has extensive experience with various generation technologies, offering specialized maintenance, upgrades, and operational support to ensure continuous power delivery. From conventional to renewable generation systems, we provide the expertise you need.",
    image: "/service/generation.jpg",
    features: [
      "Generator protection and control systems",
      "Excitation system maintenance and upgrades",
      "Governor system tuning and optimization",
      "Auxiliary power system management",
      "Black start capabilities and testing",
      "Renewable energy integration"
    ],
    advantages: [
      "Improved generation efficiency",
      "Enhanced plant reliability",
      "Reduced unplanned outages",
      "Extended equipment lifecycle",
      "Optimized operational costs"
    ],
    process: [
      "Facility assessment and baseline testing",
      "Performance analysis and optimization planning",
      "System upgrades and retrofits",
      "Control system modifications",
      "Testing and verification",
      "Performance monitoring"
    ]
  },
  {
    id: "design-installation",
    title: "Design & Installation",
    icon: Cable,
    description: "Custom electrical system design for industrial projects and commercial applications.",
    detailedDescription: "Our design and installation services transform concepts into reality with precision engineering and meticulous implementation. We create custom electrical systems tailored to your specific requirements, ensuring optimal performance and compliance with all relevant standards. From initial consultation to final commissioning, we manage every aspect of your electrical infrastructure development.",
    image: "/service/16.png",
    features: [
      "Substation design and layout planning",
      "Power distribution system engineering",
      "Protection and control schemes",
      "Grounding system design",
      "Lightning protection systems",
      "Cable routing and management"
    ],
    advantages: [
      "Tailored solutions for your specific needs",
      "Energy efficient designs reducing operational costs",
      "Future-proof installations with expansion capability",
      "Comprehensive documentation for maintenance",
      "Turnkey solutions from concept to completion"
    ],
    process: [
      "Requirements gathering and site assessment",
      "Conceptual design and client review",
      "Detailed engineering and documentation",
      "Material and equipment procurement",
      "Installation and construction supervision",
      "Testing, commissioning, and handover"
    ]
  },
  {
    id: "splicing-termination",
    title: "Splicing & Termination",
    icon: BarChart4,
    description: "Precision cable splicing for high voltage applications with expert craftsmanship.",
    detailedDescription: "Our splicing and termination services deliver flawless connections that stand the test of time. Our certified technicians use advanced techniques and premium materials to ensure every splice and termination maintains electrical integrity under the most demanding conditions. We specialize in high voltage applications where precision is paramount.",
    image: "/service/terminations.jpg",
    features: [
      "Medium and high voltage cable splicing",
      "Outdoor and indoor terminations",
      "GIS and transformer terminations",
      "Submarine cable splicing and repair",
      "Fiber optic fusion splicing",
      "Cable fault location and repair"
    ],
    advantages: [
      "Extended cable system lifespan",
      "Minimized connection failures",
      "Reduced maintenance requirements",
      "Emergency repair capabilities",
      "Consistent electrical performance"
    ],
    process: [
      "Cable system assessment",
      "Material selection and preparation",
      "Environment control setup",
      "Precision splicing execution",
      "Quality control testing",
      "Documentation and warranty"
    ]
  },
  {
    id: "transformer-oil",
    title: "Transformer Oil",
    icon: Gauge,
    description: "Comprehensive transformer oil testing and treatment for extended equipment life.",
    detailedDescription: "We provide complete transformer oil services to maintain and extend the life of your valuable transformers. Our testing protocols identify potential issues early, while our treatment services restore oil to optimal condition. Regular maintenance of transformer oil is essential for preventing failures and ensuring reliable operation of your power equipment.",
    image: "/service/trafo.jpg",
    features: [
      "Dissolved gas analysis (DGA)",
      "Furan compound testing",
      "Oil dielectric breakdown testing",
      "Moisture content analysis",
      "Oil filtering and regeneration",
      "Vacuum oil filling"
    ],
    advantages: [
      "Early fault detection through regular testing",
      "Extended transformer lifespan",
      "Improved cooling efficiency",
      "Reduced risk of catastrophic failures",
      "Optimized maintenance scheduling"
    ],
    process: [
      "Sampling and initial analysis",
      "Comprehensive laboratory testing",
      "Result interpretation and recommendations",
      "Treatment method selection",
      "Oil processing and reconditioning",
      "Post-treatment verification testing"
    ]
  },
];

export function ServiceDetailPage() {
  const searchParams = useSearchParams();
  const serviceIdParam = searchParams.get("id");
  const [activeService, setActiveService] = useState(serviceIdParam || servicesItems[0].id);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (serviceIdParam) {
      setActiveService(serviceIdParam);
    }
  }, [serviceIdParam]);

  const selectedService = servicesItems.find(service => service.id === activeService) || servicesItems[0];
  const Icon = selectedService.icon;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative mb-20 rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src={selectedService.image} 
              alt={selectedService.title}
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 py-28 px-8 md:px-16 text-white">
            <h4 className="text-primary-foreground/80 text-lg mb-2">Our Services</h4>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{selectedService.title}</h1>
            <p className="max-w-2xl text-lg text-primary-foreground/90 mb-8">{selectedService.description}</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition duration-300"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Service Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
          {servicesItems.map(service => {
            const ServiceIcon = service.icon;
            const isActive = service.id === activeService;
            return (
              <button
                key={service.id}
                onClick={() => {
                  setActiveService(service.id);
                  setActiveTab("overview");
                }}
                className={`flex flex-col items-center text-center p-5 rounded-lg transition ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <ServiceIcon className={`w-8 h-8 mb-3 ${isActive ? "text-white" : "text-primary"}`} />
                <span className="font-medium">{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Tabs */}
        <div className="flex border-b mb-12">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-4 font-medium border-b-2 transition ${
              activeTab === "overview" 
                ? "border-primary text-primary" 
                : "border-transparent hover:border-muted"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`px-6 py-4 font-medium border-b-2 transition ${
              activeTab === "features" 
                ? "border-primary text-primary" 
                : "border-transparent hover:border-muted"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab("process")}
            className={`px-6 py-4 font-medium border-b-2 transition ${
              activeTab === "process" 
                ? "border-primary text-primary" 
                : "border-transparent hover:border-muted"
            }`}
          >
            Process
          </button>
          <button
            onClick={() => setActiveTab("advantages")}
            className={`px-6 py-4 font-medium border-b-2 transition ${
              activeTab === "advantages" 
                ? "border-primary text-primary" 
                : "border-transparent hover:border-muted"
            }`}
          >
            Advantages
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-20">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">{selectedService.title}</h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-lg mb-6">{selectedService.description}</p>
                  <p className="text-base text-muted-foreground mb-8">{selectedService.detailedDescription}</p>
                  
                  <h3 className="text-xl font-semibold mb-4">Why Choose Our {selectedService.title} Service</h3>
                  <p>Our team of certified professionals brings years of experience and industry knowledge to each project. We use cutting-edge technology and follow rigorous quality control processes to deliver reliable results every time.</p>
                  
                  <ul className="mt-6 space-y-2">
                    {selectedService.advantages.slice(0, 3).map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition duration-300"
                  >
                    Request This Service
                    <Wrench className="w-4 h-4" />
                  </Link>
                  
                  <Link 
                    href="tel:+1234567890" 
                    className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-md transition duration-300"
                  >
                    <Phone className="w-4 h-4" />
                    Call for Inquiry
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="bg-muted/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Service Highlights</h3>
                  <ul className="space-y-4">
                    {selectedService.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t border-muted-foreground/20 my-6 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Service Specifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium">24-48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Area</span>
                        <span className="font-medium">Nationwide</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty</span>
                        <span className="font-medium">1 Year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certification</span>
                        <span className="font-medium">ISO 9001</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Features Tab */}
          {activeTab === "features" && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="bg-muted/10 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.split(" ").slice(0, 2).join(" ")}</h3>
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Process Tab */}
          {activeTab === "process" && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Our Process</h2>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-muted-foreground/20"></div>
                <div className="space-y-12">
                  {selectedService.process.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-6">
                      <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary"></div>
                      <div className="z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="pt-3">
                        <h3 className="text-xl font-semibold mb-2">{step}</h3>
                        <p className="text-muted-foreground">
                          {index === 0 
                            ? "We begin with a thorough evaluation of your current systems and requirements to establish baseline performance and identify areas for improvement."
                            : index === 1
                            ? "Our engineering team designs a comprehensive plan tailored to your specific needs, considering technical requirements and budget constraints."
                            : index === 2
                            ? "We prepare all necessary equipment and materials, ensuring everything meets our rigorous quality standards before implementation."
                            : index === 3
                            ? "Our certified technicians execute the plan with precision, adhering to industry best practices and safety protocols."
                            : index === 4
                            ? "All results are meticulously documented and analyzed to verify performance meets or exceeds expected standards."
                            : "We provide detailed recommendations for ongoing maintenance and future improvements to maximize system performance and longevity."
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Advantages Tab */}
          {activeTab === "advantages" && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Key Advantages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg mb-8">
                    When you choose our {selectedService.title} service, you benefit from our years of industry experience, 
                    technical expertise, and commitment to excellence. Here's why our clients trust us with their critical infrastructure:
                  </p>
                  <div className="space-y-6">
                    {selectedService.advantages.map((advantage, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{advantage}</h3>
                          <p className="text-muted-foreground">
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
          )}
        </div>
        
        {/* Call to Action */}
        <div className="bg-primary/5 rounded-xl p-10 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Contact our team today to discuss your {selectedService.title.toLowerCase()} needs and discover how we can help optimize your electrical systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-md transition duration-300"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 py-3 px-8 rounded-md transition duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
        
        {/* Other Services */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">Explore Our Other Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {servicesItems.filter(service => service.id !== activeService).map(service => {
              const ServiceIcon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveService(service.id);
                    setActiveTab("overview");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center text-center p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition duration-300"
                >
                  <ServiceIcon className="w-10 h-10 text-primary mb-3" />
                  <span className="font-medium">{service.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
