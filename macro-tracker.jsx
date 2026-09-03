const { useState, useEffect, useRef, useMemo } = React;

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const GOALS = { calories: 1900, protein: 178, carbs: 162, fat: 58, water: 5500 };

const SAVED_MEALS = [
  {
    id: "waking", name: "Upon Waking", time: "5:00–5:15 AM", emoji: "🌅",
    items: [
      { name: "Water + Sea Salt", calories: 20, protein: 5, carbs: 0, fat: 0, qty: 1, per: 1, unit: "serving" },
      { name: "Creatine Monohydrate (5g)", calories: 0, protein: 0, carbs: 0, fat: 0, qty: 1, per: 1, unit: "scoop" },
    ]
  },
  {
    id: "preworkout", name: "Pre-Workout", time: "5:45 AM", emoji: "💪",
    items: [
      { name: "ATP Beef Protein (1 scoop)", calories: 130, protein: 25, carbs: 5, fat: 2, qty: 1, per: 1, unit: "scoop" },
      { name: "Banana (medium)", calories: 100, protein: 1, carbs: 27, fat: 0, qty: 1, per: 1, unit: "medium" },
    ]
  },
  {
    id: "meal1", name: "Meal 1 — Post Training", time: "9:00–9:30 AM", emoji: "🍗",
    items: [
      { name: "Chicken Breast (cooked)", calories: 248, protein: 46, carbs: 0, fat: 5, qty: 150, per: 150, unit: "g" },
      { name: "Basmati Rice (cooked)", calories: 190, protein: 4, carbs: 42, fat: 0, qty: 145, per: 145, unit: "g" },
      { name: "Sweet Potato (cooked)", calories: 172, protein: 4, carbs: 40, fat: 0, qty: 200, per: 200, unit: "g", included: false },
      { name: "Green Beans", calories: 35, protein: 2, carbs: 8, fat: 0, qty: 100, per: 100, unit: "g" },
      { name: "Olive Oil", calories: 119, protein: 0, carbs: 0, fat: 13, qty: 1, per: 1, unit: "tbsp" },
    ]
  },
  {
    id: "meal2", name: "Meal 2 — Midday", time: "12:30–1:00 PM", emoji: "🥤",
    items: [
      { name: "ATP Beef Protein (1 scoop)", calories: 130, protein: 25, carbs: 5, fat: 2, qty: 1, per: 1, unit: "scoop" },
      { name: "Frozen Strawberries", calories: 32, protein: 1, carbs: 8, fat: 0, qty: 100, per: 100, unit: "g" },
    ]
  },
  {
    id: "meal3", name: "Meal 3", time: "3:30–4:00 PM", emoji: "🥩",
    items: [
      { name: "Chicken Breast (cooked)", calories: 165, protein: 31, carbs: 0, fat: 4, qty: 100, per: 100, unit: "g" },
      { name: "Basmati Rice (cooked)", calories: 130, protein: 3, carbs: 28, fat: 0, qty: 100, per: 100, unit: "g" },
      { name: "Sweet Potato (cooked)", calories: 120, protein: 3, carbs: 28, fat: 0, qty: 140, per: 140, unit: "g", included: false },
      { name: "Bell Peppers", calories: 25, protein: 1, carbs: 6, fat: 0, qty: 80, per: 80, unit: "g" },
    ]
  },
  {
    id: "snack", name: "Snack", time: "5:00–5:30 PM", emoji: "🍎",
    items: [
      { name: "Rice Cakes", calories: 70, protein: 1, carbs: 16, fat: 0, qty: 2, per: 2, unit: "cakes" },
      { name: "Kirkland Mixed Nut Butter", calories: 90, protein: 3, carbs: 4, fat: 8, qty: 1, per: 1, unit: "tbsp" },
    ]
  },
  {
    id: "dinner", name: "Meal 4 — Dinner", time: "6:30–7:00 PM", emoji: "🐟",
    items: [
      { name: "Salmon (wild, cooked)", calories: 220, protein: 34, carbs: 0, fat: 10, qty: 150, per: 150, unit: "g" },
      { name: "Sweet Potato (cooked)", calories: 172, protein: 3, carbs: 40, fat: 0, qty: 200, per: 200, unit: "g" },
      { name: "Bok Choy (cooked)", calories: 20, protein: 2, carbs: 3, fat: 0, qty: 100, per: 100, unit: "g" },
    ]
  },
];

