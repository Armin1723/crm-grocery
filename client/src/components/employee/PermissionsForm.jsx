import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PermissionsForm = ({
  employee,
  setRefetch = () => {},
  closeModal = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  // Using react-hook-form to manage form state
  const { register, handleSubmit, formState, watch, getValues } = useForm({
    defaultValues: {
      products: employee?.permissions?.includes("products") || false,
      sales: employee?.permissions?.includes("sales") || false,
      inventory: employee?.permissions?.includes("inventory") || false,
      salesReturns: employee?.permissions?.includes("salesReturns") || false,
      customers: employee?.permissions?.includes("customers") || false,
      purchases: employee?.permissions?.includes("purchases") || false,
      suppliers: employee?.permissions?.includes("suppliers") || false,
      expenses: employee?.permissions?.includes("expenses") || false,
      purchaseReturns:
        employee?.permissions?.includes("purchaseReturns") || false,
      employees: employee?.permissions?.includes("employees") || false,
      companies: employee?.permissions?.includes("companies") || false,
      reports: employee?.permissions?.includes("reports") || false,
    },
  });

  // Permissions list
  const permissions = [
    "sales",
    "inventory",
    "salesReturns",
    "customers",
    "products",
    "purchases",
    "suppliers",
    "expenses",
    "companies",
    "reports",
  ];

  // Form submission handler
  const onSubmit = async () => {
    const updatedPermissions = permissions.filter((permission) =>
      getValues(permission)
    );
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/employees/update-permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions: updatedPermissions,
            uuid: employee?.uuid,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update permissions");
      }
      toast.success("Permissions updated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefetch();
      closeModal();
    }
  };

  const watchedPermissions = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Permissions Section */}
      <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissions.map((permission, index) => {
          const isReadOnly = index < 4;
          return (
            <div key={permission} className="flex justify-between items-center">
              <span className="font-medium">
                {permission.charAt(0).toUpperCase() + permission.slice(1)}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled={isReadOnly}
                  {...register(permission)}
                />
                <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-disabled:cursor-not-allowed peer-disabled:opacity-75 peer-checked:bg-accent transition-all">
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      watchedPermissions[permission] ? "translate-x-5" : ""
                    }`}
                  />
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          disabled={!formState.isDirty || loading}
          type="submit"
          className="px-4 py-2 bg-accent hover:bg-accentDark text-white rounded-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default PermissionsForm;
