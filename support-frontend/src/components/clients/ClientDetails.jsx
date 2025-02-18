import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientCard from "./ClientCard";
import Divider from "../utils/Divider";
import ClientActions from "./ClientActions";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/clients/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Something went wrong");
        } else {
          setClient(data.client);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id, refetch]);
  return (
    <div className="flex flex-col gap-2 bg-[var(--color-card)] rounded-lg p-3 h-full">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Divider title="Client Details" />
            <ClientActions client={client} setRefetch={setRefetch} />
          </div>
          <ClientCard client={client} />
        </>
      )}
    </div>
  );
};

export default ClientDetails;
