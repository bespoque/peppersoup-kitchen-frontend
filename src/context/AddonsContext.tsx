"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useApi } from "../hooks/useApi";

interface Addon {
  id: number;
  name: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

interface AddonsContextType {
  addOns: Addon[];
  loading: boolean;
  error: string | null;
  refreshAddon: () => void;
}

const AddonsContext = createContext<AddonsContextType | undefined>(undefined);

export const AddonsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { request, loading, error } = useApi();
  const [addOns, setAddons] = useState<Addon[]>([]);
  const hasFetched = useRef(false);

  // Fetch add-ons
  const fetchAddons = async () => {
    try {
      const data = await request(
        "/api/core/kitchen-operations/adds-on/all",
        "GET"
      );
      if (data.resp_code === "00") {
        setAddons(
          data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }))
        );
        hasFetched.current = true;
      }
    } catch (err) {
      console.error("Failed to fetch add-ons:", err);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAddons();
    }
  }, []);


  const refreshAddon = () => {
    hasFetched.current = false;
    fetchAddons();
  };

  const value = useMemo(
    () => ({
      addOns,
      loading,
      error,
      refreshAddon
    }),
    [addOns, loading, error]
  );

  return (
    <AddonsContext.Provider value={value}>{children}</AddonsContext.Provider>
  );
};

export const useAddOns = () => {
  const context = useContext(AddonsContext);
  if (context === undefined) {
    throw new Error("useAddOns must be used within an AddonsProvider");
  }
  return context;
};
