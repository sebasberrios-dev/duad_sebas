import { CardContainer } from "../../components/Container/CardContainer";
import { StatsCardProps } from "./props/stats-card-props";

export function StatsCard({ title, value, detail }: StatsCardProps) {
  return (
    <CardContainer className="gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{detail}</p>
    </CardContainer>
  );
}
