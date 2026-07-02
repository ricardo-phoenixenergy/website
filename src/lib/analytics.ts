type DlEvent =
  | { event: 'form_submit';         form_name: 'contact'; service_interest: string }
  | { event: 'cta_click';           cta_label: string; cta_location: string }
  | { event: 'drawer_open';         project_slug: string; project_vertical: string }
  | { event: 'valuation_complete';  kw: number; bess_kwh: number; install_year: number }
  | { event: 'valuation_lead';      estimated_value_band: string }
  | { event: 'paywall_unlock';      estimated_value_band: string }
  | { event: 'blog_read_complete';  post_slug: string; post_category?: string }
  | { event: 'tab_change';          vertical: string; tab_label: string }
  | { event: 'strategy_finder_start';    vertical: string }
  | { event: 'strategy_finder_complete'; vertical: string; goal: string; energy_rate: string; demand_charge: string; usage: string; strategy: string }
  | { event: 'strategy_learn_more';      vertical: string; strategy: string }
  | { event: 'wheeling_eligibility_start';    vertical: string }
  | { event: 'wheeling_eligibility_complete'; vertical: string; tou: string; supply_point: string; status: string }
  | { event: 'carbon_estimate_used';          vertical: string; size_kwp: number }
  | { event: 'fleet_estimate_used';           vertical: string; vehicles: number; charging: string }
  | { event: 'filter_change';       filter_value: string }
  | { event: 'scroll_depth';        depth_percentage: 25 | 50 | 75 | 90; page_path: string }
  | { event: 'web_vitals';          metric_name: string; metric_value: number; metric_rating: string };

export function dlPush(payload: DlEvent): void {
  if (typeof window === 'undefined') return;
  (window as unknown as { dataLayer?: object[] }).dataLayer ??= [];
  ((window as unknown as { dataLayer: object[] }).dataLayer).push(payload);
}
