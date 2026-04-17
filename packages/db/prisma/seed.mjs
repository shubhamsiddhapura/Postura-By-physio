// @ts-check
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Generic default intro + symptoms blocks used for posts 2-6
 * so the web page renders cleanly for every record without forcing
 * the admin to fill in long-form content just to seed.
 */
function genericIntro(title) {
  return {
    introEyebrow: "Intro",
    introTitle: "Introduction",
    introDescription: `This article explores practical, physiotherapy-led ways to address ${title.toLowerCase()} and the daily habits that influence recovery and long-term comfort.`,
    introDescription2:
      "We'll look at why these issues develop, the warning signs to watch, and the treatment approaches that tend to work best for desk-based, active, and older adults alike.",
    introImageSrc: "/blog-intro.jpg",
    introImageAlt: "blog introduction",
  };
}

function genericSymptoms() {
  return {
    symptomsEyebrow: "Symptoms",
    symptomsTitle: "Common Symptoms to Watch",
    symptomsDescription:
      "Early recognition of these symptoms can help prevent progression into chronic conditions.",
    symptomsBullets: [
      "Persistent stiffness or soreness",
      "Pain that worsens with prolonged activity",
      "Reduced range of motion",
      "Headaches or referred discomfort",
      "Tingling or weakness in affected limbs",
      "Fatigue during sustained tasks",
    ],
    symptomsImageSrc: "/blog-symptoms.jpg",
    symptomsImageAlt: "common symptoms",
    symptomsFlipImage: false,
  };
}

