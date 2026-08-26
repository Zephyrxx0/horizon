import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type AppRoute = '/' | '/apply' | '/track' | '/design-system' | '/support' | '/faq';

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  currentRoute: '/',
  navigate: () => {},
  params: {},
});

export function parseCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';

  // Support both hash routing and path routing
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/apply')) return '/apply';
  if (hash.startsWith('/track')) return '/track';
  if (hash.startsWith('/design-system')) return '/design-system';
  if (hash.startsWith('/support') || hash.startsWith('/faq')) return '/support';

  const pathname = window.location.pathname;
  if (pathname.startsWith('/apply')) return '/apply';
  if (pathname.startsWith('/track')) return '/track';
  if (pathname.startsWith('/design-system')) return '/design-system';
  if (pathname.startsWith('/support') || pathname.startsWith('/faq')) return '/support';

  return '/';
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(parseCurrentRoute);

  const navigate = useCallback((to: AppRoute) => {
    setCurrentRoute(to);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `#${to}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, params: {} }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: AppRoute;
  children: React.ReactNode;
}

export function Link({ to, children, className = '', ...rest }: LinkProps) {
  const { navigate } = useRouter();

  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
