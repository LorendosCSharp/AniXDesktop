interface UserSocialProps {
  icon: string;
  url?: string;
  nickname: string;
  color: string;
}

export const UserSocial = ({ nickname, icon, color }: UserSocialProps) => {
  return (
    <div
      className={`border border-[var(--color)] rounded-md`}
      style={{ "--color": `#${color}` } as React.CSSProperties}
    >
      <div className="flex gap-1 items-center px-1.5 py-1">
          <span className={`iconify w-6 h-6 bg-[var(--color)] ${icon}`}></span>
          <p>{nickname}</p>
      </div>
    </div>
  );
};
