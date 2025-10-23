import React from "react";

interface CreateInvestmentFormProps {
  form: { [key: string]: any };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateInvestmentForm: React.FC<CreateInvestmentFormProps> = ({
  form,
  onChange,
  onSubmit,
}) => (
  <div className="w-full max-w-3xl mx-auto">
    <h2 className="text-2xl font-semibold mb-4">Create New Investment:</h2>
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="number"
          name="amount"
          placeholder="Investment Amount"
          value={form.amount || ""}
          onChange={onChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="entrepreneurProfileId"
          placeholder="Entrepreneur Profile ID"
          value={form.entrepreneurProfileId || ""}
          onChange={onChange}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Investment
        </button>
      </div>
    </form>
  </div>
);

export default CreateInvestmentForm;
