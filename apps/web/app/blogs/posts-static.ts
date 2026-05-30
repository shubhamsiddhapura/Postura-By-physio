/** Temporary static blog data; replace with API/fetch when ready. */

export type BlogPost = {
  id: string;
  imageSrc: string;
  title: string;
  date: string;
  author: string;
  eyebrow: string;
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    imageSrc: "/blog1-details.jpg",
    title: "Neck Pain in IT Professionals: Causes & Physiotherapy Solutions",
    date: "February 27, 2026",
    author: "Edward",
    eyebrow: "Here is a detailed blog article content you can use for",
    paragraphs: [
      "Long hours at a desk, screens at the wrong height, and sustained forward-head posture are some of the most common reasons IT professionals develop neck pain. Over time, muscles in the upper back and neck become overloaded, leading to stiffness, headaches, and reduced concentration.",
      "Physiotherapy focuses on restoring mobility, strengthening deep neck flexors and scapular stabilizers, and retraining posture for real work setups—not idealized ones. Hands-on techniques, targeted exercise, and ergonomic guidance together help you break the cycle of pain.",
      "If neck pain is affecting your work or sleep, an assessment can identify whether the issue is muscular, joint-related, or linked to nerve irritation. Early intervention usually means a shorter recovery and fewer flare-ups later.",
    ],
  },
  {
    id: "2",
    imageSrc: "/blog2.jpg",
    title: "The Importance of Postural Correction for Desk Workers",
    date: "February 18, 2026",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    paragraphs: [
      "Posture is not about sitting perfectly still all day—it is about varying position, supporting the spine, and avoiding prolonged loading on the same tissues. Small adjustments to chair height, monitor distance, and keyboard placement often make an immediate difference.",
      "Structured exercises that open the chest, strengthen the mid-back, and improve hip mobility help desk workers maintain alignment without tension. Your physiotherapist can tailor a short routine that fits breaks between meetings.",
      "Consistency matters more than intensity. A few minutes of movement every hour usually outperforms one long session at the end of the day.",
    ],
  },
  {
    id: "3",
    imageSrc: "/blog3.jpg",
    title: "Safe Exercises for Post-Pregnancy Recovery",
    date: "February 10, 2026",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    paragraphs: [
      "After delivery, the body needs gradual reloading of the core and pelvic floor—not an immediate return to high-impact training. Walking, breathing drills, and gentle mobility work are safe starting points for most new mothers when cleared by their clinician.",
      "Diastasis recti, pelvic girdle pain, and fatigue are common; exercises should be chosen to support healing rather than challenge stability too soon. Progression is guided by symptoms, strength, and everyday function.",
      "A physiotherapist with experience in post-natal care can help you sequence strength work so you return to activity confidently and safely.",
    ],
  },
  {
    id: "4",
    imageSrc: "/blog4.jpg",
    title: "Managing Knee Pain with Structured Rehabilitation",
    date: "January 28, 2026",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    paragraphs: [
      "Knee pain may come from the joint, surrounding muscles, or movement patterns at the hip and ankle. A structured rehab plan identifies the main drivers and addresses them with mobility, strength, and control exercises.",
      "Loading the knee progressively—without provoking sharp pain—helps tissues adapt. Cycling, step-ups, and targeted quadriceps and hip work are examples of tools used at different stages.",
      "Patience and tracking symptoms over weeks, not days, usually reflect how connective tissue and strength actually change.",
    ],
  },
  {
    id: "5",
    imageSrc: "/blog5.jpg",
    title: "Benefits of Yoga Therapy for Stress & Flexibility",
    date: "January 15, 2026",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    paragraphs: [
      "Yoga therapy blends mindful movement, breathing, and pacing suited to your body—not a one-size-fits class pace. That makes it useful for stress reduction and for improving flexibility when joints need gentle, repeated exposure to range.",
      "For people with pain or hypermobility, modifications and props ensure tissues are challenged without irritation. A therapist can align practices with your rehab goals.",
      "Regular short sessions often improve sleep quality and perceived stress as much as they improve hamstring or thoracic mobility.",
    ],
  },
  {
    id: "6",
    imageSrc: "/blog6.jpg",
    title: "Senior Wellness: Improving Balance & Mobility with Physiotherapy",
    date: "January 05, 2026",
    author: "Dr. Priyanshi Pandya",
    eyebrow: "Postura Insights",
    paragraphs: [
      "Balance and strength decline with age, but they respond well to targeted exercise. Physiotherapy for seniors often combines gait training, lower-limb strengthening, and dual-task challenges that mirror real life.",
      "Fear of falling can cause people to move less—which further reduces capacity. Graduated exposure to safe, supported movement rebuilds confidence.",
      "Programs can be delivered at home or in community settings, focusing on independence and quality of life.",
    ],
  },
];

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find((p) => p.id === id);
}
