import {useEffect, useState} from "react";
import {Link, NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    Bell,
    Bot,
    Circle,
    LayoutDashboard,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    UserRound,
    Library,
    X
} from "lucide-react";
import {useAuth} from "../context/AuthContext";
import "./MainLayout.css";

const MainLayout = () => {
    const {user, menus, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches);
    const [mobileOpen, setMobileOpen] = useState(false);
    const sortedMenus = Array.isArray(menus)
        ? [...menus].sort((first, second) => (first.displayorder ?? 0) - (second.displayorder ?? 0))
        : [];
    const activeMenu = sortedMenus.find((menu) =>
        menu.path === location.pathname || location.pathname.startsWith(`${menu.path}/`)
    );
    const title = activeMenu?.menu ?? "Workspace";
    const displayName = user?.name
        || [user?.firstname, user?.lastname].filter(Boolean).join(" ")
        || user?.email
        || "Learner";
    const initials = displayName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 760px)");
        const handleBreakpointChange = (event) => {
            setIsMobile(event.matches);
            setMobileOpen(false);
        };

        mediaQuery.addEventListener("change", handleBreakpointChange);
        return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMobileOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [mobileOpen]);

    const getMenuIcon = (menu) => {
        const iconName = `${menu.icon ?? ""} ${menu.menu ?? ""}`.toLowerCase();
        if (iconName.includes("dashboard")) return LayoutDashboard;
        if (iconName.includes("bot") || iconName.includes("tutor")) return Bot;
        if (iconName.includes("profile") || iconName.includes("user")) return UserRound;
        if (iconName.includes("library")) return Library;
        return Circle;
    };

    const handleMenuToggle = () => {
        if (isMobile) setMobileOpen((open) => !open);
        else setCollapsed((value) => !value);
    };

    return (
        <div className={`app-layout${collapsed ? " is-collapsed" : ""}`}>
            <aside
                id="app-sidebar"
                className={`app-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
                aria-label="Main navigation"
                aria-hidden={isMobile && !mobileOpen}
                inert={isMobile && !mobileOpen}
            >
                <Link className="app-brand" to="/dashboard" aria-label="TutorAI dashboard">
                    <span className="app-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
                    <span>Tutor<span>AI</span></span>
                </Link>

                <div className="app-sidebar-label">WORKSPACE</div>
                <nav className="app-navigation">
                    {sortedMenus.map((menu) => (
                        <NavLink
                            key={menu.path || menu.menu}
                            to={menu.path || "/dashboard"}
                            end={menu.path === "/dashboard"}
                            title={collapsed && !isMobile ? menu.menu : undefined}
                            className={({isActive}) => `app-nav-link${isActive ? " is-active" : ""}`}
                            onClick={() => isMobile && setMobileOpen(false)}
                        >
                            {(() => {
                                const Icon = getMenuIcon(menu);
                                return <Icon className="app-nav-icon" size={18} aria-hidden="true" />;
                            })()}
                            <span className="app-nav-label">{menu.menu}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="app-sidebar-footer">
                    <div className="app-sidebar-help">
                        <span className="app-sidebar-footer-mark" aria-hidden="true">?</span>
                        <span className="app-sidebar-footer-copy">Keep learning, one step at a time.</span>
                    </div>
                    <button className="app-sidebar-logout" type="button" onClick={handleLogout} title="Sign out">
                        <LogOut size={17} aria-hidden="true" />
                        <span className="app-sidebar-logout-label">Sign out</span>
                    </button>
                </div>
            </aside>

            {isMobile && (
                <button
                    className={`app-sidebar-overlay${mobileOpen ? " is-open" : ""}`}
                    type="button"
                    aria-label="Close navigation"
                    aria-hidden={!mobileOpen}
                    tabIndex={mobileOpen ? 0 : -1}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className="app-main">
                <header className="app-header">
                    <div className="app-header-leading">
                        <button
                            className="app-sidebar-toggle"
                            type="button"
                            aria-label={isMobile ? (mobileOpen ? "Close navigation" : "Open navigation") : (collapsed ? "Expand sidebar" : "Collapse sidebar")}
                            aria-expanded={isMobile ? mobileOpen : !collapsed}
                            aria-controls="app-sidebar"
                            onClick={handleMenuToggle}
                        >
                            {isMobile
                                ? (mobileOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />)
                                : (collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />)}
                        </button>
                        <div className="app-header-heading">
                            <p className="app-breadcrumb">TutorAI <span aria-hidden="true">/</span> {title}</p>
                            <h1>{title}</h1>
                        </div>
                    </div>
                    <div className="app-header-actions">
                        <div className="app-user">
                            <span className="app-avatar" aria-hidden="true">{initials || "L"}</span>
                            <span className="app-user-name">{displayName}</span>
                        </div>
                    </div>
                </header>

                <main className="app-content" aria-label={`${title} content`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
