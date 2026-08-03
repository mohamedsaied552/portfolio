import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "zakzouka",
    name: "Zakzouka",
    tagline: "Smart Electric Mobility Platform",
    description:
      "A flagship smart city mobility ecosystem featuring real-time ride tracking, SignalR live updates, QR unlock, GPS routing, wallet dashboard, and charging station network.",
    technologies: ["Flutter", "Dart", "SignalR", ".NET", "ASP.NET Core", "Firebase", "REST API"],
    highlights: [
      "Real-time ride visualization",
      "SignalR live animations",
      "QR unlock system",
      "GPS route tracking",
      "Wallet dashboard",
      "Charging station network",
    ],
    color: "#00d4ff",
    accentColor: "#0066ff",
  },
  {
    id: "shoghlany",
    name: "Shoghlany",
    tagline: "Interactive Recruitment Platform",
    description:
      "A modern recruitment center with floating resumes, intelligent job matching, and real-time candidate-employer connections.",
    technologies: ["Flutter", "Laravel", "PHP", "MySQL", "REST API"],
    highlights: [
      "Real-time job matching",
      "Floating resume cards",
      "Modern office interface",
      "Smart candidate filtering",
    ],
    color: "#a855f7",
    accentColor: "#7c3aed",
  },
  {
    id: "rov",
    name: "ROV",
    tagline: "Underwater Research Laboratory",
    description:
      "Remote-operated vehicle control system for underwater exploration with sonar mapping, manipulator arm control, and live telemetry.",
    technologies: ["C++", "Arduino", "Embedded Systems", "IoT", "Python"],
    highlights: [
      "Robotic submarine control",
      "Manipulator arm",
      "Sonar mapping",
      "Search lights & telemetry",
    ],
    color: "#06b6d4",
    accentColor: "#0891b2",
  },
  {
    id: "smart-parking",
    name: "Smart Parking",
    tagline: "IoT Parking Management",
    description:
      "Futuristic parking system with sensor networks, traffic light integration, and real-time slot availability simulation.",
    technologies: ["Flutter", "Arduino", "IoT", "Firebase", "Networking"],
    highlights: [
      "Parking sensors",
      "IoT integration",
      "Traffic simulation",
      "Real-time availability",
    ],
    color: "#10b981",
    accentColor: "#059669",
  },
  {
    id: "weather-app",
    name: "Weather App",
    tagline: "Immersive Weather Experience",
    description:
      "A visually stunning weather application with dynamic simulations for rain, clouds, sun, snow, and lightning effects.",
    technologies: ["Flutter", "Dart", "Provider", "REST API"],
    highlights: [
      "Dynamic weather simulation",
      "Rain & snow particles",
      "Lightning effects",
      "Glass morphism UI",
    ],
    color: "#6366f1",
    accentColor: "#4f46e5",
  },
];
