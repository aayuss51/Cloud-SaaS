import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Property, SaaSTier } from '../types';
import {
  getProperties,
  getCurrentPropertyId,
  setCurrentPropertyId,
  saveProperty,
  updateSubscriptionPlan,
} from '../services/mockDb';

interface TenantContextType {
  currentProperty: Property | null;
  properties: Property[];
  isLoading: boolean;
  switchProperty: (propertyId: string) => void;
  createProperty: (data: Partial<Property> & { name: string }) => Promise<Property>;
  updateProperty: (propertyId: string, data: Partial<Property>) => Promise<Property>;
  upgradePlan: (propertyId: string, tier: SaaSTier, billingCycle: 'MONTHLY' | 'ANNUAL') => Promise<Property>;
  refreshProperties: () => Promise<void>;
  isAllPropertiesView: boolean;
  setAllPropertiesView: (val: boolean) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllPropertiesView, setAllPropertiesView] = useState(false);

  const loadData = async () => {
    try {
      const list = await getProperties();
      setProperties(list);
      const activeId = getCurrentPropertyId();
      const active = list.find(p => p.id === activeId) || list[0] || null;
      setCurrentProperty(active);
    } catch (e) {
      console.error('Failed to load SaaS properties', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const switchProperty = (propertyId: string) => {
    const found = properties.find(p => p.id === propertyId);
    if (found) {
      setCurrentProperty(found);
      setCurrentPropertyId(found.id);
      setAllPropertiesView(false);
    }
  };

  const createProperty = async (data: Partial<Property> & { name: string }): Promise<Property> => {
    const newProp = await saveProperty(data);
    await loadData();
    switchProperty(newProp.id);
    return newProp;
  };

  const updateProperty = async (propertyId: string, data: Partial<Property>): Promise<Property> => {
    const updated = await saveProperty({ ...data, id: propertyId, name: data.name || currentProperty?.name || 'Hotel' });
    await loadData();
    return updated;
  };

  const upgradePlan = async (
    propertyId: string,
    tier: SaaSTier,
    billingCycle: 'MONTHLY' | 'ANNUAL'
  ): Promise<Property> => {
    const updated = await updateSubscriptionPlan(propertyId, tier, billingCycle);
    await loadData();
    if (currentProperty?.id === propertyId) {
      setCurrentProperty(updated);
    }
    return updated;
  };

  const refreshProperties = async () => {
    await loadData();
  };

  const value = useMemo(
    () => ({
      currentProperty,
      properties,
      isLoading,
      switchProperty,
      createProperty,
      updateProperty,
      upgradePlan,
      refreshProperties,
      isAllPropertiesView,
      setAllPropertiesView,
    }),
    [currentProperty, properties, isLoading, isAllPropertiesView]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
