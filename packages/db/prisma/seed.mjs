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

/**
 * Testimonial seed. Mirrors the 18-entry list that used to live in
 * `apps/web/components/Testimonials/TestimonialsReviewsSection.tsx`.
 * `order` is assigned by index so the public page renders in the same
 * sequence it always has.
 */
const testimonials = [
  { tag: "IT Professional", quote: "Long sitting hours caused severe neck pain. After treatment, I feel much more comfortable and productive at work.", name: "Rahul Shah", age: 30, avatar: "/cp-1.jpg" },
  { tag: "Homemaker", quote: "The aerobics and yoga sessions improved my energy and flexibility. I feel more active throughout the day.", name: "Neha Patel", age: 42, avatar: "/pn-yoga.jpg" },
  { tag: "Corporate / Desk Job", quote: "My lower back pain from long meetings eased within weeks. The posture guidance alone changed how I sit and move.", name: "Amit Desai", age: 38, avatar: "/it-physiotherapy.jpg" },
  { tag: "Teacher / Standing Job", quote: "Standing all day hurt my knees and feet. The structured exercises fit my schedule and the pain is finally manageable.", name: "Pooja Mehta", age: 45, avatar: "/society-1.jpg" },
  { tag: "Healthcare Worker", quote: "Shift work and lifting left me with shoulder strain. Professional, patient-focused care got me back to full duty.", name: "Dr. Sanjay Rao", age: 36, avatar: "/gr-physio.jpg" },
  { tag: "Senior Citizen", quote: "Balance and walking confidence improved after geriatric rehab. I feel safer at home and enjoy short walks again.", name: "Kamlesh Shah", age: 72, avatar: "/gr-1.jpg" },
  { tag: "Athlete", quote: "The rehab program helped me recover from injury and return to sports stronger than before.", name: "Kunal Joshi", age: 27, avatar: "/athlete-physio.jpg" },
  { tag: "Student", quote: "Screen time and study posture gave me headaches. Simple corrections and stretches made a big difference in weeks.", name: "Isha Verma", age: 21, avatar: "/bi-1.jpg" },
  { tag: "Pre & Post Natal", quote: "Supportive, gentle sessions after delivery helped me rebuild core strength without feeling rushed or overwhelmed.", name: "Ananya Krishnan", age: 31, avatar: "/pn-1.jpg" },
  { tag: "Fitness Enthusiast", quote: "Prehab sessions reduced niggles before they became injuries. I train harder with better body awareness now.", name: "Vikram Singh", age: 29, avatar: "/athlete-1.jpg" },
  { tag: "Society Member", quote: "Group sessions in our society are fun and consistent. My stamina and flexibility improved more than I expected.", name: "Meera Iyer", age: 55, avatar: "/society-yoga.jpg" },
  { tag: "Physiotherapy Patient", quote: "Clear explanations and a step-by-step plan helped me trust the process. I'm pain-free and moving freely again.", name: "Harsh Trivedi", age: 34, avatar: "/physio-1.jpg" },
  { tag: "IT Professional", quote: "Doorstep sessions saved my commute time and recovery stayed on track. Highly recommend for busy professionals.", name: "Priya Nair", age: 33, avatar: "/cp-2.jpg" },
  { tag: "Homemaker", quote: "Knee stiffness from daily chores reduced noticeably. The home exercises were easy to follow between visits.", name: "Sunita Dave", age: 48, avatar: "/bi-2.jpg" },
  { tag: "Corporate / Desk Job", quote: "Wrist and forearm pain from typing improved with ergonomic tips plus therapy. I finally sleep without discomfort.", name: "Rohan Kapadia", age: 41, avatar: "/it-common-challenges.jpg" },
  { tag: "Senior Citizen", quote: "My family noticed I climb stairs more confidently. Gentle progress each week kept me motivated.", name: "Jayantibhai Modi", age: 68, avatar: "/gr-2.jpg" },
  { tag: "Athlete", quote: "Return-to-play was structured and safe. I trust the team to push me without risking re-injury.", name: "Dev Patel", age: 24, avatar: "/athlete-2.jpg" },
  { tag: "Student", quote: "Online consults between exams fit my routine. Practical advice I could do in my hostel room.", name: "Arjun Malhotra", age: 20, avatar: "/blog-intro.jpg" },
];

async function seedTestimonials() {
  // Reset so re-seeding is deterministic and order stays stable.
  await prisma.testimonial.deleteMany({});
  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.create({
      data: { ...testimonials[i], order: i, published: true },
    });
  }
  console.log(`upserted testimonials: ${testimonials.length}`);
}

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

/**
 * Availability seed. Mirrors the hard-coded TIME_SLOTS that used to live
 * in `apps/web/components/Contact/BookingDateTimeField.tsx`. We seed
 * Mon-Sat (1-6) with these times; Sunday is left empty = clinic closed.
 * Admin can edit everything from the `/bookings` > Availability tab.
 */
const DEFAULT_WEEKLY_SLOTS = [
  { time: "7:00 AM", minutes: 7 * 60 },
  { time: "8:30 AM", minutes: 8 * 60 + 30 },
  { time: "10:00 AM", minutes: 10 * 60 },
  { time: "11:30 AM", minutes: 11 * 60 + 30 },
  { time: "2:00 PM", minutes: 14 * 60 },
  { time: "4:00 PM", minutes: 16 * 60 },
  { time: "5:30 PM", minutes: 17 * 60 + 30 },
];

async function seedAvailability() {
  // Only seed if the template is empty — never clobber admin edits on re-seed.
  const existing = await prisma.availabilitySlot.count();
  if (existing > 0) {
    console.log(
      `availability already populated (${existing} slots) — skipping seed`
    );
    return;
  }

  const rows = [];
  for (let dow = 1; dow <= 6; dow++) {
    for (const { time, minutes } of DEFAULT_WEEKLY_SLOTS) {
      rows.push({ dayOfWeek: dow, time, sortKey: minutes });
    }
  }
  await prisma.availabilitySlot.createMany({ data: rows });
  console.log(`seeded availability slots: ${rows.length}`);
}

main()
  .then(() => seedGallery())
  .then(() => seedTestimonials())
  .then(() => seedAvailability())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
