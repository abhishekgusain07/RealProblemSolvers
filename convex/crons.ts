import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const cron = cronJobs();

cron.interval(
  "run-matching-every-minute",
  { minutes: 1 },
  internal.matching.performMatching
);

export default cron;