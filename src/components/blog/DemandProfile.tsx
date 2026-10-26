// src/components/blog/DemandProfile.tsx
// A month of half-hour demand readings with the one that sets the demand
// charge marked, to show how a kVA demand charge is billed. The profile is
// illustrative, generated from a few figures rather than stored:
// - an office-hours site: a day shift on weekdays, a quarter of the peak
//   overnight and at weekends, with the next highest half-hour as entered;
// - one half-hour (10:30 on a weekday mid-month) reaches the maximum demand.
// The same white panel as the bar chart. The plot is an SVG stretched to the
// panel, with lines that keep their width; every label is HTML, so text stays
// readable on a phone. Under the plot, the sum the meter reading feeds:
// maximum demand times the rate, and what the month would cost without that
// half-hour. Server-rendered with no chart script, so no hover; screen readers
// get the same figures as a table.

interface DemandProfileProps {
  title?: string;
  /** Any date in the billing month, as Sanity stores it: YYYY-MM-DD. */
  month?: string;
  /** The month's highest half-hour, in kVA. */
  peakKva?: number;
  /** The highest of every other half-hour in the month. Optional. */
  usualKva?: number;
  /** The demand charge, rand per kVA a month. */
  rate?: number;
  note?: string;
}

export interface DemandMonth {
  readings: number[];
  days: number;
  /** Day of the week of the 1st, Sunday 0. */
  firstWeekday: number;
  /** Day of the month (1-based) and slot of the peak half-hour. */
  peakDay: number;
  peakSlot: number;
  usualKva: number;
}

const SLOTS_PER_DAY = 48;
const PEAK_SLOT = 21; // 10:30 to 11:00
const BASE_SHARE = 0.25;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// A small seeded generator, so the same month always draws the same profile.
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const isWeekday = (weekday: number) => weekday > 0 && weekday < 6;

export function demandMonth(year: number, monthIndex: number, peakKva: number, usualKva?: number): DemandMonth {
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const base = peakKva * BASE_SHARE;
  const usual = usualKva !== undefined && usualKva > base * 1.2 && usualKva < peakKva ? usualKva : peakKva * 0.8;
  const random = seeded(year * 100 + monthIndex);
  const readings: number[] = [];

  for (let day = 0; day < days; day++) {
    const working = isWeekday((firstWeekday + day) % 7);
    const top = usual * (0.86 + 0.14 * random());
    for (let slot = 0; slot < SLOTS_PER_DAY; slot++) {
      const hour = slot / 2;
      const quiet = base * (0.94 + 0.12 * random());
      let kva = quiet;
      if (working && hour >= 6 && hour < 7) kva = base + (top - base) * ((hour - 5.5) / 1.5);
      else if (working && hour >= 7 && hour < 16.5) kva = top * (hour >= 12.5 && hour < 13.5 ? 0.86 : 0.93 + 0.07 * random());
      else if (working && hour >= 16.5 && hour < 18) kva = top - (top - base) * ((hour - 16) / 2);
      readings.push(kva);
    }
  }

  // Stretch everything above the base load so the highest half-hour is exactly
  // the usual peak, then add the one half-hour that sets the charge.
  const highest = Math.max(...readings);
  for (let i = 0; i < readings.length; i++) {
    if (readings[i] > base) readings[i] = base + ((readings[i] - base) * (usual - base)) / (highest - base);
  }
  // The first weekday from the 14th on.
  let peakDay = 14;
  while (!isWeekday((firstWeekday + peakDay - 1) % 7)) peakDay++;
  readings[(peakDay - 1) * SLOTS_PER_DAY + PEAK_SLOT] = peakKva;

  return { readings, days, firstWeekday, peakDay, peakSlot: PEAK_SLOT, usualKva: usual };
}

// A clean step for the kVA axis: 1, 2, 2.5 or 5 times a power of ten.
function niceStep(rough: number): number {
  const power = 10 ** Math.floor(Math.log10(rough));
  const steps = [1, 2, 2.5, 5, 10].map((s) => s * power);
  return steps.find((s) => s >= rough) ?? 10 * power;
}

