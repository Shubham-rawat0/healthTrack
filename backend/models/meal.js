const MealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    food: { type: String, required: true },
    description: { type: String },
    calories: { type: Number },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    logs: [
      {
        date: { type: Date, default: Date.now },
        consumed: { type: Boolean, default: false }, 
        quantity: { type: Number, default: 0 }, 
      },
    ],
  },
  { timestamps: true }
);
