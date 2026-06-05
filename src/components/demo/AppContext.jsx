import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [licenseTier, setLicenseTier] = useState("demo");

  // Load from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("oz_user");
    const storedTenant = localStorage.getItem("oz_tenant");
    const storedLicense = localStorage.getItem("oz_license");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTenant) setTenantId(storedTenant);
    if (storedLicense) setLicenseTier(storedLicense);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("oz_user", JSON.stringify(user));
    else localStorage.removeItem("oz_user");
  }, [user]);

  useEffect(() => {
    if (tenantId) localStorage.setItem("oz_tenant", tenantId);
    else localStorage.removeItem("oz_tenant");
  }, [tenantId]);

  useEffect(() => {
    if (licenseTier) localStorage.setItem("oz_license", licenseTier);
  }, [licenseTier]);

  const login = (userData) => {
    const fakeUser = { 
      name: userData.name || userData.email.split("@")[0], 
      email: userData.email,
      role: userData.role || 'Security Admin',
      org: userData.org || 'Demo Organization'
    };
    const fakeTenant = userData.tenantId || "demo-tenant-001";
    setUser(fakeUser);
    setTenantId(fakeTenant);
  };

  const logout = () => {
    setUser(null);
    setTenantId(null);
    setLicenseTier("demo");
    localStorage.removeItem("oz_user");
    localStorage.removeItem("oz_tenant");
    localStorage.removeItem("oz_license");
  };

  const value = {
    user,
    tenantId,
    licenseTier,
    login,
    logout,
    setLicenseTier,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return ctx;
}