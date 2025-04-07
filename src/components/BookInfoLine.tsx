interface Props {
  label?: string;
  value?: string | number;
}

export function BookInfoLine({ label = "", value = "" }: Props) {
  if (!value) return null;

  return (
    <p className="flex gap-1 w-full text-xs shrink">
      <span className="opacity-50 text-nowrap">{label}</span>
      <span className="overflow-hidden overflow-ellipsis">{value}</span>
    </p>
  );
}
