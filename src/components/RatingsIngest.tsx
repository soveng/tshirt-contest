import { useEffect } from "react";

import { startRatingsIngest } from "../nostr";

/** Subscribe to judge ratings only on the judging page (not the public gallery). */
export function RatingsIngest() {
  useEffect(() => startRatingsIngest(), []);
  return null;
}
