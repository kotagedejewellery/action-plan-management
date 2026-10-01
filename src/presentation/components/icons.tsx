import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;
function Icon({ children, ...props }: IconProps) { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" {...props}>{children}</svg>; }
export function Grid({ ...props }: IconProps) { return <Icon {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>; }
export function Calendar({ ...props }: IconProps) { return <Icon {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></Icon>; }
export function History({ ...props }: IconProps) { return <Icon {...props}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5M12 7v5l3 2" /></Icon>; }
export function Trash({ ...props }: IconProps) { return <Icon {...props}><path d="M4 7h16M10 11v6M14 11v6M9 7l1-3h4l1 3M6 7l1 14h10l1-14" /></Icon>; }
export function Users({ ...props }: IconProps) { return <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Icon>; }
export function LogOut({ ...props }: IconProps) { return <Icon {...props}><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-7" /></Icon>; }
export function Plus({ ...props }: IconProps) { return <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>; }
export function Pencil({ ...props }: IconProps) { return <Icon {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></Icon>; }
export function ArrowRight({ ...props }: IconProps) { return <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>; }
export function ExternalLink({ ...props }: IconProps) { return <Icon {...props}><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></Icon>; }
export function Search({ ...props }: IconProps) { return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>; }
export function ChevronDown({ ...props }: IconProps) { return <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon>; }
export function Menu({ ...props }: IconProps) { return <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>; }
export function Close({ ...props }: IconProps) { return <Icon {...props}><path d="M6 6l12 12M18 6 6 18" /></Icon>; }
export function CheckMark({ ...props }: IconProps) { return <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>; }
