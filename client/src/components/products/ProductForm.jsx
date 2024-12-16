import React from "react";
import { useForm } from "react-hook-form";
import TagInput from "../utils/TagInput";
import { categories, units } from "../utils";
import { toast } from "react-toastify";

const ProductForm = ({
  product = [],
  title = "Add",
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      rate: product.rate || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      unit: product.unit || "",
      stockAlert: product?.stockAlert?.quantity || 0,
    },
  });

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
    const id = toast.loading("Adding product...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products${
          title == "Edit" && "/" + product._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            rate: values.rate || undefined,
            unit: values.unit,
            category: values.category,
            subCategory: values.subCategory,
            description: values.description || undefined,
            stockAlert: values.stockAlert && {
              preference: true,
              quantity: values.stockAlert,
            },
            tags: tags,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
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
            title == "Edit" ? "updated" : "added"
          } successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (title == "Add") {
          reset();
        } else {
          closeModal();
          setRefetch((p) => !p);
        }
      }
    } catch (error) {
      toast.update(id, {
        render: `Failed to ${title} product`,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(addProduct)}
        className="flex flex-col gap-2 w-full flex-1 min-h-[50vh]"
      >
        {/* Name Input */}
        <div className="name-input w-full flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
              errors && errors.name && "border-red-500 focus:!border-red-500"
            }`}
            name="name"
            {...register("name", {
              required: "Name is required",
            })}
          />
          <label
            htmlFor="name"
            className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
              errors && errors.name && "!text-red-500"
            }`}
          >
            Name*
          </label>
          {errors && errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="rate-unit-group flex max-sm:flex-col max-sm:gap-2 w-full items-end gap-4">
          {/* Rate Input */}
          <div className="rate-input flex-1 max-sm:w-full flex flex-col relative group my-2">
            <input
              type="number"
              inputMode="alphanumeric"
              placeholder=" "
              className={`outline-none border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
                errors && errors.rate && "border-red-500 focus:!border-red-500"
              }`}
              name="rate"
              {...register("rate")}
            />
            <label
              htmlFor="rate"
              className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
                errors && errors.rate && "!text-red-500"
              }`}
            >
              Rate
            </label>
            {errors && errors.rate && (
              <span className="text-red-500 text-sm">
                {errors.rate.message}
              </span>
            )}
          </div>

          {/* Unit Dropdown */}
          <div className="unit-input w-1/2 max-sm:w-full my-2">
            <label
              htmlFor="unit"
              className="text-sm font-semibold text-neutral-500"
            >
              Unit*
            </label>
            <select
              name="unit"
              className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
                errors && errors.unit && "border-red-500"
              }`}
              {...register("unit", { required: "unit is required" })}
            >
              <option
                value=""
                disabled
                className={`!bg-[var(--color-card)] ${
                  errors && errors.unit && "!text-red-500"
                }`}
              >
                Select a Unit
              </option>
              {units.map((sub) => (
                <option
                  key={sub}
                  value={sub}
                  className="!bg-[var(--color-card)]"
                >
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="category-group flex max-sm:flex-col max-sm:gap-2 w-full items-end gap-4">
          {/* Category Dropdown */}
          <div className="flex-1 max-sm:w-full my-2">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-neutral-500"
            >
              Category*
            </label>
            <select
              name="category"
              className={`w-full border-b border-[var(--color-accent)] bg-transparent p-2 outline-none ${
                errors && errors.category && "border-red-500"
              }`}
              {...register("category", { required: "Category is required" })}
              onChange={handleCategoryChange}
            >
              <option
                value=""
                disabled
                className="!bg-[var(--color-card)] hover:!bg-accentDark"
              >
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
          <div className="w-1/2 max-sm:w-full my-2">
            <label
              htmlFor="subCategory"
              className="text-sm font-semibold text-neutral-500"
            >
              SubCategory*
            </label>
            <select
              name="subCategory"
              className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
                errors && errors.subCategory && "border-red-500"
              }`}
              {...register("subCategory", {
                required: "subCategory is required",
              })}
              disabled={!selectedCategory}
            >
              <option value="" disabled className="!bg-[var(--color-card)]">
                Select a subCategory
              </option>
              {subCategories.map((sub) => (
                <option
                  key={sub}
                  value={sub}
                  className="!bg-[var(--color-card)]"
                >
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

        {/* Stock Alert Input */}
        <div className="stock-alert-input w-full flex flex-col relative group my-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stockAlert"
              checked={isStockAlertEnabled}
              className="w-4 h-4"
              onChange={(e) => setIsStockAlertEnabled(e.target.checked)}
            />
            <label
              htmlFor="stockAlert"
              className="text-sm font-semibold text-neutral-500"
            >
              Enable Stock Alert
            </label>
          </div>

          {/* Input for Stock Alert Quantity */}
          {isStockAlertEnabled && (
            <div className="mt-2">
              <input
                type="number"
                placeholder="Alert below quantity"
                className={`outline-none border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer w-full ${
                  errors?.stockAlert && "border-red-500 focus:!border-red-500"
                }`}
                name="stockAlert"
                {...register("stockAlert", {
                  required:
                    isStockAlertEnabled && "Stock Alert value is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Alert quantity must be at least 1",
                  },
                })}
              />
              {errors?.stockAlert && (
                <span className="text-red-500 text-sm">
                  {errors.stockAlert.message}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="description-input w-full flex flex-col relative group my-2">
          <textarea
            rows={1}
            placeholder="Enter product description "
            className={`outline-none placeholder:text-neutral-500 pl-2 border-b border-[var(--color-accent)] z-[5] bg-transparent transition-all duration-300 peer ${
              errors &&
              errors.description &&
              "border-red-500 focus:!border-red-500"
            }`}
            name="description"
            {...register("description")}
          />
        </div>

        {/* Tag Input */}
        <TagInput tags={tags} setTags={setTags} />

        {/* Submit Button */}
        <button
          type="submit"
          className="px-3 py-1.5 my-2 capitalize rounded-md bg-accent hover:bg-accentDark text-white"
        >
          {title} Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
