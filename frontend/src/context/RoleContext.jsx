import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(() => {
    // Initialize from localStorage or default to contractor
    return localStorage.getItem('userRole') || 'contractor';
  });

  // Update role based on route changes
  useEffect(() => {
    const isAgencyRoute = 
      location.pathname.includes('agency') || 
      location.pathname === '/assignContract';
    
    const newRole = isAgencyRoute ? 'agency' : 'contractor';
    
    if (newRole !== userRole) {
      setUserRole(newRole);
      localStorage.setItem('userRole', newRole);
    }
  }, [location.pathname, userRole]);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};
