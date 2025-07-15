interface UserRoleProps {
  name: string;
  color: string;
}

export const UserRole = ({ name, color }: UserRoleProps) => {
  return (
    <div
      className={`text-[var(--color)] border border-[var(--color)] rounded-md`}
      style={{ "--color": `#${color}` } as React.CSSProperties}
    >
      <p className="px-1.5 py-0.5">{name}</p>
    </div>
  );
};