const posts = [
  {
    // ---- Post 1: full detail (all sections) ----
    title: "Neck Pain in IT Professionals: Causes & Physiotherapy Solutions",
    imageSrc: "/blog1-details.jpg",
    date: "2026-02-27",
    author: "Edward",
    eyebrow: "Here is a detailed blog article content you can use for",
    excerpt:
      "Long hours at a desk, screens at the wrong height, and sustained forward-head posture are some of the most common reasons IT professionals develop neck pain.",
    tags: ["neck-pain", "ergonomics", "it-professionals"],

    introEyebrow: "Intro",
    introTitle: "Introduction",
    introDescription:
      "In today's digital work culture, IT professionals and desk-based employees spend long hours sitting in front of computers. While technology improves productivity, it also increases the risk of posture-related health problems, especially neck pain. What often begins as mild stiffness or occasional discomfort can gradually develop into chronic pain affecting daily performance and overall well-being.",
    introDescription2:
      "Understanding the causes of neck pain and adopting structured physiotherapy solutions can help individuals manage symptoms effectively and prevent long-term complications.",
    introImageSrc: "/blog-intro.jpg",
    introImageAlt: "blog introduction",

    causesEyebrow: "Why Neck Pain is Common Among IT Professionals",
    causesTitle: "Common Causes of Neck Pain in Desk Jobs",
    causesDescription:
      "Sedentary routines, forward head posture, and workplace stress often contribute to muscle tension and cervical discomfort. Understanding these factors is the first step toward effective prevention and recovery.",
    causesColumns: 4,
    causesItems: [
      {
        title: "Prolonged Sitting & Poor Posture",
        description:
          "Continuous screen use often leads to forward head posture, rounded shoulders, and increased strain on cervical muscles.",
        icon: "Armchair",
      },
      {
        title: "Repetitive Work Movements",
        description:
          "Constant typing, mouse usage, and minimal movement throughout the day can create muscle tension and reduced joint mobility.",
        icon: "MousePointer2",
      },
      {
        title: "Sedentary Lifestyle & Weak Muscles",
        description:
          "Limited physical activity weakens postural support muscles, especially in the neck, shoulders, and core.",
        icon: "PersonStanding",
      },
      {
        title: "Stress & Mental Fatigue",
        description:
          "Work deadlines and mental pressure can cause unconscious muscle tightening, further increasing neck stiffness and discomfort.",
        icon: "Brain",
      },
    ],

    symptomsEyebrow: "Symptoms",
    symptomsTitle: "Common Symptoms to Watch",
    symptomsDescription:
      "Early recognition of these symptoms can help prevent progression into chronic cervical conditions.",
    symptomsBullets: [
      "Persistent neck stiffness or soreness",
      "Pain radiating to shoulders or upper back",
      "Reduced ability to turn or tilt the head",
      "Headaches originating from the base of the skull",
      "Tingling or numbness in arms or fingers",
      "Fatigue during prolonged computer work",
    ],
    symptomsImageSrc: "/blog-symptoms.jpg",
    symptomsImageAlt: "common symptoms",
    symptomsFlipImage: false,

    solutionsEyebrow: "How Helps",
    solutionsTitle: "Physiotherapy\nSolutions for\nNeck Pain",
    solutionsDescription:
      "Through guided treatment techniques, posture correction, and strengthening exercises, physiotherapy helps relieve stiffness, enhance flexibility, and support long-term neck health for desk-based professionals.",
    solutionsItems: [
      {
        title: "Pain Relief & Muscle Relaxation",
        description:
          "Manual therapy techniques, soft tissue mobilization, and therapeutic modalities help reduce muscle tightness and improve blood circulation. This provides immediate relief from discomfort and promotes tissue healing.",
        icon: "HandHeart",
      },
      {
        title: "Posture Correction & Ergonomic Guidance",
        description:
          "Physiotherapists assess workplace posture and recommend ergonomic adjustments such as proper screen height, chair support, and desk positioning. These corrections reduce strain on neck structures during daily tasks.",
        icon: "LaptopMinimal",
      },
      {
        title: "Strengthening & Mobility Exercises",
        description:
          "Targeted exercises improve neck stability, shoulder strength, and spinal alignment. Strengthening deep postural muscles helps maintain correct positioning and reduces the risk of recurring pain.",
        icon: "Dumbbell",
      },
      {
        title: "Functional Movement Training",
        description:
          "Guided stretching and movement routines restore flexibility and joint mobility. Regular practice enhances endurance, allowing individuals to work comfortably for longer durations.",
        icon: "Footprints",
      },
    ],

    conclusionTitle: "Conclusion",
    conclusionParagraphs: [
      "Neck pain among IT professionals is a growing concern due to sedentary work patterns and posture-related strain. However, with early intervention, structured physiotherapy care, and simple lifestyle modifications, individuals can effectively manage pain and maintain healthy movement.",
      "Prioritizing posture awareness, regular exercise, and ergonomic practices not only supports physical well-being but also enhances work efficiency and overall quality of life.",
    ],
  },

  // ---- Posts 2-6: hero + intro + symptoms only ----
  {
    title: "The Importance of Postural Correction for Desk Workers",
    imageSrc: "/blog2.jpg",
    date: "2026-02-18",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    excerpt:
      "Posture is not about sitting perfectly still all day—it is about varying position, supporting the spine, and avoiding prolonged loading on the same tissues.",
    tags: ["posture", "desk-workers"],
  },
  {
    title: "Safe Exercises for Post-Pregnancy Recovery",
    imageSrc: "/blog3.jpg",
    date: "2026-02-10",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    excerpt:
      "After delivery, the body needs gradual reloading of the core and pelvic floor—not an immediate return to high-impact training.",
    tags: ["post-natal", "pregnancy", "recovery"],
  },
  {
    title: "Managing Knee Pain with Structured Rehabilitation",
    imageSrc: "/blog4.jpg",
    date: "2026-01-28",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    excerpt:
      "Knee pain may come from the joint, surrounding muscles, or movement patterns at the hip and ankle. A structured rehab plan identifies the main drivers.",
    tags: ["knee-pain", "rehabilitation"],
  },
  {
    title: "Benefits of Yoga Therapy for Stress & Flexibility",
    imageSrc: "/blog5.jpg",
    date: "2026-01-15",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    excerpt:
      "Yoga therapy blends mindful movement, breathing, and pacing suited to your body—not a one-size-fits class pace.",
    tags: ["yoga", "stress", "flexibility"],
  },
  {
    title: "Senior Wellness: Improving Balance & Mobility with Physiotherapy",
    imageSrc: "/blog6.jpg",
    date: "2026-01-05",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    excerpt:
      "Balance and strength decline with age, but they respond well to targeted exercise.",
    tags: ["seniors", "balance", "mobility"],
  },
];

