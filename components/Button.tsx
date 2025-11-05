type IconButtonProps = {
  icon: React.ElementType;
  onClick: () => void;
  label: string;
  color?: string;
  disabled?: boolean;
};

export default function Button({
  onClick,
  icon: Icon,
  label,
  color = "blue",
}: IconButtonProps) {
  const defaultColor = `flex items-center space-x-1 bg-${color}-600 hover:bg-${color}-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm`;

  return (
    <button onClick={onClick} className={defaultColor ? defaultColor : color}>
      <Icon className="h-4 w-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