const rand = (value: number, decimals = 0) =>
  `R${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
const kva = (value: number) => `${Math.round(value).toLocaleString('en-US')} kVA`;
const pct = (fraction: number) => `${(fraction * 100).toFixed(3)}%`;

export function DemandProfile({ title, month, peakKva, usualKva, rate, note }: DemandProfileProps) {
  const date = /^(\d{4})-(\d{2})/.exec(month ?? '');
  if (!date || !peakKva || !(peakKva > 0) || !rate || !(rate > 0)) return null;
  const year = Number(date[1]);
  const monthIndex = Number(date[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;

  const profile = demandMonth(year, monthIndex, peakKva, usualKva);
  const { readings, days, firstWeekday, peakDay } = profile;
  const showUsual = usualKva !== undefined && profile.usualKva === usualKva;
  const slots = readings.length;
  const step = niceStep(peakKva / 4);
  const top = Math.ceil((peakKva * 1.1) / step) * step;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const y = (value: number) => Math.round(top - value);
  const line = readings.map((value, i) => `${i === 0 ? 'M' : 'L'}${i} ${y(value)}`).join('');
  const area = `${line}L${slots - 1} ${top}L0 ${top}Z`;

  const monthName = `${MONTHS[monthIndex]} ${year}`;
  const shortMonth = MONTHS[monthIndex].slice(0, 3);
  const peakWhen = `${WEEKDAYS[(firstWeekday + peakDay - 1) % 7]} ${peakDay} ${shortMonth}, 10:30`;
  const peakX = ((peakDay - 1) * SLOTS_PER_DAY + PEAK_SLOT + 0.5) / slots;
  const charge = peakKva * rate;
  const without = profile.usualKva * rate;

  // Weekends shaded, Saturday and Sunday together.
  const weekends: { start: number; length: number }[] = [];
  for (let day = 0; day < days; day++) {
    const weekday = (firstWeekday + day) % 7;
    if (weekday === 6 || (weekday === 0 && day === 0)) weekends.push({ start: day, length: Math.min(weekday === 6 ? 2 : 1, days - day) });
  }
  // Every Monday, a week apart, so the labels never crowd on a phone.
  const dayLabels = Array.from({ length: days }, (_, day) => day).filter((day) => (firstWeekday + day) % 7 === 1);
  const heading = title?.trim();

  return (
    <figure className="my-8 rounded-card border border-pe-border bg-white px-4 py-5 sm:px-5 md:px-6">
      {heading && <figcaption className="pb-4 font-display text-base font-bold leading-6 text-pe-text">{heading}</figcaption>}
      <div aria-hidden="true">
        <div className="flex">
          <div className="relative w-9 shrink-0 font-body text-xs tabular-nums text-pe-muted">
            {ticks.map((tick) => (
              <span key={tick} className="absolute right-2 -translate-y-1/2 leading-none" style={{ top: pct(1 - tick / top) }}>
                {tick.toLocaleString('en-US')}
              </span>
            ))}
          </div>
          <div className="relative h-56 min-w-0 flex-1 sm:h-64">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${slots - 1} ${top}`} preserveAspectRatio="none">
              {weekends.map((weekend) => (
                <rect key={weekend.start} x={weekend.start * SLOTS_PER_DAY} y={0} width={weekend.length * SLOTS_PER_DAY} height={top} fill="var(--color-pe-bg)" />
              ))}
              {ticks.map((tick) => (
                <line key={tick} x1={0} x2={slots - 1} y1={y(tick)} y2={y(tick)} stroke="var(--color-pe-border)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              ))}
              <path d={area} fill="var(--color-pe-secondary)" fillOpacity={0.14} />
              <path d={line} fill="none" stroke="var(--color-pe-secondary-ink)" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {showUsual && (
                <line x1={0} x2={slots - 1} y1={y(profile.usualKva)} y2={y(profile.usualKva)} stroke="var(--color-pe-muted)" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
              )}
              <line x1={0} x2={slots - 1} y1={y(peakKva)} y2={y(peakKva)} stroke="var(--color-accent-wheeling-ink)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <span
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-wheeling-ink ring-2 ring-white"
              style={{ left: pct(peakX), top: pct(1 - peakKva / top) }}
            />
            <span
              className={`absolute -translate-y-full whitespace-nowrap pb-2 font-body text-xs font-semibold leading-none text-pe-text ${
                peakX < 0.25 ? '' : peakX > 0.75 ? '-translate-x-full' : '-translate-x-1/2'
              }`}
              style={{ left: pct(peakX), top: pct(1 - peakKva / top) }}
            >
              {kva(peakKva)}, {peakWhen}
            </span>
          </div>
        </div>
        <div className="relative ml-9 h-5 font-body text-xs tabular-nums text-pe-muted">
          {dayLabels.map((day) => (
            <span key={day} className={`absolute top-1.5 whitespace-nowrap leading-none ${day === 0 ? '' : '-translate-x-1/2'}`} style={{ left: pct((day * SLOTS_PER_DAY) / (slots - 1)) }}>
              {day + 1} {shortMonth}
            </span>
          ))}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-body text-xs leading-5 text-pe-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded-full bg-pe-secondary-ink" />
            kVA in each half-hour
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-accent-wheeling-ink" />
            Maximum demand, which sets the charge
          </span>
          {showUsual && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 border-t border-dashed border-pe-muted" />
              Next highest half-hour, {kva(profile.usualKva)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 rounded-[2px] bg-pe-bg ring-1 ring-pe-border" />
            Weekend
          </span>
        </p>
      </div>
      <div className="mt-4 space-y-1 rounded-lg bg-pe-bg px-4 py-3 font-body text-sm leading-6 text-pe-text-soft tabular-nums">
        <p>
          <span className="font-semibold text-pe-text">Demand charge for {monthName}:</span> {kva(peakKva)} × {rand(rate, 2)} ={' '}
          <span className="font-semibold text-pe-text">{rand(charge)}</span>
        </p>
        {showUsual && (
          <p>
            Without that half-hour, the maximum would be {kva(profile.usualKva)} and the charge {rand(without)}. One half-hour added{' '}
            {rand(charge - without)}.
          </p>
        )}
      </div>
      {/* A table ignores the 1px width sr-only sets, so the div holds it in. */}
      <div className="sr-only">
        <table>
          {heading && <caption>{heading}</caption>}
          <tbody>
            <tr>
              <th scope="row">Maximum demand</th>
              <td>
                {kva(peakKva)}, {peakWhen}
              </td>
            </tr>
            {showUsual && (
              <tr>
                <th scope="row">Next highest half-hour</th>
                <td>{kva(profile.usualKva)}</td>
              </tr>
            )}
            <tr>
              <th scope="row">Demand charge rate</th>
              <td>{rand(rate, 2)} per kVA</td>
            </tr>
            <tr>
              <th scope="row">Demand charge for {monthName}</th>
              <td>{rand(charge)}</td>
            </tr>
            {showUsual && (
              <tr>
                <th scope="row">Without the maximum half-hour</th>
                <td>{rand(without)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {note?.trim() && <p className="mt-4 border-t border-pe-border pt-3 font-body text-xs leading-5 text-pe-muted">{note.trim()}</p>}
    </figure>
  );
}
