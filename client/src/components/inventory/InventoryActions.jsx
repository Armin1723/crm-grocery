import React, { useState } from "react";
import { MdEdit, MdOutlineVideoLabel } from "react-icons/md";
import Modal from "../utils/Modal";
import EditBatchForm from "./EditBatchForm";
import BatchLabel from "./BatchLabel";

const InventoryActions = ({ batch = {},  inventory = {}, upid = "", setRefetch = () => {} }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);

  const handleDelete = () => {};

  return (
    <div className="relative flex items-center rounded-md gap-2 cursor-pointer">
      {/* Button */}
      <div className="text-sm flex gap-2 items-center transition-all duration-300 ease-in rounded-md text-white">
        <div className="bg-accent/80 hover:bg-accentDark/80 px-2 py-1 rounded-md  cursor-pointer transition-all duration-300">
          <MdEdit
            className=""
            onClick={() => setEditModalOpen(true)}
            title="Edit Batch"
          />
        </div>
        <div className="bg-blue-400 hover:bg-blue-500 px-2 py-1 rounded-md  cursor-pointer transition-all duration-300">
          <MdOutlineVideoLabel
            onClick={() => setLabelModalOpen(true)}
            title="Print Batch Label"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal
          title="Edit Batch"
          onClose={() => setEditModalOpen(false)}
          isOpen={editModalOpen}
        >
          <EditBatchForm
            batch={batch}
            setRefetch={setRefetch}
            upid={upid}
            closeModal={() => setEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Label Modal */}
      {labelModalOpen && (
        <Modal
          title="Batch Label"
          onClose={() => setLabelModalOpen(false)}
          isOpen={labelModalOpen}
        >
          <BatchLabel
            inventory={inventory}
            batch={batch}
            closeModal={() => setLabelModalOpen(false)}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </div>
  );
};

export default InventoryActions;
