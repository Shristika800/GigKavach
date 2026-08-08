export type SafeRoute = {
  id: number;
  safetyScore: number;
  reasons: string[];
};

export function analyzeRouteSafety(route: any): SafeRoute {
  // Base score
  let score = 100;

  // Temporary dummy scoring
  score -= Math.floor(Math.random() * 35);

  const reasons: string[] = [];

  if (score > 90) {
    reasons.push("Well-lit roads");
    reasons.push("High pedestrian activity");
    reasons.push("Good mobile network");
  } else if (score > 80) {
    reasons.push("Moderate lighting");
    reasons.push("Normal traffic");
  } else {
    reasons.push("Poor lighting");
    reasons.push("Low pedestrian activity");
    reasons.push("Potentially isolated roads");
  }

  return {
    id: route.id ?? 0,
    safetyScore: score,
    reasons,
  };
}