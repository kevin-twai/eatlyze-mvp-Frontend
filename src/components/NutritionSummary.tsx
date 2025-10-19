import type { Totals } from "../api";

export default function NutritionSummary({ totals }: { totals: Totals | null }) {
  const kcal = totals?.kcal ?? 0;
  const protein = totals?.protein_g ?? 0;
  const fat = totals?.fat_g ?? 0;
  const carb = totals?.carb_g ?? 0;

  const Card = ({
    label,
    value,
    unit,
  }: {
    label: string;
    value: number;
    unit: string;
  }) => (
    <div className="bg-white/5 rounded-2xl p-6">
      <div className="text-white/60 mb-2">{label}</div>
      <div className="text-4xl font-bold text-white">
        {value}
        <span className="text-white/60 text-xl ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-white/90 text-lg font-semibold">總營養</div>
      <Card label="熱量" value={kcal} unit="kcal" />
      <Card label="蛋白質" value={protein} unit="g" />
      <Card label="脂肪" value={fat} unit="g" />
      <Card label="碳水" value={carb} unit="g" />
    </div>
  );
}