export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  aiReasoning: string;
  skills: string[];
  salary: string;
  posted: string;
}

export interface Candidate {
  id: string;
  name: string;
  university: string;
  degree: string;
  gpa: number;
  matchScore: number;
  aiReasoning: string;
  skills: string[];
  avatar: string;
  appliedDate?: string;
}

export interface CompanyJob {
  id: string;
  title: string;
  department: string;
  applicants: number;
  aiRecommended: number;
  status: "active" | "paused" | "closed";
  posted: string;
}

export const studentProfile = {
  name: "Sarah Chen",
  university: "MIT",
  degree: "M.S. Computer Science",
  gpa: 3.92,
  skills: [
    "Python",
    "Machine Learning",
    "React",
    "TypeScript",
    "TensorFlow",
    "AWS",
    "SQL",
    "Docker",
  ],
  interests: ["AI/ML", "Full-Stack", "Cloud Computing"],
  avatar: "SC",
};

export const recommendedJobs: Job[] = [
  {
    id: "1",
    title: "ML Engineer",
    company: "DeepMind",
    location: "London, UK",
    type: "Full-time",
    matchScore: 96,
    aiReasoning:
      "Strong ML background with TensorFlow experience aligns perfectly with the team's focus on deep reinforcement learning. Your GPA and coursework in neural architectures make you an exceptional fit.",
    skills: ["Python", "TensorFlow", "ML", "Research"],
    salary: "$145K - $190K",
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Full-Stack AI Developer",
    company: "Vercel",
    location: "Remote",
    type: "Full-time",
    matchScore: 91,
    aiReasoning:
      "Your React/TypeScript proficiency combined with ML experience is rare. The AI SDK team needs someone who bridges frontend and ML - your profile is a 91% match across all key requirements.",
    skills: ["React", "TypeScript", "Python", "AI"],
    salary: "$130K - $170K",
    posted: "1 day ago",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-time",
    matchScore: 87,
    aiReasoning:
      "Your statistical modeling coursework and Python expertise align with Stripe's fraud detection team. SQL proficiency and cloud experience are bonus qualifications they value highly.",
    skills: ["Python", "SQL", "Statistics", "AWS"],
    salary: "$140K - $180K",
    posted: "3 days ago",
  },
  {
    id: "4",
    title: "AI Research Intern",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Internship",
    matchScore: 83,
    aiReasoning:
      "Published research experience and strong academic record make you competitive. Your TensorFlow and Python skills match 83% of the core requirements for their safety research team.",
    skills: ["Python", "ML", "Research", "Math"],
    salary: "$9K/month",
    posted: "5 days ago",
  },
];

export const companyJobs: CompanyJob[] = [
  {
    id: "1",
    title: "Senior ML Engineer",
    department: "AI Research",
    applicants: 142,
    aiRecommended: 18,
    status: "active",
    posted: "Jan 15, 2026",
  },
  {
    id: "2",
    title: "Full-Stack Developer",
    department: "Product",
    applicants: 89,
    aiRecommended: 12,
    status: "active",
    posted: "Jan 20, 2026",
  },
  {
    id: "3",
    title: "Data Analyst",
    department: "Business Intelligence",
    applicants: 67,
    aiRecommended: 9,
    status: "paused",
    posted: "Feb 1, 2026",
  },
];

export const appliedCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Rivera",
    university: "Stanford",
    degree: "B.S. Computer Science",
    gpa: 3.88,
    matchScore: 94,
    aiReasoning:
      "Exceptional full-stack portfolio with 3 production ML projects. Stanford AI Lab experience directly relevant to your team's computer vision work.",
    skills: ["Python", "PyTorch", "React", "Go"],
    avatar: "AR",
    appliedDate: "Feb 10, 2026",
  },
  {
    id: "2",
    name: "Priya Sharma",
    university: "Carnegie Mellon",
    degree: "M.S. AI",
    gpa: 3.95,
    matchScore: 91,
    aiReasoning:
      "Top 5% of CMU AI program with published NeurIPS paper. Research on transformer architectures directly applicable to your NLP pipeline.",
    skills: ["Python", "TensorFlow", "NLP", "C++"],
    avatar: "PS",
    appliedDate: "Feb 8, 2026",
  },
  {
    id: "3",
    name: "Jordan Kim",
    university: "UC Berkeley",
    degree: "B.S. Data Science",
    gpa: 3.76,
    matchScore: 82,
    aiReasoning:
      "Strong data pipeline experience from Berkeley's D-Lab. Kaggle top 2% ranking demonstrates practical ML skills beyond coursework.",
    skills: ["Python", "SQL", "Spark", "Tableau"],
    avatar: "JK",
    appliedDate: "Feb 12, 2026",
  },
];

export const aiRecommendedCandidates: Candidate[] = [
  {
    id: "4",
    name: "Maya Johnson",
    university: "Georgia Tech",
    degree: "M.S. Machine Learning",
    gpa: 3.91,
    matchScore: 97,
    aiReasoning:
      "Highest match in our system. 3 internships at FAANG companies with direct experience in recommendation systems. Her thesis on efficient transformers aligns perfectly with your roadmap.",
    skills: ["Python", "PyTorch", "Distributed Systems", "Rust"],
    avatar: "MJ",
  },
  {
    id: "5",
    name: "David Zhang",
    university: "MIT",
    degree: "Ph.D. Candidate, CS",
    gpa: 3.97,
    matchScore: 93,
    aiReasoning:
      "PhD research on adversarial robustness directly relevant to your security-critical ML systems. Co-authored 4 papers at top venues.",
    skills: ["Python", "JAX", "Math", "Security"],
    avatar: "DZ",
  },
  {
    id: "6",
    name: "Olivia Patel",
    university: "University of Toronto",
    degree: "M.S. Computer Science",
    gpa: 3.85,
    matchScore: 89,
    aiReasoning:
      "Geoffrey Hinton's lab alum with strong deep learning foundations. Production experience deploying ML models at scale during her Shopify internship.",
    skills: ["Python", "TensorFlow", "Kubernetes", "MLOps"],
    avatar: "OP",
  },
];

export const chatMessages = [
  {
    role: "assistant" as const,
    content:
      "Hi Sarah! I've analyzed your profile and found 4 high-match opportunities. The DeepMind ML Engineer role at 96% match is particularly strong given your TensorFlow experience.",
  },
  {
    role: "user" as const,
    content: "Tell me more about the DeepMind role. What makes it a 96% match?",
  },
  {
    role: "assistant" as const,
    content:
      "Great question! Here's the breakdown:\n\n- Skills Match: 98% - Your Python, TensorFlow, and ML coursework align perfectly\n- Experience: 94% - Your research projects mirror their team's focus areas\n- Culture Fit: 96% - Your interest in AI safety matches their mission\n\nI'd recommend highlighting your neural architecture coursework in your application.",
  },
];
