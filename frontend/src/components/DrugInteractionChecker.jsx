import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const DrugInteractionChecker = ({ cartItems = [] }) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [showChecker, setShowChecker] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warningLevel, setWarningLevel] = useState("safe");

  const handleCheckInteractions = async () => {
    if (medicines.length < 2) {
      toast.warn("Enter at least 2 medicines to check interactions");
      return;
    }

    if (!token) {
      toast.info("Please login to check drug interactions");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/drug-interaction/check`,
        { medicines },
        { headers: { token } }
      );

      setInteractions(response.data.interactions || []);
      setWarningLevel(response.data.warningLevel);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error checking interactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, ""]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, value) => {
    const updated = [...medicines];
    updated[index] = value;
    setMedicines(updated);
  };

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
      <button
        onClick={() => setShowChecker(!showChecker)}
        className="w-full text-left font-bold text-blue-700 flex items-center gap-2 hover:text-blue-800"
      >
        <span>⚕️ Check Drug Interactions</span>
        <span className="ml-auto">{showChecker ? "▼" : "▶"}</span>
      </button>

      {showChecker && (
        <div className="mt-4 p-4 bg-white rounded-lg">
          {/* Medicines Input */}
          <div className="space-y-3 mb-4">
            {medicines.map((medicine, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={medicine}
                  onChange={(e) => handleMedicineChange(index, e.target.value)}
                  placeholder={`Medicine ${index + 1}`}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => handleRemoveMedicine(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddMedicine}
            className="w-full py-2 mb-4 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
          >
            + Add Medicine
          </button>

          <button
            onClick={handleCheckInteractions}
            disabled={loading || medicines.length < 2}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            {loading ? "Checking..." : "Check Interactions"}
          </button>

          {/* Results */}
          {interactions.length > 0 && (
            <div className={`mt-4 p-4 rounded-lg ${
              warningLevel === "severe" ? "bg-red-50 border-2 border-red-200" :
              warningLevel === "moderate" ? "bg-yellow-50 border-2 border-yellow-200" :
              "bg-green-50 border-2 border-green-200"
            }`}>
              <div className="font-bold mb-3 flex items-center gap-2">
                {warningLevel === "severe" && "⚠️ SEVERE INTERACTIONS FOUND"}
                {warningLevel === "moderate" && "⚡ MODERATE INTERACTIONS FOUND"}
                {warningLevel === "safe" && "✓ NO INTERACTIONS FOUND"}
              </div>

              <div className="space-y-3">
                {interactions.map((interaction, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      interaction.severity === "severe"
                        ? "bg-red-100 border-l-4 border-red-600"
                        : interaction.severity === "moderate"
                        ? "bg-yellow-100 border-l-4 border-yellow-600"
                        : "bg-green-100 border-l-4 border-green-600"
                    }`}
                  >
                    <div className="font-bold text-gray-800">
                      {interaction.medicine1} + {interaction.medicine2}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{interaction.description}</div>
                    <div className="text-sm font-bold text-gray-800 mt-2">
                      Recommendation: {interaction.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interactions.length === 0 && medicines.length >= 2 && !loading && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 font-bold">
              ✓ No interactions found - Safe to use together
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker;
