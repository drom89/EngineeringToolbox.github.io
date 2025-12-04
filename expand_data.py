import json
import re

# Load existing data
input_file = "js/chem_data_full.js"
output_file = "js/chem_data_full.js"
log_file = "expansion_log.txt"

print(f"Loading data from {input_file}...")
with open(input_file, "r", encoding="utf-8") as f:
    content = f.read()
    match = re.search(r"export const COMPATIBILITY_DATA = ({.*});", content, re.DOTALL)
    if match:
        data = json.loads(match.group(1))
    else:
        print("Error: Could not parse JS file.")
        exit(1)

new_data = {}
changes = []

def log_expansion(original, new_name, chem, rating, reason):
    msg = f"[{original} -> {new_name}] + {chem}: {rating} ({reason})"
    changes.append(msg)
    return rating

# --- SUBTYPE DEFINITIONS ---
# Map Generic Name -> List of Subtypes
subtypes = {
    "Steel": ["Carbon Steel", "Steel 1018", "Cast Iron"],
    "Stainless Steel 304": ["Stainless Steel 304", "Stainless Steel 304L"],
    "Stainless Steel 316": ["Stainless Steel 316", "Stainless Steel 316L", "Stainless Steel 904L"],
    "Aluminum": ["Aluminum 1100", "Aluminum 6061", "Aluminum 7075"],
    "Brass": ["Brass", "Naval Brass", "Admiralty Brass"],
    "Viton (FKM)": ["Viton A", "Viton B", "Viton GF", "Viton Extreme"],
    "Buna-N (Nitrile)": ["Nitrile (Buna-N)", "Hydrogenated Nitrile (HNBR)"],
    "EPDM": ["EPDM (Peroxide Cured)", "EPDM (Sulfur Cured)"],
    "PVC": ["PVC Type 1", "PVC Type 2", "CPVC"],
    "PP (Polypropylene)": ["Polypropylene (Homopolymer)", "Polypropylene (Copolymer)"],
    "PE (Polyethylene)": ["LDPE", "HDPE", "UHMWPE", "XLPE"],
    "PTFE (Teflon)": ["PTFE (Virgin)", "PTFE (Glass Filled)", "PTFE (Carbon Filled)"],
    "Nylon": ["Nylon 6", "Nylon 6/6", "Nylon 11", "Nylon 12"],
    "PVDF (Kynar)": ["PVDF (Homopolymer)", "PVDF (Copolymer)"],
    "Acetal (Delrin)": ["Acetal (Homopolymer)", "Acetal (Copolymer)"],
    "PEEK": ["PEEK (Virgin)", "PEEK (Glass Filled)", "PEEK (Carbon Filled)"],
    "Silicone": ["Silicone (General Purpose)", "Silicone (Fluorosilicone)", "Silicone (Platinum Cured)"],
    "Neoprene": ["Neoprene"], # Keep as is or expand if needed
    "Hypalon": ["Hypalon (CSM)"],
    "Kalrez": ["Kalrez 4079", "Kalrez 6375", "Kalrez 7075"],
    "Chemraz": ["Chemraz 505", "Chemraz 510"],
    "Titanium": ["Titanium Grade 2", "Titanium Grade 5"],
    "Hastelloy": ["Hastelloy C-276", "Hastelloy B-3", "Hastelloy C-22"],
    "Monel": ["Monel 400", "Monel K-500"],
    "Inconel": ["Inconel 600", "Inconel 625", "Inconel 718"],
    "Bronze": ["Bronze", "Aluminum Bronze", "Phosphor Bronze"],
    "Copper": ["Copper"],
    "Tantalum": ["Tantalum"],
    "Zirconium": ["Zirconium"],
    "Nickel": ["Nickel 200", "Nickel 201"],
    "Natural Rubber": ["Natural Rubber (Gum)", "Natural Rubber (Black)"],
    "Polyurethane Rubber": ["Polyurethane (Ether Based)", "Polyurethane (Ester Based)"],
    "ABS": ["ABS"],
    "Polycarbonate": ["Polycarbonate"],
    "Acrylic": ["Acrylic"],
    "PET": ["PET"],
    "PU (Polyurethane)": ["Polyurethane (Ether)", "Polyurethane (Ester)"], # Duplicate handling
    "Glass": ["Borosilicate Glass", "Soda Lime Glass"],
    "Ceramic": ["Alumina 99.5%", "Zirconia"],
    "Graphite": ["Graphite"],
    "Concrete": ["Concrete"],
    "Wood": ["Wood"],
    "Epoxy": ["Epoxy"],
    "Fiberglass": ["Fiberglass (Polyester Resin)", "Fiberglass (Vinyl Ester Resin)", "Fiberglass (Epoxy Resin)"]
}

