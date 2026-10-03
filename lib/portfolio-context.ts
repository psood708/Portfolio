import {
  BIO_REGISTERS,
  LAB,
  PRINCIPLES,
  PROJECTS,
  SITE,
  STACK,
  TIMELINE,
} from "./content";

/**
 * The grounding document the ask bar's model answers from.
 *
 * It is rendered from `lib/content.ts` rather than retyped, so editing a project
 * or a timeline entry there updates what the model knows. Everything the site
 * displays, the model can cite; anything it cannot cite, it must decline.
 *
 * Two properties matter and are easy to break:
 *
 *   · It is a module-level constant, built once at import. Nothing per-request,
 *     no `Date.now()`, no unordered key iteration. The system prompt is the
 *     cached prefix, and any byte that drifts between requests silently costs a
 *     cache hit (~$0.028 instead of ~$0.009 a question).
 *   · It is ~4k tokens, which fits whole. That is why there is no retrieval
 *     step here — chunking a corpus this small would only lose context.
 */

/** Facts from the resume that the site does not render anywhere. */
const EXTRA_CONTEXT = `
ADDITIONAL BACKGROUND (from resume, not shown on the site)

Aspect Ratio Pvt. Ltd. — Data Science Analyst, Jan 2025 to present, Pune, Maharashtra.
  · Architected and optimised scalable ML pipelines for patient cohort extraction from
    high-dimensional healthcare datasets, keeping data integrity across both structured
    and unstructured records.
  · Built a physician referral network combining referral frequency with
    PubMedBERT-based publication signals.
  · Applied BioBERT to physician EHR notes (diagnosis records, medications, biomarker
    tests), then UMAP for dimensionality reduction and BERTopic for clustering, to
    uncover prescribing patterns by physician.

Space Application Centre, ISRO — Machine Learning Researcher Intern, June 2024 to Sept 2024,
Ahmedabad, Gujarat.
  · Ran high-throughput distributed pipelines in PySpark over 10TB+ of mission-critical
    telemetry in a high-security environment, improving end-to-end throughput by 60%.
  · Built real-time monitoring and streaming API ingestion using Kalman filters for
    anomaly detection, and cut distributed Spark training time by 45% through resource
    orchestration.

MoMacMo — Software Engineer Intern, Mar 2023 to Apr 2024, remote.
  · Accelerated Spring Boot applications and ML algorithms for seismic data analysis,
    reaching a 40% improvement in model accuracy via cloud-native migration and tuning.
  · Shipped scalable REST APIs on AWS Elastic Beanstalk, API Gateway and Cognito,
    enabling live client demonstrations that drove a 35% increase in profitability.

Pandit Deendayal Energy University (PDEU) — B.Tech, Computer Engineering,
Sept 2021 to Apr 2025. CGPA 9.41/10. Relevant coursework: Distributed Systems,
Data Architecture, Statistics, Software Engineering.

AVAILABILITY
Open to applied AI roles and freelance builds. Replies within 48 hours.
Contact: ${SITE.email}. GitHub: github.com/psood708. LinkedIn: linkedin.com/in/parth-sood.
`.trim();

function renderProjects(): string {
  return PROJECTS.map(
    (p) =>
      `${p.num}. ${p.name} (${p.year}) — ${p.line}\n` +
      `    stack: ${p.stack}\n` +
      `    result: ${p.metric} ${p.metricLabel}\n` +
      `    tags: ${p.tags.join(", ")}\n` +
      `    link: ${p.href}`,
  ).join("\n");
}

function renderLab(): string {
  return LAB.map(
    (l) => `· ${l.name} (${l.date}, ${l.status}) — ${l.line} ${l.href}`,
  ).join("\n");
}

function renderTimeline(): string {
  return TIMELINE.map((t) => `· ${t.when} — ${t.where}: ${t.what}`).join("\n");
}

function renderPrinciples(): string {
  return PRINCIPLES.map((p) => `· ${p.index}: ${p.title} — ${p.body}`).join("\n");
}

export const PORTFOLIO_CONTEXT = `
WHO
${SITE.name}, applied AI engineer. Currently Data Science Analyst at Aspect Ratio.
Self-description, in his own voice: ${BIO_REGISTERS[1].text}

He works between research and product — clinical NLP and cohort pipelines by day;
vector indexes, agent systems and the evals that keep them honest the rest of the time.
He cares about evals, latency budgets and the unglamorous plumbing that makes AI
trustworthy.

SHIPPED WORK
${renderProjects()}

THE LAB (smaller builds and experiments)
${renderLab()}

CAREER
${renderTimeline()}

HOW HE WORKS
${renderPrinciples()}

STACK
${STACK.join(", ")}

${EXTRA_CONTEXT}
`.trim();
