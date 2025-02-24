import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Navbar as Nav, NavbarBrand, NavbarContent, NavbarItem, Link as NextUiLink, Button } from '@nextui-org/react';
import { useSessionStore } from '../hooks/use-session-store';

const navLinks = [
  { label: 'Home', href: '/' },
];

export default function Navbar() {
  const { accessToken, logOut } = useSessionStore();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate('/login');
  };

  return (
    <Nav className="[&>header]:max-w-full [&>header]:px-16">
      <NavbarBrand className="flex-grow-0">
        <Link to="/" className="font-bold text-inherit uppercase">psuarezdev</Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {accessToken && navLinks.map((link, index) => (
          <NavbarItem key={index}>
            <NavLink
              to={link.href} 
              className={({ isActive }) => `transition-opacity hover:opacity-80 ${isActive ? 'text-primary font-semibold' : 'text-inherit'}`}
            >
              {link.label}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>
      {!accessToken ? (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <NextUiLink as={Link} to="/login">Login</NextUiLink>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" to="/register" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <Button color="danger" variant="flat" onClick={handleLogOut}>
          Log Out
        </Button>
      )}
    </Nav>
  );
}
