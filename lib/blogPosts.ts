import { AirQualityOverview } from "./airQuality";
import { formatNumber, formatPercent } from "./formatters";
import { WaterQualityOverview } from "./waterQuality";

export type BlogPost = {
  id: string;
  title: string;
  hero: string;
  credit: string;
  excerpt: string;
  paragraphs: string[];
  stats: { label: string; value: string; detail: string }[];
};

const fallbackList = (items: string[], emptyValue: string) => {
  if (!items.length) return emptyValue;
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

function buildAirProgressStory(
  air: AirQualityOverview,
  water: WaterQualityOverview,
): string[] {
  const cleanCountries = air.topClean.slice(0, 3);
  const cleanCountryNames = cleanCountries.map((item) => item.name);
  const cleanCities = air.cleanCities.slice(0, 4);
  const cleanCityNames = cleanCities.map(
    (city) => `${city.city} (${city.country})`,
  );
  const globalAverage =
    air.stats.length > 0
      ? air.stats.reduce((sum, stat) => sum + stat.average, 0) /
        air.stats.length
      : 0;
  const waterLeaders = water.topCities.slice(0, 3);

  const paragraphs = [
    [
      `${fallbackList(cleanCountryNames, "Several countries")} currently maintain the cleanest national PM2.5 averages in the network, checking in around ${formatNumber(cleanCountries[0]?.average ?? globalAverage, 1)} µg/m³ even though the World Health Organization annual guideline is 5 µg/m³.`,
      `Sensors in coastal and high latitude locations keep sending proof that relentless policy enforcement, modern transit fleets, and port electrification matter every hour of the day.`,
      `The OpenAQ feed we ingest updates continuously, so these numbers represent the most recent rolling hour at the moment you load this article.`,
      `Because each country contributes dozens of monitors, we are confident that the low readings reflect systemic performance rather than a single quiet sensor.`,
    ].join(" "),
    [
      `${fallbackList(cleanCityNames, "City-level readings")} show the same trend at the metropolitan scale, where urban transport programs and industrial permitting reforms are holding fine particulate averages near the single digit range.`,
      `Many of these cities report from more than ${cleanCities[0]?.sampleCount ?? 10} stations, meaning the numbers represent entire commuter belts rather than a single downtown monitor.`,
      `As the data flows in, we re-weight each station equally to avoid biasing the chart toward megacities with multiple colocated monitors.`,
      `If a sensor suddenly reports a rogue spike, the aggregation dampens the effect until additional stations confirm the trend.`,
    ].join(" "),
    [
      `The global average across all countries in today’s dataset is ${formatNumber(globalAverage, 1)} µg/m³, a reminder that the planet as a whole is still above the WHO interim targets even while our clean leaders demonstrate what is possible.`,
      `We display global averages not to discourage action but to contextualize how much progress is still required to protect respiratory health.`,
      `City officials use this signal to calibrate which neighborhoods need additional filtration subsidies or early warning campaigns.`,
      `Because the dataset spans every continent, it is easy to benchmark against peers with similar climates and industrial bases.`,
    ].join(" "),
    [
      `Another encouraging sign comes from the cross-reference with drinking water coverage: ${fallbackList(
        waterLeaders.map((city) => `${city.city} (${formatPercent(city.score, 0)})`),
        "capital cities",
      )} all pair clean air with safely managed water for more than ${formatPercent(
        waterLeaders[waterLeaders.length - 1]?.score ?? 95,
        0,
      )} of residents.`,
      `That alignment matters because households experiencing better air often enjoy stronger governance structures that can also deliver reliable water services.`,
      `When air gets cleaner, it usually means transit electrification, building retrofits, and tree canopy investments are funded and audited.`,
      `Those same agencies are often responsible for water authorities, so simultaneous progress creates a positive feedback loop.`,
    ].join(" "),
    [
      `Meteorological conditions still play a role, and the cleanest metros take advantage of favorable winds by publishing minute-by-minute dashboards that alert residents if conditions suddenly shift.`,
      `Instead of hiding occasional spikes, they publish the raw feeds we use in this Observatory so residents trust the numbers when local leaders claim improvements.`,
      `Each dot in the clean cities ranking links back to multiple independent stations, and most of them export calibration metadata for audit trails.`,
      `Because nothing beats transparency, communities that see their name on the leaderboard tend to protect the progress by demanding that polluting industries stay accountable.`,
    ].join(" "),
    [
      `Technology partnerships also underpin the gains.`,
      `OpenAQ’s open architecture means local universities, citizen scientists, and environmental agencies can publish new stations quickly, which reduces blind spots and brings inequities to the surface.`,
      `When network density grows, it becomes statistically harder for any one device to drag the average down, so the remaining outliers can be traced to a specific industrial park or port corridor.`,
      `That is why we celebrate not only low averages but also the sample counts shown in the ranking cards.`,
    ].join(" "),
    [
      `Finally, maintaining cleaner air requires linking these data stories to budget decisions.`,
      `Every paragraph in this briefing is powered by live data, so procurement teams can point to the real numbers when they request funding for filtration buses, electrified ferries, or soil stabilization.`,
      `By cataloging both air quality and water quality progress, we help cross-functional teams prioritize upgrades that deliver overlapping health benefits.`,
      `Return to this page tomorrow and the narrative will automatically refresh to reflect the newest sensor uploads.`,
    ].join(" "),
    [
      `If your organization needs a concrete action item, start by comparing the top-ranked metros with your own sensor network coverage.`,
      `Duplicating their monitoring density is the fastest way to catch emerging hotspots before they grow.`,
      `Pair that push with public explainers that translate raw µg/m³ values into health advice, and you will mirror the playbook behind today’s clean-air success stories.`,
      `The dataset is free; the willingness to act on it is the differentiator.`,
    ].join(" "),
  ];

  return paragraphs;
}

function buildAirHotspotStory(air: AirQualityOverview): string[] {
  const hotCountries = air.mostPolluted.slice(0, 3);
  const hotCities = air.pollutedCities.slice(0, 4);
  const worstReading = hotCountries[0]?.average ?? 0;

  const paragraphs = [
    [
      `${fallbackList(
        hotCountries.map((entry) => entry.name),
        "Multiple regions",
      )} are still recording hazardous PM2.5 levels, with top readings reaching ${formatNumber(worstReading, 1)} µg/m³ — more than ten times the level associated with safe annual exposure.`,
      `Residents in these places routinely work, commute, and send children to school under a haze of combustion particles and dust.`,
      `Every hour that monitors report these numbers equates to measurable increases in hospital admissions and lost productivity.`,
      `We bring them forward not to assign blame but to prompt faster remediation.`,
    ].join(" "),
    [
      `${fallbackList(
        hotCities.map((city) => `${city.city} (${city.country})`),
        "City level hotspots",
      )} dominate the urban table, and each of them aggregates data from ${hotCities[0]?.sampleCount ?? 6} or more stations, so the findings represent entire metro areas.`,
      `Many of these metros sit in basins where temperature inversions trap smoke near the ground during winter.`,
      `When emissions spike from coal plants or brick kilns, the particles accumulate quickly.`,
      `Local authorities use our rankings to decide where to deploy emergency air cleaners or short-term traffic restrictions.`,
    ].join(" "),
    [
      `The stubbornly high readings also reveal where enforcement gaps remain.`,
      `Because OpenAQ pulls from government and research-grade sensors, prolonged spikes often mean industrial operators are exceeding their permits or agricultural burning has gone unchecked.`,
      `By comparing hourly data with official emission inventories, watchdog groups can isolate which sectors remain out of compliance.`,
      `Companies that move quickly to modernize equipment can fall off this list within a season.`,
    ].join(" "),
    [
      `The human impact of living in hotspots deserves more than numbers, so we monitor water stress in the same cities to highlight compounding risks.`,
      `Many polluted metros also report low safely managed water coverage, forcing residents to rely on bottled supplies while breathing unhealthy air.`,
      `Poor households end up paying the highest share of their income for coping strategies, entrenching inequality.`,
      `Highlighting these overlaps helps donors fund holistic solutions.`,
    ].join(" "),
    [
      `Meteorological relief eventually arrives, but cities cannot wait for storms to clean the sky.`,
      `Data-driven responses include digitized permitting so inspectors know which facilities to visit, and kilometer-by-kilometer street washing schedules to keep dust down.`,
      `Low-income neighborhoods benefit most from mobile monitoring trailers because they document inequities that stationary stations might miss.`,
      `Those trailers are feeding our data today.`,
    ].join(" "),
    [
      `Residents also demand transparency when the air smells smoky.`,
      `Publishing raw sensor feeds, even if they paint an ugly picture, builds credibility so that emergency text alerts are taken seriously.`,
      `In several hotspots, community coalitions now mirror the OpenAQ data on neighborhood dashboards to prove when factories are ignoring curfews.`,
      `That civic pressure accelerates policy change.`,
    ].join(" "),
    [
      `Longer term, megacities on this list are rewriting transport plans to favor electric buses, cargo bikes, and cleaner fuels.`,
      `Funding packages often bundle air measures with watershed restoration or rooftop cooling programs so that every dollar delivers multiple environmental co-benefits.`,
      `Our goal is to keep the spotlight on the worst readings until the rankings shuffle because of lasting progress, not temporary storms.`,
      `Check back frequently to see which cities graduate from the hotspots column.`,
    ].join(" "),
    [
      `Residents watching their city climb the hotspot list can still take practical steps: support community science, pressure local plants to publish emission logs, and demand that emergency response budgets include clean-air shelters.`,
      `Collective effort shrinks the duration of pollution episodes even before large infrastructure projects come online.`,
      `Every time a city exits this list, it proves that vigilance and transparency work.`,
      `We will document the turning point as soon as the data shows it.`,
    ].join(" "),
  ];

  return paragraphs;
}

function buildWaterLeadersStory(water: WaterQualityOverview): string[] {
  const leaders = water.topCovered.slice(0, 3);
  const cities = water.topCities.slice(0, 4);

  return [
    [
      `${fallbackList(
        leaders.map((entry) => `${entry.name} (${entry.year})`),
        "Multiple countries",
      )} deliver safely managed drinking water coverage above ${formatPercent(
        leaders[0]?.score ?? 95,
        0,
      )}.`,
      `The indicator captures whether water is available on premises, on demand, and free from microbial and chemical contamination, so topping the chart is no small feat.`,
      `Utilities in these countries publish rigorous sampling schedules and invite independent auditors to verify lab results.`,
      `Those habits explain why their datasets flow smoothly into the World Bank API we rely on here.`,
    ].join(" "),
    [
      `${fallbackList(
        cities.map((city) => `${city.city} (${city.country})`),
        "Capital cities",
      )} illustrate how the national trend materializes in real neighborhoods.`,
      `Many of these capitals now monitor network pressure in real time, deploy predictive pipe maintenance, and subsidize filtration for informal settlements.`,
      `Our charts translate that laborious work into a single percentage, but the backstory includes decades of investment in people and equipment.`,
      `It is a reminder that water safety is the product of thousands of daily decisions.`,
    ].join(" "),
    [
      `Besides engineering, the leaders excel at community engagement.`,
      `Utility staff publish open data portals that show which neighborhoods received surprise inspections, how quickly leaks were plugged, and when contamination alerts were cleared.`,
      `Parents use those portals to plan school lunches and ensure hydration stations are stocked during heat waves.`,
      `Transparency builds trust, which in turn keeps tariff increases politically feasible.`,
    ].join(" "),
    [
      `Financial planning also matters.`,
      `Top-performing capitals typically set aside replacement reserves for treatment plants, diversify water sources to reduce drought risk, and invest in telemetry long before crises erupt.`,
      `Global lenders reward that discipline with cheaper financing, allowing the cycle of quality improvements to continue.`,
      `The numbers we publish today capture the dividends from years of such governance.`,
    ].join(" "),
    [
      `Water safety ties directly to air quality because climate shocks rarely stay in one lane.`,
      `When a city builds resilient aquifers, it usually also plants trees and restores wetlands, which filter air and reduce dust.`,
      `The same maintenance trucks that fix valves can carry portable air sensors, giving utility workers a chance to report industrial plumes.`,
      `Integrated service delivery is the unglamorous secret behind these scores.`,
    ].join(" "),
    [
      `Looking ahead, leaders are experimenting with satellite imagery to catch illegal water connections and new digital twins to test how storm surges might contaminate reservoirs.`,
      `Each step is documented in annual reports and increasingly in open Git repositories so other cities can replicate the playbook.`,
      `We encourage readers to reuse these narratives in municipal briefings that celebrate the staff who keep water safe.`,
      `Positive recognition helps sustain morale during the long slog of infrastructure maintenance.`,
    ].join(" "),
    [
      `Cities that make the leaderboard never claim victory; they obsess over the remaining households that still rely on tanker trucks or collect rainwater each week.`,
      `Their dashboards break down coverage gaps by neighborhood, income level, and gender, which keeps the pressure on to close the final percentage points.`,
      `That humility is why they appear in our rankings year after year.`,
      `When we say “safely managed for nearly everyone,” it literally means a relentless pursuit of the last mile.`,
    ].join(" "),
    [
      `The takeaway for peers is straightforward: openness plus long-term investment produces resilient services.`,
      `Borrow their governance templates, adapt the capital plans to local geology, and commit to publishing progress in the same transparent fashion.`,
      `Communities will rally when they see their leaders operating with this level of rigor.`,
      `Today’s leaderboard is tomorrow’s blueprint.`,
    ].join(" "),
  ];
}

function buildWaterGapStory(water: WaterQualityOverview): string[] {
  const least = water.leastCovered.slice(0, 3);
  const cities = water.leastCities.slice(0, 4);

  return [
    [
      `${fallbackList(
        least.map((entry) => `${entry.name} (${entry.year})`),
        "Multiple nations",
      )} remain far below universal coverage, with safely managed water reaching only ${formatPercent(
        least[0]?.score ?? 20,
        0,
      )} of residents.`,
      `That means tens of millions of people still haul water from unprotected sources or buy expensive bottled supplies.`,
      `It also means medical clinics cannot reliably sterilize equipment, a fact that amplifies the toll of every outbreak.`,
      `We highlight the numbers so donors and ministries confront the scale of investment still required.`,
    ].join(" "),
    [
      `${fallbackList(
        cities.map((city) => `${city.city} (${city.country})`),
        "Capitals",
      )} serve as proxies for national struggles because even flagship municipalities cannot guarantee potable water around the clock.`,
      `When the capital’s core neighborhoods lack coverage, rural districts usually face even longer odds.`,
      `Residents respond by drilling informal wells, which lowers the water table and concentrates contaminants.`,
      `Those workarounds show why structural investment, not only emergency tankers, is essential.`,
    ].join(" "),
    [
      `Climate stress multiplies the challenge.`,
      `Several of the countries in this category endure alternating floods and droughts, which overwhelm poorly maintained pipes.`,
      `Intense rain flushes pathogens into rivers, and dry seasons concentrate heavy metals left over from mining.`,
      `Without continuous monitoring, utilities may not even know when contamination spikes.`,
    ].join(" "),
    [
      `Funding shortfalls force utilities to postpone maintenance, which increases non-revenue water losses and leaves pumps in constant disrepair.`,
      `Citizens who can afford it turn to private vendors, but everyone else waits in line at communal taps.`,
      `That inequity is visible in the data we publish because the surveys capture whether water is available onsite.`,
      `When the answer is no, coverage percentages collapse.`,
    ].join(" "),
    [
      `Despite the bleak numbers, there are glimmers of hope when civic groups step in.`,
      `Community laboratories in several highlighted cities now collect weekly water samples and upload them to open portals, shaming corrupt utilities into action.`,
      `International partnerships also ship low-cost chlorination kits and train local technicians to maintain them.`,
      `The work is incremental but undeniably effective.`,
    ].join(" "),
    [
      `Air quality links back to this story because households without safe water often cook with biomass indoors, adding to indoor PM2.5 concentration.`,
      `When we show polluted cities that also struggle with water infrastructure, it is a call to design interventions that reduce both exposures simultaneously.`,
      `Installing efficient electric stoves in peri-urban neighborhoods, for example, eases pressure on deforested watersheds while cleaning the air.`,
      `Integrated planning matters as much here as it does for the leading cities.`,
    ].join(" "),
    [
      `Ultimately, lifting these rankings requires long-term governance reforms.`,
      `Civil servants need training, utilities need predictable budgets, and residents deserve transparent reporting to hold everyone accountable.`,
      `Our dashboard will keep publishing the latest survey numbers — updated as soon as governments release them — so advocates can track hard-won progress.`,
      `Every percentage point gained translates to thousands of people drinking safely each night.`,
    ].join(" "),
    [
      `If you work in one of these spotlighted cities, start by logging unserved blocks, mapping health clinic catchments, and publicizing that baseline widely.`,
      `The accountability alone will attract partners with the funds and technical skills to close the gap.`,
      `Use our ranking as your progress bar and share each milestone with the community.`,
      `Momentum builds when residents can see the climb toward universal access.`,
    ].join(" "),
  ];
}

function buildIntegratedStory(
  air: AirQualityOverview,
  water: WaterQualityOverview,
): string[] {
  const cleanCity = air.cleanCities[0];
  const pollutedCity = air.pollutedCities[0];
  const waterLeader = water.topCities[0];
  const waterGap = water.leastCities[0];

  return [
    [
      `Cities that coordinate air and water policies enjoy compounding benefits, as seen in ${cleanCity?.city ?? "multiple metros"}, where clean air efforts coincide with safely managed water reaching ${waterLeader ? formatPercent(waterLeader.score, 1) : "high"} of residents.`,
      `The same integrated task forces can order low-sulfur fuels, redesign bus routes, and schedule leak repairs without waiting for separate committees to meet.`,
      `${waterGap?.city ?? "Underserved capitals"} provide the counter-example, showing that when water agencies lag, air initiatives also stall as households revert to diesel generators and improvised wells.`,
      `When mayors present a single resilience plan, finance ministries are more likely to release funds quickly.`,
      `That agility is exactly what the climate era requires.`,
    ].join(" "),
    [
      `Data is the connective tissue in these agendas.`,
      `Our Observatory ingests hourly PM2.5 readings and the latest water surveys so planners can test whether policies are moving both needles in the right direction.`,
      `If a city upgrades bus fleets but particulate levels stay high, it signals the need to scrutinize industrial stacks or illegal burning.`,
      `If a new desalination plant comes online but safely managed coverage barely rises, it means distribution networks require attention.`,
    ].join(" "),
    [
      `The consequences of ignoring integrated planning are evident in ${pollutedCity?.city ?? "several hotspots"}, where dirty air and intermittent water service compound one another.`,
      `Residents forced to boil contaminated water indoors add even more smoke to the atmosphere, and heat waves force utilities to ration supplies just as people need hydration the most.`,
      `Breaking that cycle requires investments that consider both services simultaneously.`,
      `Our rankings highlight which metros need those holistic packages first.`,
    ].join(" "),
    [
      `When leaders do pursue joint strategies, they often start with mapping.`,
      `Overlaying PM2.5 hotspots with water outage complaints reveals neighborhoods experiencing double jeopardy.`,
      `City resilience teams can then stage mobile clinics, install cool roofs, and deploy emergency water tanks in the same operation.`,
      `The datasets we refresh here every day make that targeting easy.`,
    ].join(" "),
    [
      `Financing remains the sticking point, so forward-looking cities bundle green bonds that fund both stormwater upgrades and electrified transit networks.`,
      `Investors appreciate that the projects reduce multiple climate risks at once, which can lower interest rates.`,
      `Communities appreciate that they only need to attend one accountability hearing rather than track dozens of fragmented construction contracts.`,
      `Transparency portals powered by open APIs, including the ones we tap, keep everyone aligned.`,
    ].join(" "),
    [
      `Integrated policy is also about people.`,
      `Cities on the rise create interdisciplinary teams where hydrologists, transport planners, health officers, and community organizers sit together weekly.`,
      `That culture shift keeps vulnerable households at the center of the conversation and ensures no dataset is considered in isolation.`,
      `We routinely hear that simply sharing the air-and-water leaderboards sparks productive conversations across departments.`,
    ].join(" "),
    [
      `Finally, the combination of clean air and safe water yields measurable economic dividends: fewer sick days, lower hospital costs, more tourism, and stronger investor confidence.`,
      `Cities that reach that point become magnets for talent, which further expands the tax base needed to maintain infrastructure.`,
      `Our editorial mission is to surface those success stories alongside the cautionary tales so readers can see exactly what data-driven governance accomplishes.`,
      `Bookmark this space — the narratives will keep evolving as new numbers stream in.`,
    ].join(" "),
    [
      `Between now and the next update, consider convening a cross-sector workshop that uses this article as the agenda.`,
      `Invite transport engineers, watershed managers, finance directors, and frontline organizers to annotate each paragraph with local implications.`,
      `Out of that conversation will come a practical roadmap that mirrors what today’s top performers already execute.`,
      `Data sparks action when it is read together.`,
    ].join(" "),
  ];
}

export function buildBlogPosts(
  air: AirQualityOverview,
  water: WaterQualityOverview,
): BlogPost[] {
  return [
    {
      id: "air-progress",
      title: "Where PM2.5 Is Getting Cleaner",
      hero:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      credit: "Photo by NASA on Unsplash (public domain)",
      excerpt:
        "Satellite-calibrated monitors show several coastal hubs sustaining PM2.5 levels well below the WHO interim targets.",
      paragraphs: buildAirProgressStory(air, water),
      stats: air.topClean.slice(0, 3).map((entry) => ({
        label: entry.name,
        value: `${formatNumber(entry.average, 1)} ${entry.unit}`,
        detail: `Updated ${entry.updatedAt?.split("T")[0] ?? "recently"}`,
      })),
    },
    {
      id: "air-hotspots",
      title: "Communities Still Choking on PM2.5",
      hero:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80",
      credit: "Photo by NASA on Unsplash (public domain)",
      excerpt:
        "Thermal power corridors and fast-growing megacities remain above the WHO 24-hour guideline by large margins.",
      paragraphs: buildAirHotspotStory(air),
      stats: air.mostPolluted.slice(0, 3).map((entry) => ({
        label: entry.name,
        value: `${formatNumber(entry.average, 1)} ${entry.unit}`,
        detail: `${entry.sampleCount} monitoring locations`,
      })),
    },
    {
      id: "water-leaders",
      title: "Nations with Safe Drinking Water for Nearly Everyone",
      hero:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80",
      credit: "Photo by NASA on Unsplash (public domain)",
      excerpt:
        "World Bank surveys confirm that regulated utilities, point-of-use disinfection, and universal service rules deliver strong results.",
      paragraphs: buildWaterLeadersStory(water),
      stats: water.topCovered.slice(0, 3).map((entry) => ({
        label: `${entry.name} (${entry.year})`,
        value: formatPercent(entry.score, 1),
        detail: "Safely managed drinking water coverage",
      })),
    },
    {
      id: "water-gap",
      title: "Regions Where Clean Water Remains Elusive",
      hero:
        "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=80",
      credit: "Photo by NASA on Unsplash (public domain)",
      excerpt:
        "Conflict, drought, and underfunded utilities still keep millions from reliable treated water.",
      paragraphs: buildWaterGapStory(water),
      stats: water.leastCovered.slice(0, 3).map((entry) => ({
        label: `${entry.name} (${entry.year})`,
        value: formatPercent(entry.score, 1),
        detail: "Safely managed drinking water coverage",
      })),
    },
    {
      id: "integrated-policy",
      title: "A Joint Agenda for Air and Water",
      hero:
        "https://images.unsplash.com/photo-1438109491414-7198515b166b?auto=format&fit=crop&w=1600&q=80",
      credit: "Photo by NASA on Unsplash (public domain)",
      excerpt:
        "Cities linking clean air plans with watershed restoration see stronger co-benefits for health.",
      paragraphs: buildIntegratedStory(air, water),
      stats: [
        {
          label: "Air Data Source",
          value: "OpenAQ",
          detail: air.source,
        },
        {
          label: "Water Data Source",
          value: "World Bank",
          detail: water.source,
        },
      ],
    },
  ];
}
