import React from "react";
import { useForm } from "react-hook-form";
import TagInput from "../utils/TagInput";
import { autoSetConversionFactor, categories, taxSlabs, units } from "../utils";
import { toast } from "react-toastify";
import Avatar from "../utils/Avatar";

const ProductForm = ({
  product = [],
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
  const [image, setImage] = React.useState(product.image || null);

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
      rate: product.rate || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      shelfLife: product.shelfLife || "",
      tax: product.tax || 0,
      upc: product.upc || "",
      primaryUnit: product.primaryUnit || "",
      secondaryUnit: product.secondaryUnit || "",
      conversionFactor: product.conversionFactor || 0,
      stockAlert: product?.stockAlert?.quantity || 0,
    },
  });

  //Use effect for auto conversion-factor calculation
  React.useEffect(() => {
    if (watch("primaryUnit") && watch("secondaryUnit")) {
      const factor = autoSetConversionFactor(watch("primaryUnit"), watch("secondaryUnit"));
      setValue("conversionFactor", factor);
    }
  }, [watch("primaryUnit"), watch("secondaryUnit")]);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) {
        toast.error("Image size should be less than 500kb");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
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
    formData.append("primaryUnit", values.primaryUnit);
    formData.append("secondaryUnit", values.secondaryUnit);
    formData.append("conversionFactor", values.conversionFactor);
    formData.append("rate", values.rate);
    formData.append("upc", values.upc);
    formData.append("shelfLife", values.shelfLife);
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
          setImage(null);
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
        className="flex flex-col justify-end gap-2 w-full flex-1 min-h-[60vh]"
      >
        <div className="basic-details-group flex max-sm:flex-col w-full items-center gap-4">
          <div className="image-input w-1/5 max-sm:w-1/2 my-2 flex flex-col items-center gap-2">
            {/* Avatar for Image Preview */}
            <label htmlFor="image-upload" className="cursor-pointer">
              <Avatar
                image={image || null}
                width={100}
                withBorder={false}
                fallbackImage="/utils/product-placeholder.png"
                alt="Product Preview"
                className="border-2 border-black"
              />
              {!image && (
                <div className="flex items-center justify-center h-full text-sm">
                  Upload
                </div>
              )}
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: "none" }}
              {...register("image")}
              onChange={handleImageChange}
            />
          </div>

          <div className="name-unit flex-1 max-sm:w-full flex flex-col gap-2 justify-center">
            <div className="name-tax-group flex max-sm:flex-col gap-4 max-sm:gap-2 w-full items-end">
              {/* Name Input */}
              <div className="name-input w-full flex flex-col relative group my-2">
                <input
                  type="text"
                  placeholder=" "
                  className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
                    errors &&
                    errors.name &&
                    "border-red-500 focus:!border-red-500"
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
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Tax Input */}
              <div className="name-input w-full flex flex-col relative group my-2">
                <select
                  name="tax"
                  className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
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
              <div className="unit-input w-1/3 max-sm:w-full my-2">
                <label
                  htmlFor="primaryUnit"
                  className={`text-sm font-semibold text-neutral-500 ${
                    errors &&
                    errors.primaryUnit &&
                    "border-red-500 text-red-500"
                  }`}
                >
                  Primary Unit*
                </label>
                <select
                  name="primaryUnit"
                  className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
                    errors &&
                    errors.primaryUnit &&
                    "border-red-500 text-red-500"
                  }`}
                  {...register("primaryUnit", {
                    required: "Primary Unit is required",
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

              {/* Secondary Unit Dropdown */}
              <div className="unit-input w-1/3 max-sm:w-full my-2">
                <label
                  htmlFor="secondaryUnit"
                  className={`text-sm font-semibold text-neutral-500 ${
                    errors &&
                    errors.secondaryUnit &&
                    "border-red-500 text-red-500"
                  }`}
                >
                  Secondary Unit*
                </label>
                <select
                  name="secondaryUnit"
                  className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
                    errors &&
                    errors.secondaryUnit &&
                    "border-red-500 text-red-500"
                  }`}
                  {...register("secondaryUnit", {
                    required: "Secondary Unit is required",
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

              {/* Conversion Factor Input */}
              <div className="conversion-input w-1/3 max-sm:w-full my-2 flex items-center gap-2">
                {!watch("primaryUnit") || !watch("secondaryUnit") ? (
                  <p className="text-center w-full italic text-neutral-500">
                    Units not selected
                  </p>
                ) : (
                  <>
                    <p className="whitespace-nowrap">
                      1 {watch("primaryUnit")} =
                    </p>
                    <input
                      type="number"
                      placeholder="Conversion Factor"
                      className={`outline-none border-b border-accent z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer w-full ${
                        errors && errors.conversionFactor && "border-red-500"
                      }`}
                      name="conversionFactor"
                      {...register("conversionFactor", {
                        required: "Conversion Factor is required",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "Conversion factor must be at least 1",
                        },
                      })}
                    />
                    {watch("secondaryUnit")}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="category-group flex max-sm:flex-col max-sm:gap-2 w-full items-start gap-4">
          {/* Category Dropdown */}
          <div className="flex-1 max-sm:w-full my-2">
            <label
              htmlFor="category"
              className={`${
                errors && errors.category && "text-red-500"
              } text-sm font-semibold text-neutral-500`}
            >
              Category*
            </label>
            <select
              name="category"
              className={`w-full border-b border-[var(--color-accent)] bg-transparent p-2 outline-none ${
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
          <div className="flex-1 max-sm:w-full my-2">
            <label
              htmlFor="subCategory"
              className={` ${
                errors && errors.subCategory && "text-red-500"
              } text-sm font-semibold text-neutral-500`}
            >
              SubCategory*
            </label>
            <select
              name="subCategory"
              className={`w-full border-b border-accent bg-transparent outline-none p-2 ${
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

        <div className="rate-shelf-group flex max-sm:flex-col max-sm:gap-2 mt-2 w-full items-end gap-4">
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

          {/* ShelfLife Input */}
          <div className="shelf-input flex-1 max-sm:w-full flex flex-col relative group my-2">
            <input
              type="number"
              inputMode="alphanumeric"
              placeholder=" "
              step={1}
              className={`outline-none border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
                errors &&
                errors.shelfLife &&
                "border-red-500 focus:!border-red-500"
              }`}
              name="shelfLife"
              {...register("shelfLife")}
            />
            <label
              htmlFor="shelfLife"
              className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
                errors && errors.shelfLife && "!text-red-500"
              }`}
            >
              Shelf Life <span className="italic text-xs">(in days)</span>
            </label>
            {errors && errors.rate && (
              <span className="text-red-500 text-sm">
                {errors.rate.message}
              </span>
            )}
          </div>
        </div>

        <div className="upc-alert-group flex max-sm:flex-col max-sm:gap-2 mt-2 w-full items-end gap-4">
          {/* Stock Alert Input */}
          <div className="stock-alert-input flex relative group my-2 flex-1 max-sm:w-full items-center gap-2">
            <div className="flex items-center gap-2 ">
              <input
                type="checkbox"
                id="stockAlert"
                checked={isStockAlertEnabled}
                className="w-4 h-4 !bg-accentDark"
                onChange={(e) => setIsStockAlertEnabled(e.target.checked)}
              />
              <label
                htmlFor="stockAlert"
                className="text-sm font-semibold text-neutral-500"
              >
                Stock Alert
              </label>
            </div>

            {/* Input for Stock Alert Quantity */}
            <div
              className={` ${
                isStockAlertEnabled ? "opacity-100" : "opacity-50"
              } mt-2 flex-1 flex items-center gap-2`}
            >
              <input
                type="number"
                disabled={!isStockAlertEnabled}
                placeholder="Stock Alert"
                className={`outline-none border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer w-full ${
                  errors?.stockAlert && "border-red-500 focus:!border-red-500"
                }`}
                name="stockAlert"
                {...register("stockAlert", {
                  required:
                    isStockAlertEnabled && "Stock Alert value is required",
                })}
              />
              <span className="inline">{getValues("secondaryUnit")}</span>
            </div>
            {errors?.stockAlert && (
              <span className="text-red-500 text-sm">
                {errors.stockAlert.message}
              </span>
            )}
          </div>

          {/* UPC Input */}
          <div className="upc-input flex-1 max-sm:w-full flex flex-col relative group my-2">
            <input
              type="number"
              inputMode="alphanumeric"
              placeholder=" "
              className={`outline-none border-b border-[var(--color-accent)] z-[5] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer ${
                errors && errors.upc && "border-red-500 focus:!border-red-500"
              }`}
              name="upc"
              {...register("upc")}
            />
            <label
              htmlFor="upc"
              className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] ${
                errors && errors.upc && "!text-red-500"
              }`}
            >
              UPC
            </label>
            {errors && errors.upc && (
              <span className="text-red-500 text-sm">{errors.upc.message}</span>
            )}
          </div>
        </div>

        {/* Tag Input */}
        <TagInput tags={tags} setTags={setTags} />

        {/* Description Input */}
        <div className="description-input w-full flex flex-col relative group my-2">
          <textarea
            rows={3}
            placeholder="Enter product description (optional)"
            className={`outline-none placeholder:text-neutral-500 placeholder:text-xs placeholder:italic p-2 rounded-md border border-[var(--color-accent)] z-[5] bg-transparent transition-all duration-300 peer ${
              errors &&
              errors.description &&
              "border-red-500 focus:!border-red-500"
            }`}
            name="description"
            {...register("description")}
          />
        </div>

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
