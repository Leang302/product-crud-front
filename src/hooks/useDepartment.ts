"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DepartmentService from "@/services/departmentService";
import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types";
import { useSession } from "next-auth/react";

interface UseDepartmentOptions {
  autoload?: boolean;
}

interface UseDepartmentReturn {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Promise<Department | null>;
  create: (data: CreateDepartmentInput) => Promise<Department | null>;
  update: (
    id: string,
    data: UpdateDepartmentInput
  ) => Promise<Department | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useDepartment(
  options: UseDepartmentOptions = {}
): UseDepartmentReturn {
  const { autoload = true } = options;
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DepartmentService.list(accessToken);
      setDepartments(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (autoload) {
      load();
    }
  }, [autoload, load]);

  const refresh = useMemo(() => load, [load]);

  const getById = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const item = await DepartmentService.getById(id, accessToken);
        return item;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to get department");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const create = useCallback(
    async (data: CreateDepartmentInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await DepartmentService.create(data, accessToken);
        setDepartments((prev) => [...prev, created]);
        return created;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create department");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const update = useCallback(
    async (id: string, data: UpdateDepartmentInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await DepartmentService.update(id, data, accessToken);
        setDepartments((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d))
        );
        return updated;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update department");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const remove = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await DepartmentService.remove(id, accessToken);
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        return true;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete department");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  return {
    departments,
    isLoading,
    error,
    refresh,
    getById,
    create,
    update,
    remove,
  };
}

export default useDepartment;