const FOOD_DB = [
  // POULTRY
  { name: "Chicken Breast (cooked)", calories: 165, protein: 31, carbs: 0, fat: 4, per: 100, unit: "g", category: "Poultry" },
  { name: "Chicken Thigh (cooked, no skin)", calories: 209, protein: 26, carbs: 0, fat: 11, per: 100, unit: "g", category: "Poultry" },
  { name: "Chicken Wings (cooked)", calories: 266, protein: 27, carbs: 0, fat: 17, per: 100, unit: "g", category: "Poultry" },
  { name: "Ground Chicken 97% Lean (cooked)", calories: 148, protein: 29, carbs: 0, fat: 3, per: 100, unit: "g", category: "Poultry" },
  { name: "Ground Chicken 85% Lean (cooked)", calories: 185, protein: 25, carbs: 0, fat: 9, per: 100, unit: "g", category: "Poultry" },
  { name: "Chicken Drumstick (cooked, no skin)", calories: 172, protein: 28, carbs: 0, fat: 6, per: 100, unit: "g", category: "Poultry" },
  { name: "Rotisserie Chicken (breast)", calories: 167, protein: 30, carbs: 1, fat: 4, per: 100, unit: "g", category: "Poultry" },
  { name: "Turkey Breast (roasted)", calories: 135, protein: 30, carbs: 0, fat: 1, per: 100, unit: "g", category: "Poultry" },
  { name: "Turkey Thigh (roasted, no skin)", calories: 194, protein: 27, carbs: 0, fat: 9, per: 100, unit: "g", category: "Poultry" },
  { name: "Ground Turkey 93% Lean (cooked)", calories: 170, protein: 22, carbs: 0, fat: 9, per: 100, unit: "g", category: "Poultry" },
  { name: "Whole Egg (large)", calories: 72, protein: 6, carbs: 0, fat: 5, per: 1, unit: "egg", category: "Eggs" },
  { name: "Egg Whites (large)", calories: 17, protein: 4, carbs: 0, fat: 0, per: 1, unit: "white", category: "Eggs" },
  { name: "Egg Whites (liquid, 100g)", calories: 52, protein: 11, carbs: 1, fat: 0, per: 100, unit: "g", category: "Eggs" },
  // FISH
  { name: "Salmon Atlantic Farmed (cooked)", calories: 206, protein: 28, carbs: 0, fat: 10, per: 100, unit: "g", category: "Fish" },
  { name: "Salmon Wild Caught (cooked)", calories: 182, protein: 25, carbs: 0, fat: 8, per: 100, unit: "g", category: "Fish" },
  { name: "Tilapia (cooked)", calories: 128, protein: 26, carbs: 0, fat: 3, per: 100, unit: "g", category: "Fish" },
  { name: "Cod (cooked)", calories: 105, protein: 23, carbs: 0, fat: 1, per: 100, unit: "g", category: "Fish" },
  { name: "Halibut (cooked)", calories: 140, protein: 27, carbs: 0, fat: 3, per: 100, unit: "g", category: "Fish" },
  { name: "Mahi-Mahi (cooked)", calories: 109, protein: 24, carbs: 0, fat: 1, per: 100, unit: "g", category: "Fish" },
  { name: "Tuna Canned in Water", calories: 116, protein: 25, carbs: 0, fat: 1, per: 100, unit: "g", category: "Fish" },
  { name: "Tuna Canned in Olive Oil", calories: 198, protein: 29, carbs: 0, fat: 9, per: 100, unit: "g", category: "Fish" },
  { name: "Sardines in Water (drained)", calories: 131, protein: 22, carbs: 0, fat: 5, per: 100, unit: "g", category: "Fish" },
  { name: "Sardines in Olive Oil (drained)", calories: 208, protein: 24, carbs: 0, fat: 12, per: 100, unit: "g", category: "Fish" },
  { name: "Shrimp (cooked)", calories: 99, protein: 24, carbs: 0, fat: 1, per: 100, unit: "g", category: "Fish" },
  { name: "Sea Bass (cooked)", calories: 124, protein: 24, carbs: 0, fat: 3, per: 100, unit: "g", category: "Fish" },
  // PORK
  { name: "Lean Pork Chop (trimmed, cooked)", calories: 187, protein: 26, carbs: 0, fat: 9, per: 100, unit: "g", category: "Pork" },
  { name: "Pork Tenderloin (cooked)", calories: 166, protein: 26, carbs: 0, fat: 5, per: 100, unit: "g", category: "Pork" },
  // BEEF
  { name: "Sirloin Steak (grilled, lean)", calories: 201, protein: 29, carbs: 0, fat: 8, per: 100, unit: "g", category: "Beef" },
  { name: "Flank Steak (grilled)", calories: 192, protein: 28, carbs: 0, fat: 8, per: 100, unit: "g", category: "Beef" },
  { name: "Lean Ground Beef 93/7 (cooked)", calories: 152, protein: 21, carbs: 0, fat: 7, per: 100, unit: "g", category: "Beef" },
  { name: "Bison, Ground (cooked)", calories: 152, protein: 24, carbs: 0, fat: 6, per: 100, unit: "g", category: "Beef" },
  { name: "Duck Breast (roasted, no skin)", calories: 201, protein: 23, carbs: 0, fat: 11, per: 100, unit: "g", category: "Poultry" },
  { name: "Scallops (steamed)", calories: 111, protein: 21, carbs: 5, fat: 1, per: 100, unit: "g", category: "Fish" },
  // LEGUMES
  { name: "Black Beans (cooked)", calories: 132, protein: 9, carbs: 24, fat: 0, per: 100, unit: "g", category: "Legumes" },
  { name: "Lentils (cooked)", calories: 116, protein: 9, carbs: 20, fat: 0, per: 100, unit: "g", category: "Legumes" },
  // CARBS
  { name: "Basmati Rice (cooked)", calories: 130, protein: 3, carbs: 28, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "White Rice (cooked)", calories: 130, protein: 3, carbs: 28, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Brown Rice (cooked)", calories: 112, protein: 2, carbs: 23, fat: 1, per: 100, unit: "g", category: "Carbs" },
  { name: "Sweet Potato (cooked)", calories: 86, protein: 2, carbs: 20, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Baby Potatoes (cooked)", calories: 77, protein: 2, carbs: 17, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Quinoa (cooked)", calories: 120, protein: 4, carbs: 21, fat: 2, per: 100, unit: "g", category: "Carbs" },
  { name: "Oats (dry)", calories: 389, protein: 17, carbs: 66, fat: 7, per: 100, unit: "g", category: "Carbs" },
  { name: "Jasmine Rice (cooked)", calories: 130, protein: 3, carbs: 28, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Buckwheat (cooked)", calories: 92, protein: 3, carbs: 20, fat: 1, per: 100, unit: "g", category: "Carbs" },
  { name: "Butternut Squash (cooked)", calories: 40, protein: 1, carbs: 10, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Corn Kernels (cooked)", calories: 96, protein: 3, carbs: 21, fat: 1, per: 100, unit: "g", category: "Carbs" },
  { name: "Parsnips (cooked)", calories: 71, protein: 1, carbs: 17, fat: 0, per: 100, unit: "g", category: "Carbs" },
  { name: "Rice Cakes (plain)", calories: 35, protein: 1, carbs: 8, fat: 0, per: 1, unit: "cake", category: "Carbs" },
  { name: "Banana (medium)", calories: 100, protein: 1, carbs: 27, fat: 0, per: 1, unit: "medium", category: "Fruit" },
  { name: "Apple (medium)", calories: 95, protein: 0, carbs: 25, fat: 0, per: 1, unit: "medium", category: "Fruit" },
  { name: "Frozen Strawberries", calories: 32, protein: 1, carbs: 8, fat: 0, per: 100, unit: "g", category: "Fruit" },
  { name: "Blueberries", calories: 57, protein: 1, carbs: 14, fat: 0, per: 100, unit: "g", category: "Fruit" },
  { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, per: 100, unit: "g", category: "Fats" },
  // VEGETABLES
  { name: "Green Beans (cooked)", calories: 35, protein: 2, carbs: 8, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Bell Peppers (raw)", calories: 31, protein: 1, carbs: 6, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Bok Choy (cooked)", calories: 13, protein: 2, carbs: 2, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Broccoli (cooked)", calories: 35, protein: 2, carbs: 7, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Brussels Sprouts (cooked)", calories: 36, protein: 3, carbs: 7, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Asparagus (cooked)", calories: 22, protein: 2, carbs: 4, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Cauliflower (cooked)", calories: 23, protein: 2, carbs: 5, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Cucumber (raw)", calories: 16, protein: 1, carbs: 4, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Celery (raw)", calories: 16, protein: 1, carbs: 3, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Snap Peas (raw)", calories: 42, protein: 3, carbs: 7, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Spinach (cooked)", calories: 23, protein: 3, carbs: 4, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Kale (cooked)", calories: 28, protein: 2, carbs: 6, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Swiss Chard (cooked)", calories: 20, protein: 2, carbs: 4, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Carrots (cooked)", calories: 35, protein: 1, carbs: 8, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Eggplant (cooked)", calories: 35, protein: 1, carbs: 8, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Red Cabbage (cooked)", calories: 28, protein: 1, carbs: 7, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Okra (cooked)", calories: 33, protein: 2, carbs: 7, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  { name: "Tomato (raw)", calories: 18, protein: 1, carbs: 4, fat: 0, per: 100, unit: "g", category: "Vegetables" },
  // FATS & EXTRAS
  { name: "Olive Oil", calories: 119, protein: 0, carbs: 0, fat: 13, per: 1, unit: "tbsp", category: "Fats" },
  { name: "Avocado Oil", calories: 120, protein: 0, carbs: 0, fat: 14, per: 1, unit: "tbsp", category: "Fats" },
  { name: "Kirkland Mixed Nut Butter", calories: 190, protein: 6, carbs: 7, fat: 16, per: 2, unit: "tbsp", category: "Fats" },
  { name: "Tahini", calories: 89, protein: 3, carbs: 3, fat: 8, per: 1, unit: "tbsp", category: "Fats" },
  { name: "Walnuts", calories: 185, protein: 4, carbs: 4, fat: 18, per: 30, unit: "g", category: "Fats" },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, per: 30, unit: "g", category: "Fats" },
  { name: "Pumpkin Seeds (pepitas)", calories: 151, protein: 7, carbs: 5, fat: 13, per: 30, unit: "g", category: "Fats" },
  // SHAKES
  { name: "ATP Beef Protein (1 scoop)", calories: 130, protein: 25, carbs: 5, fat: 2, per: 1, unit: "scoop", category: "Shakes" },
  { name: "Water + Sea Salt + Creatine", calories: 20, protein: 5, carbs: 0, fat: 0, per: 1, unit: "serving", category: "Extras" },
  // CONDIMENTS
  { name: "Mustard", calories: 3, protein: 0, carbs: 0, fat: 0, per: 1, unit: "tsp", category: "Condiments" },
  { name: "Hot Sauce", calories: 1, protein: 0, carbs: 0, fat: 0, per: 1, unit: "tsp", category: "Condiments" },
  { name: "Salsa", calories: 10, protein: 0, carbs: 2, fat: 0, per: 2, unit: "tbsp", category: "Condiments" },
  { name: "Coconut Aminos (gluten-free soy sauce alt)", calories: 10, protein: 0, carbs: 2, fat: 0, per: 1, unit: "tbsp", category: "Condiments" },
  { name: "Balsamic Vinegar", calories: 14, protein: 0, carbs: 3, fat: 0, per: 1, unit: "tbsp", category: "Condiments" },
  { name: "Lemon Juice", calories: 3, protein: 0, carbs: 1, fat: 0, per: 1, unit: "tbsp", category: "Condiments" },
];

// ── UTILS ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const fmt = (n) => Math.round(n || 0);
const calcCals = (p, c, f) => fmt(p * 4 + c * 4 + f * 9);
const pct = (v, g) => Math.min(100, Math.round((v / g) * 100));

function getMacros(items) {
  return items.reduce((acc, item) => {
    const ratio = item.qty / (item.per || 1);
    acc.calories += (item.calories || 0) * ratio;
    acc.protein += (item.protein || 0) * ratio;
    acc.carbs += (item.carbs || 0) * ratio;
    acc.fat += (item.fat || 0) * ratio;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

// ── STORAGE ──────────────────────────────────────────────────────────────────
function useStorage() {
  const [data, setData] = useState({});
  const [goals, setGoals] = useState(GOALS);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("macro-log");
        if (r) setData(JSON.parse(r.value));
      } catch {}
      try {
        const r = await window.storage.get("macro-goals");
        if (r) setGoals(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const saveDay = async (date, dayData) => {
    const next = { ...data, [date]: dayData };
    setData(next);
    try { await window.storage.set("macro-log", JSON.stringify(next)); } catch {}
  };

  const saveGoals = async (g) => {
    setGoals(g);
    try { await window.storage.set("macro-goals", JSON.stringify(g)); } catch {}
  };

  return { data, goals, saveDay, saveGoals };
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────
function MacroBar({ label, value, goal, color, unit = "g" }) {
  const p = pct(value, goal);
  const over = value > goal;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: over ? "#e05252" : "#e8edf5" }}>
          {fmt(value)}<span style={{ color: "#4a5568", fontWeight: 400 }}>/{goal}{unit}</span>
        </span>
      </div>
      <div style={{ height: 8, background: "#1e2535", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: `${p}%`,
          background: over ? "#e05252" : color,
          transition: "width 0.4s ease"
        }} />
      </div>
    </div>
  );
}

function SearchFood({ onAdd, onClose }) {
  const [query, setQuery] = useState("");
  const [qty, setQty] = useState("");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const preview = useMemo(() => {
    if (!selected || !qty) return null;
    const ratio = parseFloat(qty) / (selected.per || 1);
    return {
      calories: fmt(selected.calories * ratio),
      protein: fmt(selected.protein * ratio),
      carbs: fmt(selected.carbs * ratio),
      fat: fmt(selected.fat * ratio),
    };
  }, [selected, qty]);

  const handleAdd = () => {
    if (!selected || !qty) return;
    onAdd({ ...selected, qty: parseFloat(qty), calories: selected.calories, protein: selected.protein, carbs: selected.carbs, fat: selected.fat });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#141b2d", border: "1px solid #2a3550", borderRadius: 16, padding: 28, width: 520, maxWidth: "95vw", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: "#e8edf5", fontSize: 18, fontWeight: 700 }}>Add Food</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Search food... (e.g. chicken, salmon, rice)"
          style={{ width: "100%", padding: "12px 16px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 10, color: "#e8edf5", fontSize: 14, marginBottom: 8, boxSizing: "border-box", outline: "none" }}
        />
        {results.length > 0 && !selected && (
          <div style={{ background: "#1a2236", border: "1px solid #2a3550", borderRadius: 10, overflow: "hidden", marginBottom: 16, maxHeight: 280, overflowY: "auto" }}>
            {results.map((f, i) => (
              <div key={i} onClick={() => { setSelected(f); setQty(String(f.per)); }}
                style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.background = "#232d45"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <div style={{ color: "#e8edf5", fontSize: 14, fontWeight: 500 }}>{f.name}</div>
                  <div style={{ color: "#4a5568", fontSize: 12 }}>{f.category} · per {f.per}{f.unit}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "#6b7a99" }}>
                  <div style={{ color: "#5b9bd5" }}>{f.protein}g P</div>
                  <div>{f.calories} kcal</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected && (
          <div style={{ background: "#1a2236", border: "1px solid #2a3550", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ color: "#e8edf5", fontWeight: 600 }}>{selected.name}</div>
              <button onClick={() => { setSelected(null); setQuery(""); }} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 13 }}>Change</button>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#4a5568", fontSize: 12, marginBottom: 4 }}>Amount ({selected.unit})</div>
                <input
                  type="number" value={qty} onChange={e => setQty(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", background: "#141b2d", border: "1px solid #2a3550", borderRadius: 8, color: "#e8edf5", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                />
              </div>
              {preview && (
                <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                  {[["Cal", preview.calories, "#f0c040"], ["P", preview.protein + "g", "#5b9bd5"], ["C", preview.carbs + "g", "#52c07a"], ["F", preview.fat + "g", "#e08c52"]].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div style={{ color: c, fontWeight: 700 }}>{v}</div>
                      <div style={{ color: "#4a5568", fontSize: 11 }}>{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <button onClick={handleAdd} disabled={!selected || !qty}
          style={{ width: "100%", padding: "13px", background: selected && qty ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#1e2535", color: selected && qty ? "#fff" : "#4a5568", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: selected && qty ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
          Add to Log
        </button>
      </div>
    </div>
  );
}

function MealCard({ meal, entries, onAddSavedMeal, onAddCustom, onRemoveEntry, onEditEntry }) {
  const [expanded, setExpanded] = useState(true);
  const allEntries = entries || [];
  const macros = getMacros(allEntries);

  return (
    <div style={{ background: "#141b2d", border: "1px solid #1e2535", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{meal.emoji}</span>
          <div>
            <div style={{ color: "#e8edf5", fontWeight: 700, fontSize: 15 }}>{meal.name}</div>
            <div style={{ color: "#4a5568", fontSize: 12 }}>{meal.time}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {allEntries.length > 0 && (
            <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
              {[["kcal", fmt(macros.calories), "#f0c040"], ["P", fmt(macros.protein) + "g", "#5b9bd5"], ["C", fmt(macros.carbs) + "g", "#52c07a"], ["F", fmt(macros.fat) + "g", "#e08c52"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ color: c, fontWeight: 700, fontSize: 13 }}>{v}</div>
                  <div style={{ color: "#4a5568", fontSize: 10 }}>{l}</div>
                </div>
              ))}
            </div>
          )}
          <span style={{ color: "#4a5568", fontSize: 18 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #1e2535" }}>
          {allEntries.length > 0 && (
            <div style={{ padding: "0 18px" }}>
              {allEntries.map((entry, i) => {
                const ratio = entry.qty / (entry.per || 1);
                const entryMacros = {
                  calories: fmt((entry.calories || 0) * ratio),
                  protein: fmt((entry.protein || 0) * ratio),
                  carbs: fmt((entry.carbs || 0) * ratio),
                  fat: fmt((entry.fat || 0) * ratio),
                };
                return (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #1a2236", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#c8d0e0", fontSize: 14 }}>{entry.name}</div>
                      <div style={{ color: "#4a5568", fontSize: 12 }}>{entry.qty}{entry.unit}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12 }}>
                      <span style={{ color: "#f0c040" }}>{entryMacros.calories}</span>
                      <span style={{ color: "#5b9bd5" }}>{entryMacros.protein}g P</span>
                      <span style={{ color: "#52c07a" }}>{entryMacros.carbs}g C</span>
                      <span style={{ color: "#e08c52" }}>{entryMacros.fat}g F</span>
                      <button onClick={() => onEditEntry(meal.id, i)} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 13, padding: "2px 6px" }}>✏️</button>
                      <button onClick={() => onRemoveEntry(meal.id, i)} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 13, padding: "2px 6px" }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ padding: "12px 18px", display: "flex", gap: 10 }}>
            <button onClick={() => onAddSavedMeal(meal)} style={{ flex: 1, padding: "9px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 8, color: "#8892a4", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              + Add Saved Items
            </button>
            <button onClick={() => onAddCustom(meal.id)} style={{ flex: 1, padding: "9px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 8, color: "#8892a4", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              + Search Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SavedMealModal({ meal, onConfirm, onClose }) {
  const [items, setItems] = useState(meal.items.map(item => ({ ...item, included: item.included === false ? false : true })));

  const toggleItem = (i) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, included: !item.included } : item));
  const updateQty = (i, val) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, qty: parseFloat(val) || 0 } : item));

  const preview = getMacros(items.filter(i => i.included));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#141b2d", border: "1px solid #2a3550", borderRadius: 16, padding: 28, width: 540, maxWidth: "95vw", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: "#e8edf5", fontSize: 18 }}>{meal.emoji} {meal.name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ color: "#4a5568", fontSize: 13, marginBottom: 16 }}>Toggle items on/off, adjust quantities before logging.</div>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #1a2236", display: "flex", alignItems: "center", gap: 12, opacity: item.included ? 1 : 0.4 }}>
            <div onClick={() => toggleItem(i)} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${item.included ? "#2563eb" : "#2a3550"}`, background: item.included ? "#2563eb" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.included && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#c8d0e0", fontSize: 14 }}>{item.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="number" value={item.qty} onChange={e => updateQty(i, e.target.value)}
                style={{ width: 70, padding: "6px 8px", background: "#1a2236", border: "1px solid #2a3550", borderRadius: 6, color: "#e8edf5", fontSize: 13, outline: "none", textAlign: "center" }} />
              <span style={{ color: "#4a5568", fontSize: 12 }}>{item.unit}</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: 14, background: "#1a2236", borderRadius: 10, display: "flex", justifyContent: "space-around" }}>
          {[["Calories", fmt(preview.calories), "#f0c040"], ["Protein", fmt(preview.protein) + "g", "#5b9bd5"], ["Carbs", fmt(preview.carbs) + "g", "#52c07a"], ["Fat", fmt(preview.fat) + "g", "#e08c52"]].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: c, fontWeight: 700, fontSize: 18 }}>{v}</div>
              <div style={{ color: "#4a5568", fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onConfirm(items.filter(i => i.included))}
          style={{ width: "100%", marginTop: 16, padding: "13px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Log This Meal
        </button>
      </div>
    </div>
  );
}

function EditEntryModal({ entry, onSave, onClose }) {
  const [qty, setQty] = useState(String(entry.qty));
  const preview = useMemo(() => {
    const ratio = parseFloat(qty) / (entry.per || 1);
    return { calories: fmt(entry.calories * ratio), protein: fmt(entry.protein * ratio), carbs: fmt(entry.carbs * ratio), fat: fmt(entry.fat * ratio) };
  }, [qty, entry]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#141b2d", border: "1px solid #2a3550", borderRadius: 16, padding: 28, width: 400, maxWidth: "95vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: "#e8edf5", fontSize: 18 }}>Edit Entry</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ color: "#c8d0e0", marginBottom: 16, fontWeight: 600 }}>{entry.name}</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#4a5568", fontSize: 12, marginBottom: 6 }}>Amount ({entry.unit})</div>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#1a2236", border: "1px solid #2a3550", borderRadius: 8, color: "#e8edf5", fontSize: 15, boxSizing: "border-box", outline: "none" }} />
        </div>
        <div style={{ padding: 14, background: "#1a2236", borderRadius: 10, display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
          {[["Cal", preview.calories, "#f0c040"], ["P", preview.protein + "g", "#5b9bd5"], ["C", preview.carbs + "g", "#52c07a"], ["F", preview.fat + "g", "#e08c52"]].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: c, fontWeight: 700 }}>{v}</div>
              <div style={{ color: "#4a5568", fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onSave(parseFloat(qty))}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function WeeklyView({ data, goals }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div style={{ color: "#8892a4", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Last 7 Days</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 20 }}>
        {days.map(date => {
          const dayData = data[date];
          const allEntries = dayData ? Object.values(dayData.meals || {}).flat() : [];
          const macros = getMacros(allEntries);
          const p = pct(macros.calories, goals.calories);
          const isToday = date === today();
          return (
            <div key={date} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: isToday ? "#5b9bd5" : "#4a5568", marginBottom: 4, fontWeight: isToday ? 700 : 400 }}>
                {dayLabels[new Date(date + "T12:00:00").getDay()]}
              </div>
              <div style={{ height: 60, background: "#1e2535", borderRadius: 6, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <div style={{ width: "100%", height: `${p}%`, background: p > 100 ? "#e05252" : p > 80 ? "#52c07a" : "#2563eb", transition: "height 0.3s ease", minHeight: allEntries.length > 0 ? 4 : 0 }} />
              </div>
              <div style={{ fontSize: 11, color: "#4a5568", marginTop: 4 }}>{allEntries.length > 0 ? fmt(macros.calories) : "—"}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {["calories", "protein", "carbs", "fat"].map(macro => {
          const vals = days.map(date => {
            const dayData = data[date];
            const allEntries = dayData ? Object.values(dayData.meals || {}).flat() : [];
            return getMacros(allEntries)[macro];
          }).filter(v => v > 0);
          const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
          const colors = { calories: "#f0c040", protein: "#5b9bd5", carbs: "#52c07a", fat: "#e08c52" };
          const labels = { calories: "kcal", protein: "g protein", carbs: "g carbs", fat: "g fat" };
          return (
            <div key={macro} style={{ background: "#1a2236", borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ color: colors[macro], fontWeight: 700, fontSize: 22 }}>{fmt(avg)}</div>
              <div style={{ color: "#4a5568", fontSize: 11 }}>{labels[macro]}</div>
              <div style={{ color: "#4a5568", fontSize: 10, marginTop: 2 }}>avg/day</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
function MacroTracker() {
  const { data, goals, saveDay, saveGoals } = useStorage();
  const [currentDate, setCurrentDate] = useState(today());
  const [view, setView] = useState("day"); // day | week | goals
  const [searchModal, setSearchModal] = useState(null); // mealId or null
  const [savedMealModal, setSavedMealModal] = useState(null);
  const [editModal, setEditModal] = useState(null); // {mealId, entryIndex}

  const dayData = data[currentDate] || { meals: {}, water: 0 };

  const allEntries = useMemo(() =>
    Object.values(dayData.meals || {}).flat(), [dayData]);

  const totals = useMemo(() => getMacros(allEntries), [allEntries]);

  const updateDay = (updated) => saveDay(currentDate, { ...dayData, ...updated });

  const addEntriesToMeal = (mealId, newItems) => {
    const existing = dayData.meals?.[mealId] || [];
    updateDay({ meals: { ...dayData.meals, [mealId]: [...existing, ...newItems] } });
  };

  const removeEntry = (mealId, index) => {
    const existing = [...(dayData.meals?.[mealId] || [])];
    existing.splice(index, 1);
    updateDay({ meals: { ...dayData.meals, [mealId]: existing } });
  };

  const editEntry = (mealId, index, newQty) => {
    const existing = [...(dayData.meals?.[mealId] || [])];
    existing[index] = { ...existing[index], qty: newQty };
    updateDay({ meals: { ...dayData.meals, [mealId]: existing } });
  };

  const navDate = (dir) => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() + dir);
    setCurrentDate(d.toISOString().split("T")[0]);
  };

  const displayDate = () => {
    const d = new Date(currentDate + "T12:00:00");
    if (currentDate === today()) return "Today";
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (currentDate === yesterday.toISOString().split("T")[0]) return "Yesterday";
    return d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
  };

  const waterPct = Math.min(100, Math.round(((dayData.water || 0) / goals.water) * 100));

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e8edf5" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f1729 0%, #141b2d 100%)", borderBottom: "1px solid #1e2535", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#e8edf5", letterSpacing: -0.5 }}>MACRO TRACKER</div>
          <div style={{ fontSize: 11, color: "#4a5568", fontWeight: 500, letterSpacing: 1 }}>KORRY PICCO · 45-DAY RESET</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["day", "Today"], ["week", "Week"], ["goals", "Goals"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: view === v ? "#2563eb" : "#1e2535", color: view === v ? "#fff" : "#8892a4", transition: "all 0.2s" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

        {/* DAY VIEW */}
        {view === "day" && (
          <>
            {/* Date Nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <button onClick={() => navDate(-1)} style={{ background: "#1e2535", border: "none", color: "#8892a4", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 16 }}>‹</button>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#e8edf5" }}>{displayDate()}</div>
              <button onClick={() => navDate(1)} disabled={currentDate === today()}
                style={{ background: currentDate === today() ? "#0d1117" : "#1e2535", border: "none", color: currentDate === today() ? "#1e2535" : "#8892a4", borderRadius: 8, padding: "8px 16px", cursor: currentDate === today() ? "not-allowed" : "pointer", fontSize: 16 }}>›</button>
            </div>

            {/* DAILY SUMMARY CARD */}
            <div style={{ background: "linear-gradient(135deg, #141b2d, #0f1729)", border: "1px solid #1e2535", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: "#f0c040", lineHeight: 1 }}>{fmt(totals.calories)}</div>
                  <div style={{ fontSize: 13, color: "#4a5568" }}>of {goals.calories} kcal</div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[["Protein", totals.protein, goals.protein, "#5b9bd5"], ["Carbs", totals.carbs, goals.carbs, "#52c07a"], ["Fat", totals.fat, goals.fat, "#e08c52"]].map(([l, v, g, c]) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{fmt(v)}<span style={{ fontSize: 12, color: "#4a5568" }}>g</span></div>
                      <div style={{ fontSize: 11, color: "#4a5568" }}>{l}</div>
                      <div style={{ fontSize: 11, color: fmt(v) > g ? "#e05252" : "#4a5568" }}>{fmt(v) > g ? "over" : `${g - fmt(v)}g left`}</div>
                    </div>
                  ))}
                </div>
              </div>
              <MacroBar label="Calories" value={totals.calories} goal={goals.calories} color="#f0c040" unit=" kcal" />
              <MacroBar label="Protein" value={totals.protein} goal={goals.protein} color="#5b9bd5" />
              <MacroBar label="Carbs" value={totals.carbs} goal={goals.carbs} color="#52c07a" />
              <MacroBar label="Fat" value={totals.fat} goal={goals.fat} color="#e08c52" />
            </div>

            {/* WATER TRACKER */}
            <div style={{ background: "#141b2d", border: "1px solid #1e2535", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>💧</span>
                  <span style={{ fontWeight: 700, color: "#e8edf5" }}>Water</span>
                </div>
                <span style={{ color: waterPct >= 100 ? "#52c07a" : "#5b9bd5", fontWeight: 700 }}>{((dayData.water || 0) / 1000).toFixed(1)}L / 5.5L</span>
              </div>
              <div style={{ height: 8, background: "#1e2535", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: "100%", width: `${waterPct}%`, background: waterPct >= 100 ? "#52c07a" : "#5b9bd5", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[250, 500, 750, 1000].map(ml => (
                  <button key={ml} onClick={() => updateDay({ water: (dayData.water || 0) + ml })}
                    style={{ flex: 1, padding: "8px 4px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 8, color: "#8892a4", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                    +{ml}ml
                  </button>
                ))}
                <button onClick={() => updateDay({ water: Math.max(0, (dayData.water || 0) - 250) })}
                  style={{ padding: "8px 12px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 8, color: "#e05252", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  −
                </button>
              </div>
            </div>

            {/* MEAL CARDS */}
            {SAVED_MEALS.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                entries={dayData.meals?.[meal.id] || []}
                onAddSavedMeal={(m) => setSavedMealModal(m)}
                onAddCustom={(mealId) => setSearchModal(mealId)}
                onRemoveEntry={removeEntry}
                onEditEntry={(mealId, idx) => setEditModal({ mealId, idx })}
              />
            ))}
          </>
        )}

        {/* WEEK VIEW */}
        {view === "week" && <WeeklyView data={data} goals={goals} />}

        {/* GOALS VIEW */}
        {view === "goals" && (
          <div>
            <div style={{ color: "#8892a4", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Daily Targets</div>
            <div style={{ background: "#141b2d", border: "1px solid #1e2535", borderRadius: 14, padding: 20 }}>
              {[
                { key: "calories", label: "Calories", unit: "kcal", min: 1500, max: 3000 },
                { key: "protein", label: "Protein", unit: "g", min: 100, max: 300 },
                { key: "carbs", label: "Carbohydrates", unit: "g", min: 50, max: 400 },
                { key: "fat", label: "Fat", unit: "g", min: 20, max: 150 },
                { key: "water", label: "Water", unit: "ml", min: 1000, max: 8000 },
              ].map(({ key, label, unit, min, max }) => (
                <div key={key} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ color: "#c8d0e0", fontWeight: 600 }}>{label}</label>
                    <span style={{ color: "#5b9bd5", fontWeight: 700 }}>{goals[key]}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={key === "calories" ? 50 : key === "water" ? 100 : 5}
                    value={goals[key]}
                    onChange={e => saveGoals({ ...goals, [key]: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#2563eb" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginTop: 2 }}>
                    <span>{min}{unit}</span><span>{max}{unit}</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: 14, background: "#1a2236", borderRadius: 10, marginTop: 8 }}>
                <div style={{ color: "#4a5568", fontSize: 12, marginBottom: 8 }}>Protocol 6.0 Defaults</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["1,900 kcal", () => saveGoals({ ...goals, calories: 1900 })], ["178g P", () => saveGoals({ ...goals, protein: 178 })], ["162g C", () => saveGoals({ ...goals, carbs: 162 })], ["58g F", () => saveGoals({ ...goals, fat: 58 })], ["5,500ml 💧", () => saveGoals({ ...goals, water: 5500 })]].map(([l, fn]) => (
                    <button key={l} onClick={fn} style={{ padding: "6px 12px", background: "#1e2535", border: "1px solid #2a3550", borderRadius: 6, color: "#8892a4", fontSize: 12, cursor: "pointer" }}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {searchModal && (
        <SearchFood
          onAdd={(food) => addEntriesToMeal(searchModal, [food])}
          onClose={() => setSearchModal(null)}
        />
      )}
      {savedMealModal && (
        <SavedMealModal
          meal={savedMealModal}
          onConfirm={(items) => { addEntriesToMeal(savedMealModal.id, items); setSavedMealModal(null); }}
          onClose={() => setSavedMealModal(null)}
        />
      )}
      {editModal && (() => {
        const entry = dayData.meals?.[editModal.mealId]?.[editModal.idx];
        return entry ? (
          <EditEntryModal
            entry={entry}
            onSave={(qty) => { editEntry(editModal.mealId, editModal.idx, qty); setEditModal(null); }}
            onClose={() => setEditModal(null)}
          />
        ) : null;
      })()}
    </div>
  );
}
