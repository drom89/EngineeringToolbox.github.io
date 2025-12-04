import json
import re

# Load existing data
input_file = "js/chem_data_full.js"
output_file = "js/chem_data_full.js"
log_file = "verification_log.txt"

print(f"Loading data from {input_file}...")
with open(input_file, "r", encoding="utf-8") as f:
    content = f.read()
    # Extract JSON part: export const COMPATIBILITY_DATA = {...};
    match = re.search(r"export const COMPATIBILITY_DATA = ({.*});", content, re.DOTALL)
    if match:
        data = json.loads(match.group(1))
    else:
        print("Error: Could not parse JS file.")
        exit(1)

changes = []

def log_change(mat, chem, old, new, reason):
    if old != new:
        msg = f"[{mat} + {chem}] Changed {old} -> {new} ({reason})"
        changes.append(msg)
        # print(msg)
        return new
    return old

# --- RULES DEFINITION ---

def check_compatibility(mat, chem, current_rating):
    mat_l = mat.lower()
    chem_l = chem.lower()
    new_rating = current_rating

    # --- METALS ---
    is_steel = "steel" in mat_l and "stainless" not in mat_l
    is_ss = "stainless" in mat_l
    is_al = "aluminum" in mat_l
    is_brass = "brass" in mat_l or "bronze" in mat_l
    is_copper = "copper" in mat_l
    is_titanium = "titanium" in mat_l
    is_hastelloy = "hastelloy" in mat_l
    is_monel = "monel" in mat_l
    is_inconel = "inconel" in mat_l
    is_tantalum = "tantalum" in mat_l
    is_zirconium = "zirconium" in mat_l
    is_nickel = "nickel" in mat_l

    # Strong Acids
    if any(x in chem_l for x in ["sulfuric", "hydrochloric", "nitric", "hydrofluoric", "phosphoric"]):
        if is_steel or is_al or is_brass or is_copper:
            new_rating = log_change(mat, chem, new_rating, "D", "Strong Acid attacks standard metals")
        if is_ss:
            if "hydrochloric" in chem_l or "hydrofluoric" in chem_l:
                new_rating = log_change(mat, chem, new_rating, "D", "SS poor with HCl/HF")
            elif "nitric" in chem_l:
                new_rating = log_change(mat, chem, new_rating, "A", "SS good with Nitric")
        if is_hastelloy or is_inconel or is_monel or is_tantalum or is_zirconium:
             new_rating = log_change(mat, chem, new_rating, "A", "High performance alloys generally acid resistant")
    
    # Bases
    if "hydroxide" in chem_l:
        if is_al:
            new_rating = log_change(mat, chem, new_rating, "D", "Aluminum attacked by strong bases")
        if is_steel:
            new_rating = log_change(mat, chem, new_rating, "A", "Steel generally good with bases")
        if is_tantalum:
            new_rating = log_change(mat, chem, new_rating, "D", "Tantalum attacked by strong alkalis")

    # Solvents vs Metals
    if is_ss or is_hastelloy or is_monel or is_inconel or is_titanium:
        if "acetone" in chem_l or "ethanol" in chem_l or "methanol" in chem_l or "isopropyl" in chem_l:
             new_rating = log_change(mat, chem, new_rating, "A", "Metals excellent with common solvents")

    # --- PLASTICS ---
    is_pvc = "pvc" in mat_l
    is_pp = "polypropylene" in mat_l or mat_l == "pp"
    is_pe = "polyethylene" in mat_l or "hdpe" in mat_l or "ldpe" in mat_l
    is_abs = "abs" in mat_l
    is_pc = "polycarbonate" in mat_l
    is_ptfe = "ptfe" in mat_l or "teflon" in mat_l
    is_nylon = "nylon" in mat_l
    is_pvdf = "pvdf" in mat_l or "kynar" in mat_l
    is_peek = "peek" in mat_l
    is_acetal = "acetal" in mat_l or "delrin" in mat_l
    is_acrylic = "acrylic" in mat_l

    # Solvents (Ketones, Aromatics)
    is_ketone = "acetone" in chem_l or "mek" in chem_l or "ketone" in chem_l
    is_aromatic = "toluene" in chem_l or "xylene" in chem_l or "benzene" in chem_l
    is_chlorinated = "chloroform" in chem_l or "dichloromethane" in chem_l

    if is_ketone:
        if is_pvc or is_abs or is_pc or is_acrylic:
            new_rating = log_change(mat, chem, new_rating, "D", "Ketones dissolve Amorphous plastics")
        if is_pp or is_pe or is_nylon or is_acetal:
            new_rating = log_change(mat, chem, new_rating, "A", "Semi-crystalline plastics good with Ketones")
        if is_pvdf:
             new_rating = log_change(mat, chem, new_rating, "D", "PVDF attacked by Ketones (polar solvents)")
    
    if is_aromatic:
        if is_abs or is_pc or is_pvc or is_acrylic:
             new_rating = log_change(mat, chem, new_rating, "D", "Aromatics attack amorphous plastics")
        if is_nylon or is_pvdf or is_peek:
             new_rating = log_change(mat, chem, new_rating, "A", "High perf plastics good with aromatics")

    if is_ptfe or is_peek:
        # PTFE/PEEK excellent generally
        new_rating = log_change(mat, chem, new_rating, "A", "High performance plastic generally inert")

    if is_acetal:
        if any(x in chem_l for x in ["sulfuric", "hydrochloric", "nitric", "phosphoric"]):
             new_rating = log_change(mat, chem, new_rating, "D", "Acetal attacked by strong acids")

    # --- ELASTOMERS ---
    is_epdm = "epdm" in mat_l
    is_viton = "viton" in mat_l or "fkm" in mat_l
    is_nbr = "buna-n" in mat_l or "nitrile" in mat_l
    is_neoprene = "neoprene" in mat_l
    is_silicone = "silicone" in mat_l
    is_butyl = "butyl" in mat_l
    is_kalrez = "kalrez" in mat_l or "chemraz" in mat_l

    # Oils/Fuels
    is_oil = "oil" in chem_l or "diesel" in chem_l or "gasoline" in chem_l or "kerosene" in chem_l
    
    if is_oil:
        if is_epdm or is_butyl or is_silicone or is_neoprene: # Neoprene is moderate, but often C/D for fuels
            new_rating = log_change(mat, chem, new_rating, "D", "EPDM/Butyl/Silicone swell in oils/fuels")
        if is_nbr or is_viton or is_kalrez:
            new_rating = log_change(mat, chem, new_rating, "A", "Nitrile/Viton/Kalrez designed for oils")

    # Brake Fluid (Glycol based)
    if "brake fluid" in chem_l:
        if is_epdm:
            new_rating = log_change(mat, chem, new_rating, "A", "EPDM good for brake fluid")
        if is_nbr or is_viton: # Viton is usually ok but NBR is bad
            new_rating = log_change(mat, chem, new_rating, "D", "Nitrile attacked by brake fluid")

    if is_kalrez:
        new_rating = log_change(mat, chem, new_rating, "A", "Kalrez is perfluoroelastomer (FFKM), excellent")

    return new_rating

# --- EXECUTION ---

print("Verifying data...")
count = 0
for mat in data:
    for chem in data[mat]:
        data[mat][chem] = check_compatibility(mat, chem, data[mat][chem])
        count += 1

print(f"Processed {count} entries.")
print(f"Made {len(changes)} corrections.")

# Write Log
with open(log_file, "w", encoding="utf-8") as f:
    f.write(f"Verification Log - {len(changes)} changes made\n")
    f.write("=================================================\n")
    for line in changes:
        f.write(line + "\n")

# Write JS
js_content = f"export const COMPATIBILITY_DATA = {json.dumps(data, indent=2)};"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print("Done.")
