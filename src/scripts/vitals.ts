import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

type UmamiWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, unknown>) => void };
};

function report({ name, value, rating }: Metric) {
  const umami = (window as UmamiWindow).umami;
  if (!umami) return;
  // CLS is a unitless ratio; the rest are milliseconds. Keep the payload small.
  const rounded = name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);
  umami.track("web-vitals", { metric: name, value: rounded, rating });
}

onCLS(report);
onFCP(report);
onINP(report);
onLCP(report);
onTTFB(report);
