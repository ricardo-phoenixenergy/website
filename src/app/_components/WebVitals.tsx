'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { dlPush } from '@/lib/analytics';

export function WebVitals() {
  useReportWebVitals(metric => {
    dlPush({
      event: 'web_vitals',
      metric_name: metric.name,
      metric_value: Math.round(metric.value),
      metric_rating: metric.rating,
    });
  });
  return null;
}
