"""
Generate workout section HTML fragments for TheFitBhaskar.in.
Creates the requested muscle pages with <main> content only.
"""

from html import escape


def equip_infer(name: str) -> str:
    n = name.lower()
    if "smith" in n:
        return "Smith machine"
    if "barbell" in n:
        return "Barbell"
    if "dumbbell" in n:
        return "Dumbbells"
    if "machine" in n or "pec-deck" in n or "hack squat" in n:
        return "Machine"
    if "cable" in n or "pulldown" in n:
        return "Cable machine"
    if "band" in n:
        return "Bands"
    if "trx" in n or "suspension" in n:
        return "Suspension trainer (TRX)"
    if "press-down" in n:
        return "Cable machine"
    if "plate" in n:
        return "Weight plate"
    if "farmer" in n:
        return "Farmer's handles / dumbbells"
    if "walk" in n or "plank" in n or "push-up" in n or "crunch" in n or "mountain climber" in n or "bridge" in n:
        return "Bodyweight"
    if "wheel" in n:
        return "Ab wheel"
    if "trap bar" in n:
        return "Trap bar"
    return "Bodyweight or listed equipment"


def instructions(name: str, primary: str) -> list[str]:
    return [
        f"Set up for {name} with a stable base, braced core, and aligned joints.",
        f"Move through the working phase under control, directing tension to the {primary.lower()}.",
        "Pause briefly at the end range without bouncing or losing position.",
        "Return to the start along the same path, keeping tempo smooth and repeat for target reps.",
    ]


def benefits(primary: str, secondary: str) -> list[str]:
    return [
        f"Builds strength and hypertrophy in the {primary.lower()}.",
        f"Engages the {secondary.lower()} for balanced development and stability.",
        "Improves joint control, movement efficiency, and training consistency.",
    ]


def mistakes() -> list[str]:
    return [
        "Using momentum instead of control—slow the eccentric and stay braced.",
        "Cutting range of motion—work through a comfortable full range for better stimulus.",
        "Letting joints misalign—keep neutral wrists, stacked elbows/shoulders, and stable posture.",
    ]


def card_html(name: str, primary: str, secondary: str, equipment: str) -> str:
    how_to = instructions(name, primary)
    benes = benefits(primary, secondary)
    errs = mistakes()

    def li(items: list[str]) -> str:
        return "\n".join(f"      <li>{escape(text)}</li>" for text in items)

    return f"""    <article class="exercise-card">
      <h3 class="exercise-title">{escape(name)}</h3>
      <div class="exercise-meta">
        <p><strong>Primary Muscle:</strong> {escape(primary)}</p>
        <p><strong>Secondary Muscles:</strong> {escape(secondary)}</p>
        <p><strong>Equipment:</strong> {escape(equipment)}</p>
      </div>
      <div class="how-to">
        <h4>How to Perform</h4>
        <ol>
{li(how_to)}
        </ol>
      </div>
      <div class="benefits">
        <h4>Benefits</h4>
        <ul>
{li(benes)}
        </ul>
      </div>
      <div class="mistakes">
        <h4>Common Mistakes</h4>
        <ul>
{li(errs)}
        </ul>
      </div>
      <div class="video-link">
        <h4>Video Demonstration</h4>
        <p>[ VIDEO LINK HERE ]</p>
      </div>
    </article>"""


def page_html(title: str, intro: list[str], exercises: list[dict]) -> str:
    intro_html = "\n    ".join(f"<p>{escape(p)}</p>" for p in intro)
    cards = "\n\n".join(
        card_html(
            ex["name"],
            ex.get("primary") or ex["default_primary"],
            ex.get("secondary") or ex["default_secondary"],
            ex.get("equipment") or equip_infer(ex["name"]),
        )
        for ex in exercises
    )
    return f"""<main>
  <header class="page-header">
    <h1>{escape(title)}</h1>
    {intro_html}
  </header>

  <section class="exercise-grid">
{cards}
  </section>
</main>
"""


