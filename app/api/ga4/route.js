import { BetaAnalyticsDataClient } from "@google-analytics/data";

let credentials;
try {
  credentials = JSON.parse(process.env.GA4_CREDENTIALS);
} catch(e) {
  credentials = JSON.parse(process.env.GA4_CREDENTIALS.replace(/'/g, '"'));
}

const client = new BetaAnalyticsDataClient({ credentials });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("from") || "30daysAgo";
  const endDate = searchParams.get("to") || "today";

  try {
    const [response] = await client.runReport({
      property: "properties/225347079",
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "averageSessionDuration" },
        { name: "keyEvents" },
        { name: "screenPageViews" },
      ],
      dimensions: [{ name: "date" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const rows = (response.rows || []).map(function(row) {
      return {
        date: row.dimensionValues[0].value,
        sessions:  parseInt(row.metricValues[0].value),
        users:     parseInt(row.metricValues[1].value),
        duration:  Math.round(parseFloat(row.metricValues[2].value) / 60),
        keyEvents: parseInt(row.metricValues[3].value),
        pageViews: parseInt(row.metricValues[4].value),
      };
    });

    const totals = rows.reduce(function(acc, r) {
      acc.sessions  += r.sessions;
      acc.users     += r.users;
      acc.keyEvents += r.keyEvents;
      acc.pageViews += r.pageViews;
      return acc;
    }, { sessions: 0, users: 0, keyEvents: 0, pageViews: 0 });

    totals.avgDuration = rows.length
      ? Math.round(rows.reduce(function(a, r) { return a + r.duration; }, 0) / rows.length)
      : 0;

    return Response.json({ rows, totals });
  } catch(err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
