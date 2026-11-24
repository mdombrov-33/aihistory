// Validates local native-model assets, provenance and authored camera views.

import { z } from "zod";

export const cameraViewSchema = z.strictObject({
  label: z.string().min(1).max(80),
  yaw: z.number().min(-360).max(360),
  pitch: z.number().min(5).max(175),
  distance: z.number().min(35).max(200),
  explanation: z.string().min(1).max(600),
});

export const modelAssetSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  institution: z.string().min(1),
  model: z.string().regex(/^\/models\/[a-zA-Z0-9/_-]+\.glb$/),
  poster: z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(jpg|png|webp)$/),
  record: z.url().startsWith("https://"),
  license: z.string().min(1),
  description: z.string().min(1),
  context: z.string().min(1),
  views: z.array(cameraViewSchema).min(1).max(6),
});

export type ModelAsset = z.infer<typeof modelAssetSchema>;

export type CameraView = z.infer<typeof cameraViewSchema>;