def legs_page():
    sections = [
        (
            "Quads (Quadriceps)",
            "Quadriceps (quads)",
            "Glutes, core, adductors",
            [
                "Back Squat",
                "Front Squat",
                "Hack Squat (Machine)",
                "Leg Press",
                "Walking Lunge",
                "Reverse Lunge",
                "Bulgarian Split Squat",
                "Step-Up",
                "Leg Extension",
            ],
        ),
        (
            "Hamstrings",
            "Hamstrings",
            "Glutes, lower back, calves",
            [
                "Romanian Deadlift",
                "Stiff-Leg Deadlift",
                "Good Morning",
                "Lying Leg Curl (Machine)",
                "Seated Leg Curl",
                "Standing Leg Curl",
                "Glute-Ham Raise",
            ],
        ),
        (
            "Glutes",
            "Gluteus maximus",
            "Hamstrings, quads, core",
            [
                "Barbell Hip Thrust",
                "Glute Bridge",
                "Bulgarian Split Squat",
                "Walking Lunge",
                "Step-Up",
            ],
        ),
        (
            "Calves",
            "Gastrocnemius and soleus",
            "Feet/ankle stabilizers",
            [
                "Standing Calf Raise",
                "Seated Calf Raise",
                "Donkey Calf Raise",
                "Leg Press Calf Raise",
                "Single-Leg Calf Raise",
            ],
        ),
    ]

    parts = []
    for title, primary, secondary, names in sections:
        cards = "\n\n".join(
            card_html(
                name,
                primary,
                secondary,
                equip_infer(name),
            )
            for name in names
        )
        parts.append(
            f"""  <section class="muscle-subsection">
    <h2>{escape(title)}</h2>
    <div class="exercise-grid">
{cards}
    </div>
  </section>"""
        )

    intro = [
        "Complete lower-body training across quads, hamstrings, glutes, and calves.",
        "Mix bilateral and unilateral work plus hinges to build strength, size, and resilience.",
    ]
    intro_html = "\n    ".join(f"<p>{escape(p)}</p>" for p in intro)
    return f"""<main>
  <header class="page-header">
    <h1>Leg Training</h1>
    {intro_html}
  </header>
{chr(10).join(parts)}
</main>
"""


def abs_page():
    title = "Abs & Core Training"
    intro = [
        "Core stability and abdominal strength to protect the spine and improve power transfer.",
        "Blend anti-extension, anti-rotation, and flexion movements for a complete core.",
    ]
    exercises = [
        "Crunch",
        "Reverse Crunch",
        "Bicycle Crunch",
        "Hanging Leg Raise",
        "Lying Leg Raise",
        "Knee Raise (Captain’s Chair)",
        "Plank",
        "Side Plank",
        "Russian Twist",
        "Cable Woodchop",
        "Decline Bench Sit-Up",
        "Ab Wheel Rollout",
        "Mountain Climber",
    ]
    ex_dicts = [
        {
            "name": name,
            "default_primary": "Abdominals and core stabilizers",
            "default_secondary": "Hip flexors, obliques, lower back",
            "equipment": equip_infer(name),
        }
        for name in exercises
    ]
    return page_html(title, intro, ex_dicts)


