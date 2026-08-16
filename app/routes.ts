import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix
} from "@react-router/dev/routes";

export default [
  layout("./crt.tsx", [
    index("routes/home.tsx"),

    ...prefix("suspects", [
      index("routes/suspects/home.tsx"),
      route(":uid", "routes/suspects/suspect.tsx"),
    ]),

    route("stats", "routes/stats.tsx"),
  ]),
] satisfies RouteConfig;
