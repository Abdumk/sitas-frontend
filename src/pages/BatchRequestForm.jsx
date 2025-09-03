import { useState } from "react";

export default function BatchRequestForm({ onSubmit }) {
  const [project, setProject] = useState("");
  const [materials, setMaterials] = useState([{ material: "", quantity: 0, purpose: "" }]);

  const handleChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const addRow = () => setMaterials([...materials, { material: "", quantity: 0, purpose: "" }]);
  const removeRow = (index) => setMaterials(materials.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ project, materials });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-bold mb-4">Create New Material Request</h2>

      <label className="block mb-2">Select Project</label>
      <input
        type="text"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="border p-2 rounded w-full mb-4"
        placeholder="Enter project name"
      />

      <h3 className="font-semibold mb-2">Materials</h3>
      {materials.map((row, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Material"
            value={row.material}
            onChange={(e) => handleChange(index, "material", e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Qty"
            value={row.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
            className="border p-2 rounded w-24"
          />
          <input
            type="text"
            placeholder="Purpose"
            value={row.purpose}
            onChange={(e) => handleChange(index, "purpose", e.target.value)}
            className="border p-2 rounded flex-1"
          />
          {materials.length > 1 && (
            <button type="button" onClick={() => removeRow(index)} className="text-red-500">✕</button>
          )}
        </div>
      ))}

      <button type="button" onClick={addRow} className="text-blue-500 mb-4">+ Add Material</button>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Request</button>
    </form>
  );
}
