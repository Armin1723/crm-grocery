import React from "react";
import { toast } from "react-toastify";

const AlertForm = ({product, closeModal}) => {
    const [quantity, setQuantity] = React.useState(product?.stockAlert?.preference ? product?.stockAlert?.quantity : "");

    const setAlert = async () => {
        const id = toast.loading("Setting alert...");
        try{
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${product._id}/alert`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({quantity}),
                    credentials: "include",
                }
            );
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to set alert");
            }
            const data = await response.json();
            toast.update(id, {
                render: data.message,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            closeModal();

        }catch(error){
            toast.update(id, {
                render: error.message,
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    }

  return (
    <div>
      <p className="text-neutral-500 text-sm my-4">
        Set an alert for {product?.name} to get notified when it reaches a
        certain quantity.
      </p>
      <div className="flex items-center gap-2 my-3">
        <div className="name-input w-1/2 flex flex-col relative group my-2">
          <input
            type="text"
            placeholder=" "
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`outline-none border-b border-[var(--color-accent)] !z-[10] bg-transparent focus:border-[var(--color-accent-dark)] transition-all duration-300 peer
                      `}
            name="unit"
          />
          <label
            htmlFor="unit"
            className={`input-label peer-focus:-translate-y-full peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-x-3 peer-focus:text-[var(--color-accent-dark)] `}
          >
            Enter quantity
          </label>
        </div>
        {product?.unit}
      </div>
      <div className="buttons flex gap-2 max-sm:flex-col">
        <button onClick={setAlert} disabled={!quantity} className="w-1/2 max-sm:w-full px-3 py-1.5 text-white rounded-md bg-accent hover:bg-accentDark transiton-all duration-300 disabled:cursor-not-allowed">
        Set Alert
        </button>
        <button onClick={setAlert} disabled={!product?.stockAlert?.preference} className="w-1/2 max-sm:w-full px-3 py-1.5 text-[var(--color-text)] rounded-md border disabled:cursor-not-allowed border-accent hover:border-accentDark hover:bg-accent/20 transiton-all duration-300">
        Remove Alert
        </button>
      </div>
    </div>
  );
};

export default AlertForm;
