import { FCM_ZONES, FCM_ZONE_LABELS } from "../../../types/types";

export const fcmOptions = FCM_ZONES.map((zone) => ({
  id: zone,
  displayName: FCM_ZONE_LABELS[zone],
}));

export const statusOptions = [
  { id: "pending", displayName: "Pendiente" },
  { id: "completed", displayName: "Completado" },
  { id: "skipped", displayName: "Saltado" },
];
