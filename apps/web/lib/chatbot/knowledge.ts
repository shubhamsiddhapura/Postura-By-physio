/**
 * Static knowledge base of every public page on the site.
 *
 * The chatbot's system prompt is built from these entries and the LLM is
 * constrained to suggest only `path` values that appear here. This prevents
 * hallucinated links and keeps responses tightly scoped to the actual site.
 *
 * To add or rename a page, edit this file and the bot picks it up immediately.
 */

export type KnowledgeCategory =
  | "core"
  | "physio"
  | "fitness"
  | "rehab"
  | "group"
  | "training"
  | "content"
  | "legal";

export type KnowledgeEntry = {
  /** Route path the bot can recommend. Must start with "/". */
  path: string;
  /** Human-readable page title shown in suggested-link pills. */
  title: string;
  category: KnowledgeCategory;
  /** 1–2 sentence description used by the LLM to decide relevance. */
  summary: string;
  /** Phrases / synonyms a visitor might use when asking about this page. */
  keywords: string[];
};

export const SITE_KNOWLEDGE: readonly KnowledgeEntry[] = [
  // ─────────────────────────────────────────────────────────── Core ──
  {
    path: "/",
    title: "Home",
    category: "core",
    summary:
      "Landing page introducing Postura by Physio (Dr Priyanshi Pandya, MPT GPC-6673, MIAFT) — combining evidence-based physiotherapy with structured fitness programs for posture, mobility, and long-term wellness.",
    keywords: ["home", "homepage", "main", "overview", "postura"],
  },
  {
    path: "/about",
    title: "About Us",
    category: "core",
    summary:
      "Learn about Dr Priyanshi Pandya (MPT GPC-6673, MIAFT), the brand's vision and mission, treatment philosophy, and the story behind Postura by Physio.",
    keywords: ["about", "doctor", "physiotherapist", "story", "mission", "vision"],
  },
  {
    path: "/services",
    title: "All Services",
    category: "core",
    summary:
      "Overview of every physiotherapy and fitness service offered, with structured fitness solutions for different lifestyles and goals.",
    keywords: ["services", "all services", "offerings", "what do you offer"],
  },
  {
    path: "/contact-us",
    title: "Contact Us",
    category: "core",
    summary:
      "Get in touch — WhatsApp 6354011290, phone, email, working days, and an enquiry form. Doorstep and society-based services available; online sessions worldwide.",
    keywords: [
      "contact",
      "phone",
      "email",
      "whatsapp",
      "address",
      "reach",
      "get in touch",
      "talk to physiotherapist",
      "speak to someone",
      "instagram",
      "doorstep",
      "home visit",
      "online session",
    ],
  },
  {
    path: "/book-a-session",
    title: "Book a Session",
    category: "core",
    summary:
      "Online booking for an assessment, consultation, or therapy session — pick a date and time slot that works for you. Sessions run 45–60 minutes.",
    keywords: [
      "book",
      "booking",
      "appointment",
      "schedule",
      "session",
      "consultation",
      "reserve",
      "slot",
      "assessment",
      "lead",
    ],
  },

  // ────────────────────────────────────────────────────── Physiotherapy ──
  {
    path: "/physiotherapy",
    title: "Physiotherapy",
    category: "physio",
    summary:
      "Core physiotherapy services covering pain management, posture correction, and advanced treatments such as cupping therapy and dry needling, with a personalised treatment timeline.",
    keywords: [
      "physiotherapy",
      "physio",
      "pain",
      "posture",
      "treatment",
      "therapy",
      "cupping therapy",
      "dry needling",
      "advanced treatments",
      "manual therapy",
    ],
  },
  {
    path: "/physiotherapy-management",
    title: "Physiotherapy Management",
    category: "physio",
    summary:
      "Structured physiotherapy management for orthopedic, neurological, cardio-respiratory, pre/post-natal, pre/post-surgery, and geriatric conditions — with assessment, treatment planning, and progress tracking.",
    keywords: [
      "physiotherapy management",
      "treatment plan",
      "chronic pain",
      "back pain",
      "neck pain",
      "knee pain",
      "shoulder pain",
      "frozen shoulder",
      "joint pain",
      "muscle injury",
      "ligament injury",
      "rehabilitation plan",
      "orthopedic",
      "orthopaedic",
      "neurological",
      "stroke",
      "parkinson",
      "nerve injury",
      "balance",
      "cardio respiratory",
      "cardio-respiratory",
      "breathing",
      "post covid",
      "post-covid",
      "lung",
      "stamina",
      "post surgery",
      "post-surgery",
      "pre surgery",
      "pre-surgery",
      "knee replacement",
      "spine surgery",
      "ligament reconstruction",
      "rehabilitation",
    ],
  },
  {
    path: "/patient-interaction",
    title: "Patient Interaction (Health Assessment)",
    category: "physio",
    summary:
      "Interactive questionnaire and basic assessment that suggests the right program based on your lifestyle, pain points, and goals — useful before booking.",
    keywords: [
      "assessment",
      "questionnaire",
      "health check",
      "which program",
      "recommend",
      "self assessment",
      "evaluation",
      "intake",
      "screening",
    ],
  },

  // ──────────────────────────────────────────────────── Fitness programs ──
  {
    path: "/pilates-program",
    title: "Pilates Program",
    category: "fitness",
    summary:
      "Mat and reformer-style Pilates focusing on core strength, posture, spinal alignment, flexibility, and back-pain prevention under physiotherapist supervision.",
    keywords: [
      "pilates",
      "core",
      "core strength",
      "reformer",
      "mat pilates",
      "flexibility",
      "alignment",
      "spinal alignment",
      "controlled movement",
      "back pain",
      "posture",
    ],
  },
  {
    path: "/yoga-program",
    title: "Yoga Program",
    category: "fitness",
    summary:
      "Therapeutic yoga and Power Yoga sessions blending traditional asana with physiotherapy principles for stress relief, mobility, breath work, strength, and endurance.",
    keywords: [
      "yoga",
      "asana",
      "stretching",
      "stress",
      "anxiety",
      "breathing",
      "pranayama",
      "meditation",
      "power yoga",
      "flexibility",
      "balance",
      "mental wellbeing",
    ],
  },
  {
    path: "/aerobics-program",
    title: "Aerobics Program",
    category: "fitness",
    summary:
      "Low-impact and high-energy aerobics for cardiovascular health, weight loss, and stamina — typically burns 300–500 calories per 45–60 minute session, safe for all fitness levels.",
    keywords: [
      "aerobics",
      "cardio",
      "weight loss",
      "fat loss",
      "belly fat",
      "calorie burn",
      "calories",
      "stamina",
      "metabolism",
      "dance fitness",
      "endurance",
      "fitness program",
    ],
  },

  // ───────────────────────────────────────────────────── Specialised rehab ──
  {
    path: "/pre-post-natal",
    title: "Pre & Post Natal Care",
    category: "rehab",
    summary:
      "Pregnancy-safe physiotherapy and exercise — back pain during pregnancy, pelvic strengthening, safe prenatal exercises, post-delivery recovery, and core rehabilitation.",
    keywords: [
      "pregnancy",
      "prenatal",
      "antenatal",
      "postnatal",
      "postpartum",
      "after delivery",
      "post delivery",
      "mother",
      "mom",
      "pelvic floor",
      "pelvic strengthening",
      "diastasis",
      "core strengthening",
      "back pain pregnancy",
    ],
  },
  {
    path: "/geriatric-rehabilitation",
    title: "Geriatric Rehabilitation",
    category: "rehab",
    summary:
      "Gentle, evidence-based rehabilitation for older adults — balance and stability, joint mobility, muscle strength, walking ability, and fall prevention.",
    keywords: [
      "elderly",
      "senior",
      "senior citizen",
      "old age",
      "geriatric",
      "fall prevention",
      "balance",
      "stability",
      "mobility",
      "walking",
      "arthritis",
      "parents",
      "grandparents",
    ],
  },
  {
    path: "/athlete-rehab",
    title: "Athlete Rehab",
    category: "rehab",
    summary:
      "Sports-specific rehabilitation and return-to-play protocols — injury recovery, post-surgery rehab (ACL, ligament reconstruction), and performance enhancement.",
    keywords: [
      "athlete",
      "sports",
      "injury",
      "sports injury",
      "return to play",
      "performance",
      "ACL",
      "ligament",
      "ligament tear",
      "muscle tear",
      "post-surgery sports",
      "rehabilitation after surgery",
    ],
  },

  // ──────────────────────────────────────────── Group / corporate / couples ──
  {
    path: "/corporate-professionals",
    title: "Corporate Professionals",
    category: "group",
    summary:
      "Posture correction and ergonomic exercise programs for IT and corporate teams who sit long hours — addresses neck pain, back pain, poor posture, and muscle stiffness, with on-site group sessions for offices.",
    keywords: [
      "corporate",
      "office",
      "desk job",
      "long sitting",
      "screen time",
      "workplace",
      "workplace wellness",
      "IT",
      "IT professional",
      "ergonomic",
      "ergonomics",
      "company",
      "employees",
      "work from home",
      "posture correction",
      "posture",
      "stiffness",
    ],
  },
  {
    path: "/society-exercise",
    title: "Society Exercise Programs",
    category: "group",
    summary:
      "On-site group fitness and physiotherapy programs hosted at residential societies — yoga, aerobics, and physio for community wellness.",
    keywords: [
      "society",
      "community",
      "residential",
      "apartment",
      "neighbours",
      "group class",
      "society program",
    ],
  },
  {
    path: "/couple-exercise-program",
    title: "Couple Exercise Program",
    category: "group",
    summary:
      "Partner workout sessions designed for couples — shared motivation, improved bonding, and balanced fitness routines for both partners.",
    keywords: ["couple", "partner", "duo", "spouse", "together", "couples workout"],
  },

  // ──────────────────────────────────────────────────── Equipment training ──
  {
    path: "/swiss-ball-training",
    title: "Swiss Ball Training",
    category: "training",
    summary:
      "Training with the Swiss (stability) ball for core strength, balance, posture, and rehabilitation — one of our advanced physiotherapy treatment tools, used under guided supervision.",
    keywords: [
      "swiss ball",
      "stability ball",
      "exercise ball",
      "fitball",
      "core ball",
      "advance treatment",
      "advanced treatment",
    ],
  },
  {
    path: "/theraband-training",
    title: "Theraband Training",
    category: "training",
    summary:
      "Resistance band (Theraband) training for progressive strengthening, rehab, and joint stability — adaptable for any level and one of our advanced therapy tools.",
    keywords: [
      "theraband",
      "thera band",
      "resistance band",
      "elastic band",
      "rubber band exercise",
      "advance treatment",
      "advanced treatment",
    ],
  },
  {
    path: "/flexibar-training",
    title: "Flexibar Training",
    category: "training",
    summary:
      "Flexibar (vibration bar) training for deep core activation, posture, and neuromuscular control through oscillation-based exercises — used as an advanced physiotherapy treatment.",
    keywords: [
      "flexibar",
      "flexi bar",
      "vibration bar",
      "oscillation",
      "core training",
      "advance treatment",
      "advanced treatment",
    ],
  },

  // ───────────────────────────────────────────────────────────── Content ──
  {
    path: "/gallery",
    title: "Gallery",
    category: "content",
    summary:
      "Photo gallery of in-clinic and on-site sessions across yoga, pilates, aerobics, corporate wellness, and society programs.",
    keywords: ["gallery", "photos", "pictures", "images", "session photos", "visuals"],
  },
  {
    path: "/blogs",
    title: "Blogs",
    category: "content",
    summary:
      "Articles and tips on physiotherapy, posture, fitness, recovery, and wellness written by the Postura team.",
    keywords: ["blog", "blogs", "articles", "tips", "advice", "posts", "read"],
  },
  {
    path: "/testimonials",
    title: "Testimonials",
    category: "content",
    summary:
      "Real reviews and recovery stories from clients who completed physiotherapy or fitness programs with Postura by Physio.",
    keywords: ["testimonials", "reviews", "stories", "feedback", "ratings", "what clients say"],
  },

  // ─────────────────────────────────────────────────────────────── Legal ──
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    category: "legal",
    summary: "How Postura by Physio collects, uses, and protects your personal data.",
    keywords: ["privacy", "privacy policy", "data", "gdpr", "cookies"],
  },
  {
    path: "/terms-and-conditions",
    title: "Terms & Conditions",
    category: "legal",
    summary: "Terms of use, booking and cancellation policy, and service conditions.",
    keywords: [
      "terms",
      "conditions",
      "policy",
      "cancellation",
      "refund",
      "legal",
      "agreement",
    ],
  },
];

/** Set of valid paths — used server-side to validate LLM-suggested links. */
export const ALLOWED_PATHS: ReadonlySet<string> = new Set(
  SITE_KNOWLEDGE.map((entry) => entry.path)
);

/** Look up an entry by exact path. */
export function findEntryByPath(path: string): KnowledgeEntry | undefined {
  return SITE_KNOWLEDGE.find((entry) => entry.path === path);
}
