import * as React from "react";
// import LogoutBtn from "./LogoutBtn.jsx"; // Corrected import statement
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userRole = useSelector((state) => state.auth.role);

  const navigate = useNavigate();
  const getRoleBasedSlug = (baseSlug) => {
    return userRole ? `/${userRole}${baseSlug}` : baseSlug;
  };

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: getRoleBasedSlug("/login"),
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: getRoleBasedSlug("/signup"),
      active: !authStatus,
    },
  ];

  return (
    <header className="sticky inset-x-0 top-0 z-30 w-full py-3 shadow transition-all bg-gradient-to-r from-[#5B5B5B] to-[#C9C19F] dark:from-[#252525] dark:to-[#0d0d33] dark:text-blue-100">
      <nav className="flex">
        <div className=" ml-8 p-2">
          <Link to="/">
            <h1 className="text-2xl font-bold">Tasky</h1>
          </Link>
        </div>
        <ul className="flex ml-auto">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 dark:hover:bg-slate-600 rounded-full"
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