def main():
    groups = [
        {
            "filename": "chest.html",
            "title": "Chest Training",
            "intro": [
                "Pressing and fly variations that target the pectorals for strength, size, and shoulder stability.",
                "Mix horizontal and angled presses with flyes and push-ups to train the chest through full ranges.",
            ],
            "default_primary": "Pectoralis major",
            "default_secondary": "Triceps, anterior deltoids",
            "exercises": [
                # Barbell presses
                "Bench Press",
                "Incline Bench Press",
                "Decline Bench Press",
                "Barbell Bench Press With Bands",
                "Barbell Floor Press",
                "Reverse-Grip Bench Press",
                "Smith Machine Flat Bench Press",
                "Smith Machine Incline Bench Press",
                "Smith Machine Decline Bench Press",
                "One-Arm Smith Machine Bench Press",
                "One-Arm Smith Machine Negative Bench Press",
                "Smith Machine Bench Press Throw",
                "Smith Machine Reverse-Grip Bench Press",
                # Dumbbell presses
                "Dumbbell Bench Press",
                "Incline Dumbbell Press",
                "Decline Dumbbell Press",
                "One-Arm Dumbbell Bench Press",
                "Exercise-Ball Dumbbell Press",
                "Neutral-Grip Flat Bench Dumbbell Press",
                "Reverse-Grip Dumbbell Press",
                # Machine / cable / band presses
                "Seated Chest Press Machine",
                "One-Arm Cable Chest Press",
                "Cable Crossover Chest Press",
                "Cable Crossover Chest Press (From Low Pulleys)",
                "Cable Bench Press",
                "Standing Band Chest Press",
                # Fly variations
                "Dumbbell Fly",
                "Incline Dumbbell Fly",
                "Decline Dumbbell Fly",
                "Exercise-Ball Dumbbell Fly",
                "Leaning One-Arm Dumbbell Fly",
                "Cable Fly",
                "Cable Crossover",
                "Low-Pulley Cable Crossover",
                "Fly Machine",
                "One-Arm Standing Band Fly",
                "TRX Fly",
                # Push-up / dip / pullover
                "Push-Up",
                "Incline Push-Up",
                "Decline Push-Up",
                "Exercise-Ball Push-Up",
                "Power Push-Up",
                "Push-Up Ladder",
                "TRX Push-Up",
                "Chest Dip",
                "Dumbbell Pullover",
            ],
        },
        {
            "filename": "shoulders.html",
            "title": "Shoulder Training",
            "intro": [
                "Presses, raises, and pulls that build the anterior, middle, and posterior deltoids for balanced strength.",
                "Mix vertical presses with front, lateral, and rear-delt work to keep shoulders strong and resilient.",
            ],
            "default_primary": "Deltoids",
            "default_secondary": "Triceps, upper traps, rotator cuff",
            "exercises": [
                # Barbell / Smith Presses
                "Standing Barbell Overhead Press (Military Press)",
                "Seated Barbell Shoulder Press",
                "Behind-the-Neck Barbell Shoulder Press",
                "Smith Machine Shoulder Press",
                "Smith Machine Behind-the-Neck Press",
                "Barbell Push Press",
                # Dumbbell Presses
                "Seated Dumbbell Shoulder Press",
                "Standing Dumbbell Shoulder Press",
                "Arnold Press",
                "Neutral-Grip Dumbbell Shoulder Press",
                "One-Arm Dumbbell Shoulder Press",
                "Exercise-Ball Dumbbell Shoulder Press",
                # Front Raises
                "Dumbbell Front Raise",
                "Barbell Front Raise",
                "Plate Front Raise",
                "Cable Front Raise",
                "Single-Arm Cable Front Raise",
                "Band Front Raise",
                # Lateral Raises
                "Dumbbell Lateral Raise",
                "Seated Dumbbell Lateral Raise",
                "Leaning One-Arm Dumbbell Lateral Raise",
                "Cable Lateral Raise",
                "Low-Pulley Cable Lateral Raise",
                "Machine Lateral Raise",
                "Band Lateral Raise",
                # Rear Delt
                "Bent-Over Reverse Dumbbell Fly",
                "Reverse Pec-Deck Machine",
                "Cable Rear-Delt Fly",
                "Face Pull",
                "Incline Bench Reverse Dumbbell Fly",
                "Band Pull-Apart",
                "TRX Rear-Delt Fly",
                # Upright Rows
                "Barbell Upright Row",
                "EZ-Bar Upright Row",
                "Dumbbell Upright Row",
                "Cable Upright Row",
            ],
        },
        {
            "filename": "back.html",
            "title": "Back Training",
            "intro": [
                "Rows, pulls, and hinges to build lats, traps, and spinal erectors for a strong, stable back.",
                "Combine horizontal and vertical pulls with hip hinges for balanced development.",
            ],
            "default_primary": "Lats and upper back",
            "default_secondary": "Biceps, rear delts, forearms, spinal erectors",
            "exercises": [
                # Barbell Rows
                "Barbell Bent-Over Row",
                "Reverse-Grip Barbell Row",
                "Yates Row",
                "T-Bar Row",
                "Landmine Row",
                "Smith Machine Bent-Over Row",
                # Dumbbell Rows
                "One-Arm Dumbbell Row",
                "Two-Arm Dumbbell Row",
                "Chest-Supported Dumbbell Row",
                "Incline Dumbbell Row",
                "Dumbbell Seal Row",
                # Cable / Machine Rows
                "Seated Cable Row",
                "Wide-Grip Cable Row",
                "Close-Grip V-Bar Cable Row",
                "One-Arm Cable Row",
                "Hammer Strength Row Machine",
                "Low-Pulley Row",
                # Vertical Pulls
                "Pull-Up (Wide Grip)",
                "Neutral-Grip Pull-Up",
                "Chin-Up",
                "Close-Grip Chin-Up",
                "Assisted Pull-Up",
                "Wide-Grip Lat Pulldown",
                "Reverse-Grip Lat Pulldown",
                "Close-Grip Lat Pulldown",
                "Single-Arm Lat Pulldown",
                # Trap-Focused
                "Barbell Shrug",
                "Dumbbell Shrug",
                "Smith Machine Shrug",
                "Behind-the-Back Barbell Shrug",
                "Cable Shrug",
                "Trap Bar Shrug",
                # Lower Back
                "Conventional Deadlift",
                "Romanian Deadlift",
                "Stiff-Leg Deadlift",
                "Good Morning",
                "Back Extension (Hyperextension)",
                "45-Degree Back Raise",
                "Rack Pull",
                # Lat Isolation
                "Straight-Arm Lat Pulldown",
                "Rope Straight-Arm Pulldown",
                "Single-Arm Straight-Arm Pulldown",
                "Dumbbell Pullover",
            ],
        },
        {
            "filename": "biceps.html",
            "title": "Biceps Training",
            "intro": [
                "Curl variations that target elbow flexion and forearm supination for fuller, stronger arms.",
                "Blend free weights, cables, and preacher positions to challenge the biceps through every angle.",
            ],
            "default_primary": "Biceps brachii",
            "default_secondary": "Brachialis, forearms",
            "exercises": [
                # Barbell / EZ-Bar
                "Standing Barbell Curl",
                "Wide-Grip Barbell Curl",
                "Close-Grip Barbell Curl",
                "EZ-Bar Curl",
                "Reverse-Grip Barbell Curl",
                "Barbell Drag Curl",
                "Strict Curl (Back Against Wall)",
                # Dumbbells
                "Standing Dumbbell Curl",
                "Alternating Dumbbell Curl",
                "Seated Dumbbell Curl",
                "Incline Dumbbell Curl",
                "Hammer Curl",
                "Cross-Body Hammer Curl",
                "Zottman Curl",
                "Supinating Dumbbell Curl",
                # Preacher / Spider
                "Barbell Preacher Curl",
                "EZ-Bar Preacher Curl",
                "Dumbbell Preacher Curl",
                "Single-Arm Dumbbell Preacher Curl",
                "Machine Preacher Curl",
                "Spider Curl",
                # Cable
                "Standing Cable Curl (Straight Bar)",
                "Rope Cable Curl",
                "Single-Arm Cable Curl",
                "High Cable Curl (Double Arm)",
                "Single-Arm High Cable Curl",
                # Concentration
                "Seated Concentration Curl",
                "Standing Concentration Curl",
            ],
        },
        {
            "filename": "triceps.html",
            "title": "Triceps Training",
            "intro": [
                "Extensions, press-downs, and dips to build strong triceps for pressing power and arm size.",
                "Train through overhead, lying, and press-down positions for complete triceps development.",
            ],
            "default_primary": "Triceps brachii",
            "default_secondary": "Forearms, shoulders",
            "exercises": [
                # Barbell / EZ-Bar Extensions
                "Lying Barbell Triceps Extension (Skullcrusher)",
                "EZ-Bar Skullcrusher",
                "Incline Skullcrusher",
                "Decline Skullcrusher",
                "Seated Barbell French Press",
                "Seated EZ-Bar French Press",
                "Barbell JM Press",
                # Dumbbell Extensions
                "Lying Dumbbell Triceps Extension",
                "Seated Overhead Dumbbell Extension",
                "One-Arm Overhead Dumbbell Extension",
                "Incline Dumbbell Triceps Extension",
                "Decline Dumbbell Triceps Extension",
                "Tate Press (Cross-Body Extension)",
                # Cable Extensions
                "Cable Overhead Triceps Extension (Rope)",
                "Single-Arm Cable Overhead Extension",
                "Cable Lying Triceps Extension",
                "Reverse-Grip Cable Extension",
                "Kneeling Cable Overhead Extension",
                # Press-Downs
                "Rope Press-Down",
                "Straight-Bar Press-Down",
                "V-Bar Press-Down",
                "Reverse-Grip Press-Down",
                "Single-Arm Press-Down",
                # Dips & Close-Grip
                "Parallel Bar Triceps Dip",
                "Bench Dip",
                "Machine Assisted Dip",
                "Close-Grip Bench Press",
                "Diamond Push-Up",
                # Kickbacks
                "Dumbbell Kickback",
                "Cable Kickback",
            ],
        },
        {
            "filename": "forearms.html",
            "title": "Forearm Training",
            "intro": [
                "Wrist curls, holds, and grip work to develop stronger forearms and resilient elbows.",
                "Train flexion, extension, and carries for balanced forearm strength.",
            ],
            "default_primary": "Forearm flexors and extensors",
            "default_secondary": "Grip muscles, brachioradialis",
            "exercises": [
                "Barbell Wrist Curl",
                "Barbell Reverse Wrist Curl",
                "Dumbbell Wrist Curl",
                "Dumbbell Reverse Wrist Curl",
                "Behind-the-Back Barbell Wrist Curl",
                "Reverse Curl (EZ-Bar or Barbell)",
                "Hammer Curl",
                "Farmer’s Walk",
                "Plate Pinch Hold",
                "Towel Grip Pull-Up (Forearm Focus)",
            ],
        },
    ]

    for group in groups:
        ex_dicts = [
            {
                "name": name,
                "default_primary": group["default_primary"],
                "default_secondary": group["default_secondary"],
                "equipment": None,
            }
            for name in group["exercises"]
        ]
        html = page_html(group["title"], group["intro"], ex_dicts)
        with open(group["filename"], "w", encoding="utf-8") as f:
            f.write(html)

    with open("legs.html", "w", encoding="utf-8") as f:
        f.write(legs_page())

    with open("abs.html", "w", encoding="utf-8") as f:
        f.write(abs_page())


if __name__ == "__main__":
    main()
