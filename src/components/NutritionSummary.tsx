type Totals = {
  kcal?: number
  protein?: number
  fat?: number
  carb?: number
} | null | undefined

type Props = {
  totals: Totals
}

const Stat = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number | null | undefined
  unit?: string
}) => {
  const isNum = typeof value === 'number' && !Number.isNaN(value)
  // 小數位：kcal 取整數，其它營養素 1 位小數（可依需求微調）
  const formatted = isNum
    ? (unit === 'kcal' ? Math.round(value as number).toString()
                       : (Math.round((value as number) * 10) / 10).toString())
    : '-'

  return (
    <div className="bg-white/5 rounded-xl p-4 flex flex-col">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {formatted}
        {unit ? <span className="ml-1 text-base text-white/60">{unit}</span> : null}
      </div>
    </div>
  )
}

export default function NutritionSummary({ totals }: Props) {
  const kcal = totals?.kcal
  const protein = totals?.protein
  const fat = totals?.fat
  const carb = totals?.carb

  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat label="熱量" value={kcal} unit="kcal" />
      <Stat label="蛋白質" value={protein} unit="g" />
      <Stat label="脂肪" value={fat} unit="g" />
      <Stat label="碳水" value={carb} unit="g" />
    </div>
  )
}