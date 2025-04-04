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
import { 
  TransformerOilIcon, 
  LowCurrentIcon, 
  PowerGenerationIcon, 
  TerminationIcon, 
  InstallationIcon, 
  TestingIcon 
} from "./custom-icons";

// Service data with expanded content
export const servicesItems = [
  {
    id: "testing-commissioning",
    title: {
      firstLine: "Testing and",
      secondLine: "Commissioning"
    },
    icon: TestingIcon,
    description: {
      firstLine: "Comprehensive testing services for high voltage equipment",
      secondLine: "and systems for optimal performance and safety."
    },
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
    title: {
      firstLine: "Low-Current",
      secondLine: "Systems"
    },
    icon: LowCurrentIcon,
    description: {
      firstLine: "Expert installation of protection and control systems",
      secondLine: "for reliable operations and maximum safety."
    },
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
    title: {
      firstLine: "Power",
      secondLine: "Generation"
    },
    icon: PowerGenerationIcon,
    description: {
      firstLine: "Specialized services for power generation facilities",
      secondLine: "and infrastructure needs with proven expertise."
    },
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
    title: {
      firstLine: "Design &",
      secondLine: "Installation"
    },
    icon: InstallationIcon,
    description: {
      firstLine: "Custom electrical system design for industrial projects",
      secondLine: "and commercial applications that meet your needs."
    },
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
    title: {
      firstLine: "Splicing &",
      secondLine: "Termination"
    },
    icon: TerminationIcon,
    description: {
      firstLine: "Precision cable splicing for high voltage applications",
      secondLine: "with expert craftsmanship and attention to detail."
    },
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
    title: {
      firstLine: "Transformer",
      secondLine: "Oil"
    },
    icon: TransformerOilIcon,
    description: {
      firstLine: "Comprehensive transformer oil testing and treatment",
      secondLine: "for extended equipment life and reliable operation."
    },
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
