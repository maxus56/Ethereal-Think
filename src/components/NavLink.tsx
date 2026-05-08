import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </RouterNavLink>
  );
};

export default NavLink;
