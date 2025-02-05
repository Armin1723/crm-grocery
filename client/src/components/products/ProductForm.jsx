import React from "react";
import { useForm } from "react-hook-form";
import TagInput from "../utils/TagInput";
import { autoSetConversionFactor, categories, taxSlabs, units } from "../utils";
import { toast } from "react-toastify";
import FormInput from "../utils/FormInput";
import { MdClose } from "react-icons/md";
import Divider from "../utils/Divider";

const ProductForm = ({
  product = {},
  title = "add",
  setRefetch = () => {},
  closeModal = () => {},
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    product.category || ""
  );
  const [subCategories, setSubCategories] = React.useState(
    selectedCategory
      ? categories.find((cat) => cat.category === selectedCategory)
          .subCategories || []
      : []
  );
  const [isStockAlertEnabled, setIsStockAlertEnabled] = React.useState(
    product?.stockAlert?.preference || false
  );
  const [tags, setTags] = React.useState(product.tags || []);
  const [imagePreview, setImagePreview] = React.useState(product.image || null);

  const [conversionModalOpen, setConversionModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      image: product.image || undefined,
      name: product.name || "",
      description: product.description || "",
      rate: product.rate || undefined,
      category: product.category || "",
      subCategory: product.subCategory || "",
      shelfLife: product.shelfLife || "",
      tax: product.tax || 0,
      mrp: product.mrp || undefined,
      primaryUnit: product.primaryUnit || "",
      secondaryUnit: product.secondaryUnit || "",
      conversionFactor: product.conversionFactor || 0,
      stockAlert: product?.stockAlert?.quantity || 0,
    },
  });

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) {
        event.target.value = null;
        toast.error("Image size should be less than 500kb");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("image", file);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    setValue("category", selected);

    // Find subcategories for the selected category
    const category = categories.find((cat) => cat.category === selected);
    setSubCategories(category ? category.subCategories || [] : []);
    setValue("subcategory", "");
  };

  const addProduct = async (values) => {
    const id = toast.loading(
      `${title === "edit" ? "Updating" : "Adding "} product...`
    );
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);
    if (
      product &&
      product.primaryUnit &&
      product.primaryUnit !== values.primaryUnit
    ) {
      formData.append("primaryUnit", values.primaryUnit);
    }
    if (
      product &&
      product.secondaryUnit &&
      product.secondaryUnit !== values.secondaryUnit
    ) {
      formData.append("secondaryUnit", values.secondaryUnit);
    }
    if (
      product &&
      product.conversionFactor &&
      product.conversionFactor !== values.conversionFactor
    ) {
      formData.append("conversionFactor", values.conversionFactor);
    }
    formData.append("rate", values.rate);
    if (values.mrp) formData.append("mrp", values.mrp);
    if (values.shelfLife) formData.append("shelfLife", values.shelfLife);
    formData.append("description", values.description);
    formData.append("tax", values.tax);
    if (isStockAlertEnabled && values.stockAlert) {
      formData.append("stockAlert", {
        preference: true,
        quantity: values.stockAlert,
      });
    }
    // Append each tag individually to formData
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    // Append product photo to FormData object
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products${
          title == "edit" ? "/" + product._id : ""
        }`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.update(id, {
          render: data.message || `Failed to ${title} product`,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        const data = await response.json();
        toast.update(id, {
          render: `Product ${
            title == "edit" ? "updated" : "added"
          } successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (title == "add") {
          reset();
          setTags([]);
          setImagePreview(null);
        } else {
          closeModal();
          setRefetch((p) => !p);
        }
      }
    } catch (error) {
      toast.update(id, {
        render: error.message || `Failed to ${title} product`,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(addProduct)}
      className="flex flex-col gap-2 w-full flex-1 min-h-[60vh] px-3 max-sm:px-1 space-y-2"
    >
      {/* Image Upload */}
      <div className="space-y-2">
        <label htmlFor="image my-2 font-semibold">Product Image</label>
        <div className="border-2 border-dashed border-neutral-500/50 rounded-lg p-4 text-center relative">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto max-h-48 object-contain"
              />
              <div
                className="absolute top-2 right-2 cursor-pointer hover:opacity-75"
                onClick={() => {
                  setImagePreview(null);
                  setValue("image", null);
                }}
              >
                <MdClose />
              </div>
            </div>
          ) : (
            <div
              onClick={() => document.querySelector("#image-upload").click()}
              className="h-48 cursor-pointer flex items-center justify-center bg-[var(--color-card)] rounded-lg"
            >
              <span className="text-gray-500">Click to upload image</span>
            </div>
          )}
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="w-full py-2 "
            onChange={handleImageChange}
          />
        </div>
      </div>

      <Divider title="Product Details" />

      <div className="name-tax-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full ">
        {/* Name Input */}
        <FormInput
          label="Name"
          error={errors && errors.name}
          otherClasses="w-1/2"
          withAsterisk
        >
          <input
            type="text"
            placeholder="Product Name"
            className={`input peer ${
              errors && errors.name && "border-red-500 focus:!border-red-500"
            }`}
            name="name"
            {...register("name", {
              required: "Name is required",
            })}
          />
        </FormInput>

        {/* Tax Input */}
        <div className="tax-input w-1/2 max-sm:w-full flex flex-col relative group my-2">
          <label
            htmlFor="tax"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.tax && "!text-red-500"
            }`}
          >
            Tax Rate
          </label>
          <select
            name="tax"
            className={`w-full border border-neutral-500/50 hover:border-accentDark rounded-md bg-transparent outline-none p-2 ${
              errors && errors.tax && "border-red-500"
            }`}
            {...register("tax")}
          >
            <option
              value={0}
              className={`!bg-[var(--color-card)] ${
                errors && errors.tax && "!text-red-500"
              }`}
            >
              Select Tax Rate
            </option>
            {taxSlabs.map((sub) => (
              <option
                key={sub.rate}
                value={sub.rate}
                className="!bg-[var(--color-card)]"
              >
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Unit group */}
      <div className="unit-group flex max-sm:flex-col max-sm:gap-2 w-full items-end gap-4">
        {/* Unit Dropdown */}
        <div className="unit-input w-1/2 max-sm:w-full my-2 relative">
          <label
            htmlFor="primaryUnit"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.primaryUnit && "border-red-500 text-red-500 "
            }`}
          >
            Primary Unit*
          </label>
          <select
            name="primaryUnit"
            className={`w-full peer border border-neutral-500/50 focus:border-accentDark rounded-md bg-transparent outline-none p-2 ${
              errors && errors.primaryUnit && "border-red-500 text-red-500"
            }`}
            {...register("primaryUnit", {
              required: "Primary Unit is required",
              onChange: (e) => {
                setValue("primaryUnit", e.target.value);
                setValue("secondaryUnit", e.target.value);
                setValue("conversionFactor", 1);
              },
            })}
          >
            <option
              value=""
              disabled
              className={`!bg-[var(--color-card)] ${
                errors && errors.primaryUnit && "!text-red-500"
              }`}
            >
              Select Primary Unit
            </option>
            {units.map((sub) => (
              <option key={sub} value={sub} className="!bg-[var(--color-card)]">
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Secondary Unit Dropdown */}
        <div className="unit-input w-1/2 max-sm:w-full my-2 relative">
          <label
            htmlFor="secondaryUnit"
            className={`input-label peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.secondaryUnit && "border-red-500 text-red-500"
            }`}
          >
            Secondary Unit*
          </label>
          <select
            name="secondaryUnit"
            className={`w-full border border-neutral-500/50 focus:border-accentDark rounded-md bg-transparent outline-none p-2 ${
              errors && errors.secondaryUnit && "border-red-500 text-red-500"
            }`}
            {...register("secondaryUnit", {
              required: "Secondary Unit is required",
              onChange: (e) => {
                setValue("secondaryUnit", e.target.value);
                setValue(
                  "conversionFactor",
                  autoSetConversionFactor(watch("primaryUnit"), e.target.value)
                );
              },
            })}
          >
            <option
              value=""
              disabled
              className={`!bg-[var(--color-card)] ${
                errors && errors.secondaryUnit && "!text-red-500"
              }`}
            >
              Select Secondary Unit
            </option>
            {units.map((sub) => (
              <option key={sub} value={sub} className="!bg-[var(--color-card)]">
                {sub}
              </option>
            ))}
          </select>

          {/* Display conversion factor */}
          {watch("primaryUnit") && watch("secondaryUnit") && (
            <div className="text-center text-xs absolute px-3 py-0.5 rounded-lg bg-accent text-white right-6 top-1/2 -translate-y-1/2 !z-[999]">
              <div
                className="cursor-pointer"
                onClick={() => setConversionModalOpen(true)}
              >
                1 {watch("primaryUnit")} ={" "}
                {getValues("conversionFactor") + " " + watch("secondaryUnit")}
              </div>
            </div>
          )}

          {/* Conversion Modal */}
          {conversionModalOpen && (
            <div className="fixed inset-0 !z-[999] bg-black bg-opacity-50 flex justify-center items-center">
              <div className="flex flex-col gap-2 actualModal h-[40vh] min-h-fit min-w-fit w-[25vw] max-sm:min-w-[80vw] overflow-y-auto max-w-[90%] bg-[var(--color-card)] rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Conversion Factor</h2>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                    onClick={() => setConversionModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-col gap-4 flex-1 items-center justify-center">
                  <div className="flex flex-grow-0 w-full items-center gap-2 relative">
                    <p className="flex items-center gap-2">1</p>
                    <p>{watch("primaryUnit")} </p>
                    <p>=</p>
                    <input
                      type="number"
                      {...register("conversionFactor")}
                      min={1}
                      className="bg-transparent focus:outline-none rounded-md border border-neutral-500/50 focus:border-accentDark p-2 flex-1 w-2/3"
                    />
                    <p className="absolute top-1/2 -translate-y-1/2 right-8 bg-accent px-3 text-xs rounded-lg text-white">
                      {watch("secondaryUnit")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider title="Category Information" />

      <div className="category-group flex max-sm:flex-col max-sm:gap-2 w-full items-start gap-4">
        {/* Category Dropdown */}
        <div className="flex-1 max-sm:w-full my-2 relative">
          <label
            htmlFor="category"
            className={`${
              errors && errors.category && "text-red-500"
            } input-label peer-focus:text-[var(--color-accent-dark)]`}
          >
            Category*
          </label>
          <select
            name="category"
            className={`w-full border border-neutral-500/50 focus:border-[var(--color-accent)] rounded-md bg-transparent p-2 outline-none ${
              errors && errors.category && "border-red-500 text-red-500"
            }`}
            {...register("category", {
              required: "Category is required",
              onChange: handleCategoryChange,
            })}
          >
            <option value="" disabled className=" !bg-[var(--color-card)]">
              Select a category
            </option>
            {categories.map((cat) => (
              <option
                key={cat.category}
                value={cat.category}
                className="!bg-[var(--color-card)] hover:!bg-accentDark"
              >
                {cat.category}
              </option>
            ))}
          </select>
          {errors && errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Subcategory Dropdown */}
        <div className="flex-1 max-sm:w-full my-2 relative">
          <label
            htmlFor="subCategory"
            className={` ${
              errors && errors.subCategory && "text-red-500"
            } input-label peer-focus:text-[var(--color-accent-dark)]`}
          >
            SubCategory*
          </label>
          <select
            name="subCategory"
            className={`w-full peer border border-neutral-500/50  focus:border-accentDark rounded-md bg-transparent outline-none p-2 ${
              errors && errors.subCategory && "border-red-500 text-red-500"
            }`}
            {...register("subCategory", {
              required: "subCategory is required",
            })}
            disabled={!selectedCategory}
          >
            <option value="" disabled className=" !bg-[var(--color-card)]">
              Select a subCategory
            </option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub} className="!bg-[var(--color-card)]">
                {sub}
              </option>
            ))}
          </select>
          {errors && errors.subCategory && (
            <span className="text-red-500 text-sm">
              {errors.subCategory.message}
            </span>
          )}
        </div>
      </div>

      <div className="rate-shelf-group flex max-sm:flex-col max-sm:gap-2 mt-2 w-full gap-4">
        {/* Rate Input */}
        <FormInput
          label="Rate"
          error={errors && errors.rate}
          otherClasses="w-1/2"
        >
          <input
            type="number"
            inputMode="alphanumeric"
            placeholder=" "
            className={`input peer ${
              errors && errors.rate && "border-red-500 focus:!border-red-500"
            }`}
            name="rate"
            {...register("rate")}
          />
        </FormInput>

        {/* ShelfLife Input */}
        <FormInput
          label="Shelf Life"
          otherClasses="w-1/2"
          error={errors && errors.shelfLife}
        >
          <input
            type="number"
            inputMode="alphanumeric"
            placeholder="In days"
            step={1}
            className={`input peer ${
              errors &&
              errors.shelfLife &&
              "border-red-500 focus:!border-red-500 text-red-500"
            }`}
            name="shelfLife"
            {...register("shelfLife")}
          />
        </FormInput>
      </div>

      <div className="upc-alert-group flex-col gap-2 mt-2 w-full items-end">
        {/* Stock Alert Checkbox */}
        <div className="flex items-center gap-2 ">
          <input
            type="checkbox"
            id="stockAlert"
            checked={isStockAlertEnabled}
            className="w-4 h-4 checkbox"
            onChange={(e) => setIsStockAlertEnabled(e.target.checked)}
          />
          <label
            htmlFor="stockAlert"
            className="text-sm font-semibold text-neutral-500"
          >
            Stock Alert
          </label>
        </div>
        <div className="alert-upc-input flex max-sm:flex-col max-sm:gap-2 mt-2 w-full gap-4">
          {/* Input for Stock Alert Quantity */}
          <div
            className={` ${
              isStockAlertEnabled ? "opacity-100" : "opacity-50"
            } my-2 w-1/2 max-sm:w-full flex-1 flex items-center gap-2 relative`}
          >
            <input
              type="number"
              disabled={!isStockAlertEnabled}
              placeholder="Stock Alert"
              min={0}
              className={`input peer w-full ${
                errors?.stockAlert && "border-red-500 focus:!border-red-500"
              }`}
              name="stockAlert"
              {...register("stockAlert", {
                required:
                  isStockAlertEnabled && "Stock Alert value is required",
              })}
            />

            <span className="inline text-xs absolute right-6 z-[999] px-3 rounded-xl bg-accent text-white">
              {getValues("secondaryUnit")}
            </span>
            {errors?.stockAlert && (
              <span className="text-red-500 text-sm">
                {errors.stockAlert.message}
              </span>
            )}
          </div>

          {/* MRP Input */}
          <FormInput
            label="MRP"
            error={errors && errors.mrp}
            otherClasses="w-1/2"
          >
            <input
              type="number"
              inputMode="alphanumeric"
              placeholder=" "
              className={`input peer ${
                errors &&
                errors.mrp &&
                "border-red-500 focus:!border-red-500 text-red-500"
              }`}
              name="mrp"
              {...register("mrp", {
                valueAsNumber: true,
                min: 0,
              })}
            />
          </FormInput>
        </div>
      </div>

      <Divider title="Additional Information" />

      {/* Tag Input */}
      <TagInput tags={tags} setTags={setTags} />

      {/* Description Input */}
      <div className="description-input w-full flex flex-col relative group my-2 py-2">
        <label
          htmlFor="description"
          className="input-label peer-focus:text-accentDark"
        >
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Enter product description (optional)"
          className={`input placeholder:text-neutral-500 placeholder:text-xs peer ${
            errors &&
            errors.description &&
            "border-red-500 focus:!border-red-500"
          }`}
          {...register("description")}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent disabled:cursor-not-allowed disabled:opacity-30 hover:bg-accentDark text-white"
      >
        {title} Product
      </button>
    </form>
  );
};

export default ProductForm;