# --- SPECIFIC RULES ---

def apply_specific_rules(mat_name, chem, base_rating):
    rating = base_rating
    chem_l = chem.lower()
    
    # --- STAINLESS STEEL ---
    if "Stainless Steel 316" in mat_name:
        if "chloride" in chem_l or "sea" in chem_l or "brine" in chem_l:
            if base_rating != "A":
                rating = "A" # 316 better for chlorides
    
    if "Stainless Steel 904L" in mat_name:
        if "sulfuric" in chem_l or "phosphoric" in chem_l:
             rating = "A" # 904L designed for sulfuric acid

    # --- FKM (VITON) ---
    if "Viton GF" in mat_name or "Viton Extreme" in mat_name:
        if "methanol" in chem_l or "ethanol" in chem_l:
            rating = "A" # GF/Extreme better with alcohols than A/B
    
    # --- NITRILE ---
    if "HNBR" in mat_name:
        if "oil" in chem_l and "hot" in chem_l: # Hypothetical context
             rating = "A" # HNBR better heat/oil resistance
        if "sour gas" in chem_l or "h2s" in chem_l:
             rating = "A"

    # --- EPDM ---
    if "Peroxide Cured" in mat_name:
        if "steam" in chem_l or "hot water" in chem_l:
            rating = "A" # Peroxide better for steam

    # --- PVC/CPVC ---
    if "CPVC" in mat_name:
        if "hot water" in chem_l:
            rating = "A" # CPVC handles heat better
    
    # --- NYLON ---
    if "Nylon 11" in mat_name or "Nylon 12" in mat_name:
        if "water" in chem_l: # Nylon 6 absorbs water
            rating = "A" 

    # --- SILICONE ---
    if "Fluorosilicone" in mat_name:
        if "oil" in chem_l or "fuel" in chem_l or "gasoline" in chem_l:
            rating = "A" # Fluorosilicone resists fuels, normal silicone swells

    # --- HASTELLOY ---
    if "Hastelloy B-3" in mat_name:
        if "hydrochloric acid" in chem_l:
            rating = "A" # B-series excellent for HCl
    
    if "Hastelloy C-22" in mat_name:
        if "oxidizing" in chem_l or "wet chlorine" in chem_l or "nitric" in chem_l:
            rating = "A" # C-22 better for oxidizing envs

    # --- FIBERGLASS ---
    if "Vinyl Ester" in mat_name:
        if "acid" in chem_l:
            rating = "A" # Vinyl ester better chemical resistance than polyester
    
    if "Epoxy Resin" in mat_name:
        if "alkali" in chem_l or "caustic" in chem_l:
            rating = "A" # Epoxy generally better with alkalis

    return rating

# --- EXECUTION ---

print("Expanding data...")

for original_mat, chem_dict in data.items():
    # Find subtypes
    found_subtypes = subtypes.get(original_mat, [original_mat]) # Default to self if not found
    
    # Special handling for already specific names in source (e.g. SS 304, SS 316 were keys in original)
    # The subtypes dict handles mapping "Stainless Steel 304" -> ["Stainless Steel 304", "304L"]
    
    for subtype in found_subtypes:
        new_data[subtype] = {}
        for chem, rating in chem_dict.items():
            final_rating = apply_specific_rules(subtype, chem, rating)
            new_data[subtype][chem] = final_rating
            
            if final_rating != rating:
                log_expansion(original_mat, subtype, chem, final_rating, "Specific Rule Applied")

print(f"Original Materials: {len(data)}")
print(f"Expanded Materials: {len(new_data)}")
print(f"Specific Adjustments: {len(changes)}")

# Write Log
with open(log_file, "w", encoding="utf-8") as f:
    f.write(f"Expansion Log - {len(changes)} specific adjustments\n")
    f.write("=================================================\n")
    for line in changes:
        f.write(line + "\n")

# Write JS
js_content = f"export const COMPATIBILITY_DATA = {json.dumps(new_data, indent=2)};"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print("Done.")
