type Totals = {
  kcal?: number
  protein_g?: number
  fat_g?: number
  carb_g?: number
}

export default function NutritionSummary({
  totals,
  fallbackItems = [],
}: {
  totals?: Totals | null
  fallbackItems?: Array<{
    kcal?: number
    protein_g?: number
    fat_g?: number
    carb_g?: number
  }>
}) {
  // 後端 totals 優先；沒有就用前端加總做備援
  const sum = (k: keyof Totals) =>
    (totals?.[k] ??
      fallbackItems.reduce((s, it: any) => s + (typeof it?.[k] === 'number' ? it[k]! : 0), 0))

  const kcal = round1(sum('kcal'))
  const p = round1(sum('protein_g'))
  const f = round1(sum('fat_g'))
  const c = round1(sum('carb_g'))

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card label="熱量" value={kcal} unit="kcal" />
      <Card label="蛋白質" value={p} unit="g" />
      <Card label="脂肪" value={f} unit="g" />
      <Card label="碳水" value={c} unit="g" />
    </div>
  )
}

function Card({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <div className="text-white/70 text-sm">{label}</div>
      <div className="text-3xl font-semibold tabular-nums">
        {isFinite(value) ? value : 0}{' '}
        <span className="text-base text-white/60">{unit}</span>
      </div>
    </div>
  )
}

const round1 = (n: any) => (typeof n === 'number' ? Math.round(n * 10) / 10 : 0)