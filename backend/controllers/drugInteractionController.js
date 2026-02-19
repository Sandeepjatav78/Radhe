import drugInteractionModel from "../models/drugInteractionModel.js";

// Add drug interaction
export const addDrugInteraction = async (req, res) => {
    try {
        const { drug1, drug2, severity, description, recommendation } = req.body;

        if (!drug1 || !drug2 || !severity || !description || !recommendation) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        // Normalize drug names (alphabetical order to avoid duplicates)
        const [normalized1, normalized2] = [drug1.toLowerCase(), drug2.toLowerCase()].sort();

        const interaction = new drugInteractionModel({
            drug1: normalized1,
            drug2: normalized2,
            severity,
            description,
            recommendation
        });

        await interaction.save();
        res.json({ success: true, message: "Drug interaction added", interaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check interactions between medicines
export const checkInteractions = async (req, res) => {
    try {
        const { medicines } = req.body;

        if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
            return res.status(400).json({ success: false, message: "At least 2 medicines required" });
        }

        const interactions = [];
        const normalizedMedicines = medicines.map(m => m.toLowerCase());

        // Check all pairs
        for (let i = 0; i < normalizedMedicines.length; i++) {
            for (let j = i + 1; j < normalizedMedicines.length; j++) {
                const [med1, med2] = [normalizedMedicines[i], normalizedMedicines[j]].sort();

                const interaction = await drugInteractionModel.findOne({
                    $or: [
                        { drug1: med1, drug2: med2 },
                        { drug1: med2, drug2: med1 }
                    ]
                });

                if (interaction) {
                    interactions.push({
                        medicine1: medicines[i],
                        medicine2: medicines[j],
                        severity: interaction.severity,
                        description: interaction.description,
                        recommendation: interaction.recommendation
                    });
                }
            }
        }

        const hasSevere = interactions.some(i => i.severity === "severe");
        const hasModerate = interactions.some(i => i.severity === "moderate");

        res.json({
            success: true,
            interactions,
            warningLevel: hasSevere ? "severe" : hasModerate ? "moderate" : "safe",
            message: interactions.length > 0 
                ? `Found ${interactions.length} interaction(s)`
                : "No interactions found"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all interactions (for admin)
export const getAllInteractions = async (req, res) => {
    try {
        const interactions = await drugInteractionModel.find().sort({ severity: -1 });
        res.json({ success: true, interactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
