"use client";

import { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiMapPin,
  FiUser,
  FiPhone,
  FiGlobe,
  FiHome,
  FiMap,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

//internal imports
import { countries } from "@utils/countries";
import useCustomToast from "@hooks/useCustomToast";
import { addShippingAddressAction } from "@lib/actions/customer.actions";

const UpdateShippingAddress = ({ shippingAddress, error: fetchError }) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [state, formAction, isPending] = useActionState(
    addShippingAddressAction,
    undefined,
  );

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    country: shippingAddress?.country || "",
    city: shippingAddress?.city || "",
    area: shippingAddress?.area || "",
  });

  const handleInputChange = (name, value) => {
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "country") {
      const result =
        countries?.find((country) => country?.name === value)?.cities || [];
      setCities(result);
      setAreas([]);
      setSelectedValue((prev) => ({ ...prev, city: "", area: "" }));
    }
    if (name === "city") {
      const result = cities?.find((city) => city?.name === value)?.areas || [];
      setAreas(result);
      setSelectedValue((prev) => ({ ...prev, area: "" }));
    }
  };

  const { formRef } = useCustomToast(state);

  // console.log({ state });

  // Refresh page data after successful update
  useEffect(() => {
    if (state?.success && state?.shippingAddress) {
      // Update the session with new shipping address
      update({
        ...session,
        user: {
          ...session?.user,
          shippingAddress: state.shippingAddress,
        },
      });
      // Refresh the page to get latest data from server
      router.refresh();
    }
  }, [state?.success]);

  useEffect(() => {
    if (shippingAddress?.country) {
      const countryData = countries?.find(
        (country) => country?.name === shippingAddress?.country,
      );
      const citiesList = countryData?.cities || [];
      setCities(citiesList);

      if (shippingAddress?.city) {
        const cityData = citiesList?.find(
          (city) => city?.name === shippingAddress?.city,
        );
        setAreas(cityData?.areas || []);
      }
    }
  }, [shippingAddress]);

  const isUpdate = !!shippingAddress?._id;

  return (
    <div className="max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <FiMapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isUpdate ? "Update Shipping Address" : "Add Shipping Address"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isUpdate
                ? "Update your delivery address details"
                : "Add a new delivery address"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{fetchError}</p>
        </div>
      )}

      {/* Success Message */}
      {state?.success && (
        <div className="mb-6 p-4 bg-accent border border-primary rounded-xl flex items-center gap-3">
          <FiCheck className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-primary">{state.message}</p>
        </div>
      )}

      <form ref={formRef} action={formAction}>
        <div className="bg-background rounded-2xl shadow-lg border border-border p-6 lg:p-8">
          <div className="space-y-5">
            {/* Full Name */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={shippingAddress?.name || ""}
                  placeholder="Enter your full name"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.name.join(" ")}
                </p>
              )}
            </div>

            {/* Full Address */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiHome className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="address"
                  defaultValue={shippingAddress?.address || ""}
                  placeholder="Street address, building, apartment"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state?.errors?.address && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.address.join(" ")}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="tel"
                  name="contact"
                  defaultValue={shippingAddress?.contact || ""}
                  placeholder="+1 (555) 000-0000"
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              </div>
              {state?.errors?.contact && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {state.errors.contact.join(" ")}
                </p>
              )}
            </div>

            {/* Country & City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiGlobe className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    value={selectedValue.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Country</option>
                    {countries?.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="hidden"
                    name="country"
                    value={selectedValue.country}
                  />
                </div>
                {state?.errors?.country && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.country.join(" ")}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="form-group">
                <label className="block text-muted-foreground font-medium text-sm mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMap className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    value={selectedValue.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!selectedValue.country}
                    className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities?.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <input type="hidden" name="city" value={selectedValue.city} />
                </div>
                {state?.errors?.city && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {state.errors.city.join(" ")}
                  </p>
                )}
              </div>
            </div>

            {/* Area */}
            <div className="form-group">
              <label className="block text-muted-foreground font-medium text-sm mb-2">
                Area (Optional)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <select
                  value={selectedValue.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  disabled={!selectedValue.city || areas?.length === 0}
                  className="h-12 text-sm pl-11 pr-4 w-full rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none appearance-none cursor-pointer disabled:bg-muted disabled:cursor-not-allowed"
                >
                  <option value="">Select Area</option>
                  {areas?.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="area" value={selectedValue.area} />
              </div>
            </div>

            {/* Hidden fields */}
            <input
              type="hidden"
              name="shippingAddressId"
              value={shippingAddress?._id || ""}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>{isUpdate ? "Update Address" : "Save Address"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateShippingAddress;
