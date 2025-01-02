import React, { useState } from "react";
import { MdDelete, MdEdit, MdOutlineVideoLabel } from "react-icons/md";
import Modal from "../utils/Modal";
import EditBatchForm from "./EditBatchForm";
import BatchLabel from "./batchLabel";

const InventoryActions = ({ batch = {},  inventory = {}, upid = "", setRefetch = () => {} }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
        {batch.quantity === 0 && (
          <div className="bg-red-600 px-2 py-1 rounded-md hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed">
            <MdDelete
              disabled={!batch?.quantity == 0}
              onClick={() => setDeleteModalOpen(true)}
              title="Delete Batch"
            />
          </div>
        )}
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

      {/* Delete Modal */}
      {deleteModalOpen && (
        <Modal
          title="Delete Batch"
          onClose={() => setDeleteModalOpen(false)}
          isOpen={deleteModalOpen}
        >
          <p>Are you sure you want to delete this batch?</p>
          <div className="flex gap-2 my-4 font-normal">
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 cursor-pointer text-white transition-all suration-300"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-3 py-1 rounded-md text-red-500 border border-red-500 hover:bg-red-600/20 cursor-pointer transition-all suration-300"
            >
              Cancel
            </button>
          </div>
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