/**
 * Fill in sensible intro + symptoms defaults for lightweight posts so
 * every seeded record validates against the full schema.
 */
function withDefaults(p) {
  const intro = genericIntro(p.title);
  const symptoms = genericSymptoms();
  return {
    // hero
    title: p.title,
    imageSrc: p.imageSrc,
    date: p.date,
    author: p.author,
    eyebrow: p.eyebrow,
    excerpt: p.excerpt,
    tags: p.tags,

    // intro
    introEyebrow: p.introEyebrow ?? intro.introEyebrow,
    introTitle: p.introTitle ?? intro.introTitle,
    introDescription: p.introDescription ?? intro.introDescription,
    introDescription2: p.introDescription2 ?? intro.introDescription2,
    introImageSrc: p.introImageSrc ?? intro.introImageSrc,
    introImageAlt: p.introImageAlt ?? intro.introImageAlt,

    // causes (optional)
    causesEyebrow: p.causesEyebrow ?? null,
    causesTitle: p.causesTitle ?? null,
    causesDescription: p.causesDescription ?? null,
    causesColumns: p.causesColumns ?? null,
    causesItems: p.causesItems ?? null,

    // symptoms
    symptomsEyebrow: p.symptomsEyebrow ?? symptoms.symptomsEyebrow,
    symptomsTitle: p.symptomsTitle ?? symptoms.symptomsTitle,
    symptomsDescription: p.symptomsDescription ?? symptoms.symptomsDescription,
    symptomsBullets: p.symptomsBullets ?? symptoms.symptomsBullets,
    symptomsImageSrc: p.symptomsImageSrc ?? symptoms.symptomsImageSrc,
    symptomsImageAlt: p.symptomsImageAlt ?? symptoms.symptomsImageAlt,
    symptomsFlipImage: p.symptomsFlipImage ?? symptoms.symptomsFlipImage,

    // solutions (optional)
    solutionsEyebrow: p.solutionsEyebrow ?? null,
    solutionsTitle: p.solutionsTitle ?? null,
    solutionsDescription: p.solutionsDescription ?? null,
    solutionsItems: p.solutionsItems ?? null,

    // conclusion (optional)
    conclusionTitle: p.conclusionTitle ?? null,
    conclusionParagraphs: p.conclusionParagraphs ?? [],
  };
}

async function main() {
  for (const raw of posts) {
    const p = withDefaults(raw);
    const slug = slugify(p.title);
    const publishedAt = new Date(p.date);

    const data = {
      title: p.title,
      eyebrow: p.eyebrow,
      excerpt: p.excerpt,
      imageSrc: p.imageSrc,
      author: p.author,
      tags: p.tags,
      published: true,
      publishedAt,

      introEyebrow: p.introEyebrow,
      introTitle: p.introTitle,
      introDescription: p.introDescription,
      introDescription2: p.introDescription2,
      introImageSrc: p.introImageSrc,
      introImageAlt: p.introImageAlt,

      causesEyebrow: p.causesEyebrow,
      causesTitle: p.causesTitle,
      causesDescription: p.causesDescription,
      causesColumns: p.causesColumns,
      causesItems: p.causesItems ?? Prisma.JsonNull,

      symptomsEyebrow: p.symptomsEyebrow,
      symptomsTitle: p.symptomsTitle,
      symptomsDescription: p.symptomsDescription,
      symptomsBullets: p.symptomsBullets,
      symptomsImageSrc: p.symptomsImageSrc,
      symptomsImageAlt: p.symptomsImageAlt,
      symptomsFlipImage: p.symptomsFlipImage,

      solutionsEyebrow: p.solutionsEyebrow,
      solutionsTitle: p.solutionsTitle,
      solutionsDescription: p.solutionsDescription,
      solutionsItems: p.solutionsItems ?? Prisma.JsonNull,

      conclusionTitle: p.conclusionTitle,
      conclusionParagraphs: p.conclusionParagraphs,
    };

    const blog = await prisma.blog.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });

    console.log(`upserted blog: ${blog.slug}`);
  }
}

