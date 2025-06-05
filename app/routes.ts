import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route('/', './routes/index.tsx', [
    route('', './routes/petition/step1.tsx'),
    route('/petition/step2', './routes/petition/step2.tsx'),
  ]),
  route('/bff/analytics', './routes/bff/analytics.tsx'),
  route('/bff/petition/step1', './routes/bff/petition/step1.tsx'),
  route('/bff/petition/step2', './routes/bff/petition/step2.tsx'),
  route('/bff/count', './routes/bff/count.tsx'),
] satisfies RouteConfig;    