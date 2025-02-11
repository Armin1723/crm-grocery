import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const SubscriptionOverlay = () => {
  const openInBrowser = (url) => {
    window.electron.ipcRenderer.send("open-in-browser", url);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0.4,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0.4,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="bg-[var(--color-card)] p-6 rounded-lg shadow-lg max-w-md w-full text-center relative"
      >
        <Link
          to="/"
          className="absolute right-4 top-6 px-3 py-1 bg-red-500 hover:bg-red-600 transition-all duration-300 ease-in cursor-pointer rounded-md text-white"
        >
          X
        </Link>
        <h2 className="text-xl font-semibold my-4">Subscription Expired</h2>
        <p className="mt-2 text-[var(--color-text-light)]">
          Your subscription has expired. Renew now to continue accessing premium
          features.
        </p>
        <div className="mt-4 text-sm">
          <p>Benefits of renewing your subscription:</p>
          <ul className="list-disc list-inside mt-2 text-[var(--color-text-light)]">
            <li>Unlimited access to all premium features</li>
            <li>Priority customer support</li>
            <li>Exclusive updates and new features</li>
          </ul>
        </div>
        <div className="mt-4 text-[var(--color-text-light)] text-xs">
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Link
            to="mailto:alam.airuz23@gmail.com?subject=Subscription Renewal Inquiry"
            className="px-4 py-2 rounded bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition"
          >
            Contact Sales
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionOverlay;