/**
 * Gallery seed. Mirrors the image sets that used to be hardcoded in
 * `apps/web/components/Gallery/*`. Each category gets the number of images
 * its web section expects (5–6) so the layouts fill correctly.
 */
const galleryImages = [
  // Physiotherapy — masonry section (5 images)
  { url: "/physio-1.jpg", alt: "Physiotherapy session on treatment table", category: "physiotherapy" },
  { url: "/physio-2.jpg", alt: "Therapeutic taping and back care", category: "physiotherapy" },
  { url: "/physio-3.jpg", alt: "Physiotherapy on exercise mat", category: "physiotherapy" },
  { url: "/physio-physio.jpg", alt: "Shoulder and mobility physiotherapy", category: "physiotherapy" },
  { url: "/physio-4.jpg", alt: "Lower limb stretching and rehab", category: "physiotherapy" },

  // Aerobics — split-feature section (6 images)
  { url: "/physio-aerobics.jpg", alt: "Aerobics and mobility on the floor", category: "aerobics" },
  { url: "/pn-aerobics.jpg", alt: "Group leg lifts on exercise mats", category: "aerobics" },
  { url: "/gr-aerobics.jpg", alt: "Step aerobics class", category: "aerobics" },
  { url: "/athlete-3.jpg", alt: "Step platform aerobics session", category: "aerobics" },
  { url: "/athlete-2.jpg", alt: "Squats with light weights in the gym", category: "aerobics" },
  { url: "/society-aerobics.jpg", alt: "Group aerobics with dumbbells", category: "aerobics" },

  // Yoga — yoga therapy section (6 images)
  { url: "/society-yoga.jpg", alt: "Group yoga practice", category: "yoga" },
  { url: "/pn-yoga.jpg", alt: "Prenatal and wellness yoga", category: "yoga" },
  { url: "/gr-yoga.jpg", alt: "Gentle yoga for mobility", category: "yoga" },
  { url: "/it-yoga.jpg", alt: "Yoga for strength and balance", category: "yoga" },
  { url: "/physio-yoga.jpg", alt: "Yoga and flexibility session", category: "yoga" },
  { url: "/society-aerobics.jpg", alt: "Group yoga class with mats", category: "yoga" },

  // Pilates — pilates therapy section (5 images)
  { url: "/physio-pilates.jpg", alt: "Pilates core training", category: "pilates" },
  { url: "/society-pilates.jpg", alt: "Group pilates session", category: "pilates" },
  { url: "/pn-pilates.jpg", alt: "Pilates for stability", category: "pilates" },
  { url: "/gr-pilates.jpg", alt: "Rehab-focused pilates", category: "pilates" },
  { url: "/it-pilates.jpg", alt: "Pilates movement patterns", category: "pilates" },

  // Corporate — corporate wellness section (5 images)
  { url: "/cp-1.jpg", alt: "Corporate wellness and desk ergonomics", category: "corporate" },
  { url: "/cp-2.jpg", alt: "Workplace movement and stretching", category: "corporate" },
  { url: "/corporate-hero.png", alt: "Corporate wellness programs", category: "corporate" },
  { url: "/it-common-challenges.jpg", alt: "Office posture and wellbeing", category: "corporate" },
  { url: "/blog4.jpg", alt: "Team wellness activities", category: "corporate" },
];

async function seedGallery() {
  // Reset the category so re-seeding always yields the exact layout we want,
  // and the order stays deterministic.
  const categories = [...new Set(galleryImages.map((g) => g.category))];
  for (const cat of categories) {
    await prisma.galleryImage.deleteMany({ where: { category: cat } });
  }

  const byCat = new Map();
  for (const img of galleryImages) {
    const next = (byCat.get(img.category) ?? -1) + 1;
    byCat.set(img.category, next);
    await prisma.galleryImage.create({
      data: { ...img, order: next },
    });
  }
  console.log(`upserted gallery images: ${galleryImages.length}`);
}

main()
  .then(() => seedGallery())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
