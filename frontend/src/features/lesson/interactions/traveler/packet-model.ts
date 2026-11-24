// Validates and reconstructs finite IPv6 Hop Limit traces from authored routes.

import { z } from "zod";

const id = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/)
  .max(50);

export const travelerSchema = z
  .strictObject({
    model: z.literal("ipv6-hop-limit"),
    description: z.string().min(20).max(700),
    hopLimit: z.number().int().min(0).max(8),
    locations: z
      .array(
        z.strictObject({
          id,
          label: z.string().min(1).max(24),
          role: z.enum(["source", "router", "destination"]),
        }),
      )
      .min(3)
      .max(7),
    scenarios: z
      .array(
        z.strictObject({
          id,
          label: z.string().min(1).max(40),
          explanation: z.string().min(10).max(500),
          path: z.array(id).min(2).max(8),
        }),
      )
      .min(2)
      .max(4),
  })
  .superRefine((value, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    const ids = new Set(value.locations.map((n) => n.id));

    if (ids.size !== value.locations.length) fail("Location IDs must be unique");

    if (new Set(value.scenarios.map((s) => s.id)).size !== value.scenarios.length)
      fail("Scenario IDs must be unique");

    const source = value.locations.filter((n) => n.role === "source");
    const destination = value.locations.filter((n) => n.role === "destination");

    if (source.length !== 1 || destination.length !== 1)
      fail("A traveler needs one source and one destination");

    for (const scenario of value.scenarios) {
      if (scenario.path.some((n) => !ids.has(n))) fail("Path references an unknown location");

      if (new Set(scenario.path).size !== scenario.path.length)
        fail("This model requires finite paths without repeated locations");

      if (scenario.path[0] !== source[0]?.id || scenario.path.at(-1) !== destination[0]?.id)
        fail("Path endpoints must match source and destination");

      if (
        scenario.path
          .slice(1, -1)
          .some((id) => value.locations.find((n) => n.id === id)?.role !== "router")
      )
        fail("Only routers may be internal path locations");
    }

    if ([...ids].some((id) => !value.scenarios.some((s) => s.path.includes(id))))
      fail("Every location needs a scenario");
  });

export type Traveler = z.infer<typeof travelerSchema>;

export type PacketCheckpoint = {
  location: string;
  hopLimit: number;
  kind: "ready" | "received" | "forwarded" | "delivered" | "dropped";
  title: string;
  explanation: string;
};

// Reconstructed from inputs, not replayed side effects. Forwarders and destination differ.
export function packetTrace(
  traveler: Traveler,
  scenarioId: string,
  initial: number,
): PacketCheckpoint[] {
  if (!Number.isInteger(initial) || initial < 0 || initial > 8)
    throw new Error("Invalid Hop Limit");

  const scenario = traveler.scenarios.find((s) => s.id === scenarioId);

  if (!scenario) throw new Error("Unknown route scenario");

  const trace: PacketCheckpoint[] = [
    {
      location: scenario.path[0],
      hopLimit: initial,
      kind: "ready",
      title: "Ready to send",
      explanation:
        "The source has set the packet’s initial Hop Limit. No router has forwarded it yet.",
    },
  ];

  let remaining = initial;

  for (const id of scenario.path.slice(1)) {
    const location = traveler.locations.find((n) => n.id === id)!;

    if (location.role === "destination") {
      trace.push({
        location: id,
        hopLimit: remaining,
        kind: "delivered",
        title: "Delivered to the destination",
        explanation: `${location.label} is the destination, not a forwarding router. It accepts the packet here, including when the received Hop Limit is zero.`,
      });
      break;
    }

    trace.push({
      location: id,
      hopLimit: remaining,
      kind: "received",
      title: `Received at ${location.label}`,
      explanation: `This router received a Hop Limit of ${remaining}. Advance once to inspect its forwarding decision.`,
    });

    const received = remaining;

    remaining = Math.max(0, remaining - 1);

    if (remaining === 0) {
      trace.push({
        location: id,
        hopLimit: 0,
        kind: "dropped",
        title: `Dropped at ${location.label}`,
        explanation:
          received === 0
            ? "The router received zero, so it discards the packet. It does not forward it to another location."
            : "The router’s decrement leaves zero. It discards the packet rather than forwarding it. The destination has not received this packet.",
      });
      break;
    }

    trace.push({
      location: id,
      hopLimit: remaining,
      kind: "forwarded",
      title: `Forwarded by ${location.label}`,
      explanation: `The router reduced the Hop Limit from ${received} to ${remaining}. It can now forward the packet to the next location.`,
    });
  }

  return trace;
}

export function packetLayout(locations: Traveler["locations"], width: number, height = 300) {
  const columns = width < 500 ? 2 : 3;
  const rows = Math.ceil(locations.length / columns);

  return {
    height,
    positions: Object.fromEntries(
      locations.map((n, i) => [
        n.id,
        {
          x: (((i % columns) + 0.5) * width) / columns,
          y: ((Math.floor(i / columns) + 0.5) * height) / rows,
        },
      ]),
    ),
  };
}
