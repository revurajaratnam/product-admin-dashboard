"use client";

import Modal from "../common/Modal";
import Button from "../common/Button";

export default function DeleteConfirmModal({ product, loading, onCancel, onConfirm }) {
  return (
    <Modal open={Boolean(product)} onClose={onCancel} title="Delete product">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <strong className="font-medium text-gray-900">{product?.title}</strong>? This
        cannot be undone.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
