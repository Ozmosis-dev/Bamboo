"""Bamboo on Market — photoreal interior scene for Blender/Cycles.

Builds the main dining room (brick wall, red banquette, walnut tables,
cone pendants, burlap swag canopy, spirits bar) procedurally and renders
stills from preset cameras. Referenced against the client's interior
photography and the A1-1 floor plan proportions.

Usage:
  blender -b -P scripts/blender/interior_scene.py -- \
      --shot hero|wide|detail|all --samples 384 --scale 1.0 [--save-blend]

Textures: CC0 PBR sets from Poly Haven in renders/assets/ (see repo docs).
Units: meters.
"""

import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "renders" / "assets"
OUT = ROOT / "renders" / "out"

# ------------------------------------------------------------------- args

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def arg(name, default=None):
    return argv[argv.index(name) + 1] if name in argv else default


SHOT = arg("--shot", "hero")
SAMPLES = int(arg("--samples", "384"))
SCALE = float(arg("--scale", "1.0"))
SAVE_BLEND = "--save-blend" in argv

random.seed(7)

# ------------------------------------------------------------- scene reset

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"

# ------------------------------------------------------------------ helpers


def set_input(node, name, value):
    """Set a node input if it exists under this Blender version's name."""
    if name in node.inputs:
        node.inputs[name].default_value = value


def new_mat(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    return mat, bsdf, mat.node_tree


def tex_node(tree, path, colorspace="sRGB"):
    img = bpy.data.images.load(str(path), check_existing=True)
    img.colorspace_settings.name = colorspace
    n = tree.nodes.new("ShaderNodeTexImage")
    n.image = img
    n.projection = "BOX"
    n.projection_blend = 0.3
    return n


def pbr_material(name, slug, scale=1.0, color_file=None, rough_mult=None,
                 tint=None, extra=None):
    """Principled material from a Poly Haven map set, box-projected."""
    folder = ASSETS / slug
    mat, bsdf, tree = new_mat(name)
    nodes, links = tree.nodes, tree.links

    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    links.new(coord.outputs["Object"], mapping.inputs["Vector"])

    def hook(n):
        links.new(mapping.outputs["Vector"], n.inputs["Vector"])

    diff_path = folder / (color_file or f"{slug}_diff_2k.jpg")
    if diff_path.exists():
        d = tex_node(tree, diff_path, "sRGB")
        hook(d)
        if tint:
            mix = nodes.new("ShaderNodeMix")
            mix.data_type = "RGBA"
            mix.blend_type = "MULTIPLY"
            set_input(mix, "Factor", 1.0)
            links.new(d.outputs["Color"], mix.inputs[6])
            mix.inputs[7].default_value = (*tint, 1)
            links.new(mix.outputs[2], bsdf.inputs["Base Color"])
        else:
            links.new(d.outputs["Color"], bsdf.inputs["Base Color"])

    rough_path = folder / f"{slug}_rough_2k.jpg"
    if rough_path.exists():
        r = tex_node(tree, rough_path, "Non-Color")
        hook(r)
        if rough_mult is not None:
            mul = nodes.new("ShaderNodeMath")
            mul.operation = "MULTIPLY"
            mul.inputs[1].default_value = rough_mult
            links.new(r.outputs["Color"], mul.inputs[0])
            links.new(mul.outputs[0], bsdf.inputs["Roughness"])
        else:
            links.new(r.outputs["Color"], bsdf.inputs["Roughness"])

    nor_path = folder / f"{slug}_nor_gl_2k.jpg"
    if nor_path.exists():
        n = tex_node(tree, nor_path, "Non-Color")
        hook(n)
        nm = nodes.new("ShaderNodeNormalMap")
        links.new(n.outputs["Color"], nm.inputs["Color"])
        links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])

    if extra:
        extra(bsdf)
    return mat


def plain_material(name, color, rough=0.5, metal=0.0, emission=None,
                   emission_strength=0.0):
    mat, bsdf, _ = new_mat(name)
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if emission:
        set_input(bsdf, "Emission Color", (*emission, 1))
        set_input(bsdf, "Emission Strength", emission_strength)
    return mat


def box(name, size, loc, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (size[0], size[1], size[2])
    bpy.ops.object.transform_apply(scale=True)
    if bevel > 0:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    ob.data.materials.append(mat)
    return ob


def cylinder(name, r, depth, loc, mat, rot=(0, 0, 0), verts=24):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc,
                                        rotation=rot, vertices=verts)
    ob = bpy.context.object
    ob.name = name
    ob.data.materials.append(mat)
    return ob


def rod_between(name, a, b, r, mat):
    a, b = Vector(a), Vector(b)
    d = b - a
    mid = (a + b) / 2
    ob = cylinder(name, r, d.length, mid, mat, verts=12)
    ob.rotation_mode = "QUATERNION"
    ob.rotation_quaternion = d.to_track_quat("Z", "Y")
    return ob


def look_at(cam, target):
    d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


# ---------------------------------------------------------------- materials

M = {}
M["brick"] = pbr_material("brick", "red_brick", scale=0.55, rough_mult=1.1)
M["floor"] = pbr_material(
    "floor", "concrete_floor_02", scale=0.28, rough_mult=0.4,
    tint=(0.34, 0.31, 0.27),
    extra=lambda b: set_input(b, "Specular IOR Level", 0.6),
)
M["walnut"] = pbr_material("walnut", "american_walnut_veneer", scale=0.9,
                           rough_mult=0.65, tint=(0.85, 0.58, 0.38))
M["linen"] = pbr_material(
    "linen", "rough_linen", scale=0.45, tint=(0.36, 0.27, 0.18),
    # whisper of warm glow so the swags never go dead black
    extra=lambda b: (set_input(b, "Emission Color", (1.0, 0.72, 0.45, 1)),
                     set_input(b, "Emission Strength", 0.1)))
M["leather"] = pbr_material("leather", "leather_red_02", scale=0.8,
                            color_file="leather_red_02_coll1_2k.jpg",
                            tint=(0.9, 0.22, 0.18))
M["planks"] = pbr_material("planks", "dark_wooden_planks", scale=0.7)

M["black"] = plain_material("black", (0.015, 0.014, 0.013), rough=0.6)
M["steel"] = plain_material("steel", (0.65, 0.66, 0.68), rough=0.3, metal=1.0)
M["brass"] = plain_material("brass", (0.72, 0.55, 0.26), rough=0.25, metal=1.0)
M["cream"] = plain_material("cream", (0.48, 0.44, 0.36), rough=0.55)
M["white_chair"] = plain_material("white_chair", (0.75, 0.73, 0.69), rough=0.4)
M["verm"] = plain_material("verm", (0.42, 0.055, 0.03), rough=0.35)
M["smoke"] = plain_material("smoke", (0.045, 0.04, 0.036), rough=0.8)
M["napkin"] = plain_material("napkin", (0.78, 0.75, 0.68), rough=0.9)
M["bamboo"] = plain_material("bamboo", (0.42, 0.33, 0.16), rough=0.75)
# woven shade glows from the bulb inside: warm translucent emission
M["shade"] = pbr_material(
    "shade", "rough_linen", scale=3.2, tint=(0.3, 0.18, 0.08),
    extra=lambda b: (set_input(b, "Emission Color", (1.0, 0.32, 0.06, 1)),
                     set_input(b, "Emission Strength", 0.75)))
M["glass"] = plain_material("glass", (1, 1, 1), rough=0.02)
set_input(M["glass"].node_tree.nodes["Principled BSDF"], "Transmission Weight", 1.0)
M["bottle_glass"] = plain_material("bottle_glass", (0.35, 0.5, 0.35), rough=0.05)
set_input(M["bottle_glass"].node_tree.nodes["Principled BSDF"], "Transmission Weight", 1.0)
M["led"] = plain_material("led", (1, 1, 1), emission=(1.0, 0.55, 0.25),
                          emission_strength=3.0)
M["flame"] = plain_material("flame", (1, 1, 1), emission=(1.0, 0.55, 0.18),
                            emission_strength=60.0)
M["mirror"] = plain_material("mirror", (0.12, 0.11, 0.1), rough=0.12, metal=0.9)

# ----------------------------------------------------------------- the room

L, W, H = 21.0, 9.4, 4.6  # length (x), width (y), height (z)

box("floor", (L + 4, W + 4, 0.1), (L / 2, W / 2, -0.05), M["floor"])
box("wall_brick", (L, 0.12, H), (L / 2, -0.06, H / 2), M["brick"])
box("wall_bar", (L, 0.12, H), (L / 2, W + 0.06, H / 2), M["smoke"])
box("wall_near", (0.12, W, H), (-0.06, W / 2, H / 2), M["smoke"])
box("ceiling_cap", (L + 1, W + 1, 0.1), (L / 2, W / 2, H + 0.05), M["smoke"])

# cream panel band above the banquette (per photos)
box("panel_band", (18.4, 0.06, 0.55), (10.0, 0.10, 1.24), M["cream"], bevel=0.01)

# vermilion kanji-banner strips on the brick (brand motif from the menus)
for bx in (7.0, 14.0):
    box(f"banner_{bx}", (0.5, 0.03, 1.7), (bx, 0.08, 3.1), M["verm"])

# ----------------------------------------------------- banquette + tables

BENCH_X0, BENCH_X1 = 1.0, 19.0
box("bench_seat", (BENCH_X1 - BENCH_X0, 0.56, 0.16),
    ((BENCH_X0 + BENCH_X1) / 2, 0.36, 0.40), M["leather"], bevel=0.03)
box("bench_base", (BENCH_X1 - BENCH_X0, 0.5, 0.32),
    ((BENCH_X0 + BENCH_X1) / 2, 0.36, 0.16), M["black"])
# tufted back cushions, one per seat bay
for i in range(12):
    x = BENCH_X0 + 0.75 + i * 1.5
    box(f"bench_back_{i}", (1.42, 0.14, 0.44), (x, 0.145, 0.72),
        M["leather"], bevel=0.035)

TABLE_XS = [2.4 + i * 1.65 for i in range(10)]
TABLE_Y = 1.08
for i, x in enumerate(TABLE_XS):
    box(f"table_{i}", (0.78, 0.78, 0.045), (x, TABLE_Y, 0.745), M["walnut"],
        bevel=0.008)
    cylinder(f"table_col_{i}", 0.035, 0.68, (x, TABLE_Y, 0.38), M["black"])
    box(f"table_base_{i}", (0.42, 0.42, 0.025), (x, TABLE_Y, 0.02), M["black"])

    # settings: napkin + chopsticks + tealight, loosely placed
    for s, ys in ((0, 0.86), (1, 1.32)):
        rz = random.uniform(-0.15, 0.15)
        box(f"napkin_{i}_{s}", (0.2, 0.13, 0.014), (x - 0.12, ys, 0.775),
            M["napkin"], rot=(0, 0, rz))
        box(f"chop_{i}_{s}", (0.005, 0.24, 0.005), (x + 0.1, ys, 0.772),
            M["black"], rot=(0, 0, rz + 0.05))
    cylinder(f"tl_cup_{i}", 0.028, 0.03, (x + 0.2, TABLE_Y, 0.785), M["brass"])
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.011,
                                         location=(x + 0.2, TABLE_Y, 0.812))
    fl = bpy.context.object
    fl.name = f"flame_{i}"
    fl.data.materials.append(M["flame"])


def chair(name, loc, rz):
    """White open-back dining chair (per the photos), parented to an empty."""
    bpy.ops.object.empty_add(location=loc)
    root = bpy.context.object
    root.name = name
    root.rotation_euler = (0, 0, rz)
    parts = [
        box(name + "_seat", (0.44, 0.44, 0.035), (0, 0, 0.455),
            M["white_chair"], bevel=0.012),
        box(name + "_stile_l", (0.035, 0.03, 0.42), (-0.19, 0.20, 0.66),
            M["white_chair"]),
        box(name + "_stile_r", (0.035, 0.03, 0.42), (0.19, 0.20, 0.66),
            M["white_chair"]),
        box(name + "_rail", (0.42, 0.035, 0.1), (0, 0.205, 0.83),
            M["white_chair"], bevel=0.012),
    ]
    for sx in (-0.18, 0.18):
        for sy in (-0.18, 0.18):
            parts.append(cylinder(name + f"_leg{sx:+.2f}{sy:+.2f}", 0.012,
                                  0.45, (sx, sy, 0.225), M["steel"], verts=10))
    for ob in parts:
        ob.parent = root
    return root


for i, x in enumerate(TABLE_XS):
    jitter = random.uniform(-0.08, 0.08)
    # diner faces the bench (−y), so the chair back stays on the room side
    chair(f"chair_{i}", (x + jitter, TABLE_Y + 0.62, 0),
          random.uniform(-0.12, 0.12))

# center-floor 4-tops filling the middle of the room (per the wide photo)
for i in range(5):
    x = 4.2 + i * 3.1
    y = 4.3
    box(f"ctable_{i}", (0.85, 0.85, 0.045), (x, y, 0.745), M["walnut"],
        bevel=0.008)
    cylinder(f"ctable_col_{i}", 0.035, 0.68, (x, y, 0.38), M["black"])
    box(f"ctable_base_{i}", (0.45, 0.45, 0.025), (x, y, 0.02), M["black"])
    cylinder(f"ctl_cup_{i}", 0.028, 0.03, (x + 0.18, y - 0.1, 0.785), M["brass"])
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.011,
                                         location=(x + 0.18, y - 0.1, 0.812))
    cfl = bpy.context.object
    cfl.name = f"cflame_{i}"
    cfl.data.materials.append(M["flame"])
    for s, (dy, rz) in enumerate(((-0.65, 0.0), (0.65, math.pi))):
        chair(f"cchair_{i}_{s}", (x + random.uniform(-0.06, 0.06), y + dy, 0),
              rz + random.uniform(-0.15, 0.15))
    box(f"cnapkin_{i}", (0.2, 0.13, 0.014), (x - 0.15, y + 0.12, 0.775),
        M["napkin"], rot=(0, 0, random.uniform(-0.2, 0.2)))

# --------------------------------------------------------------- pendants

PEND_Y = 0.95
for i in range(9):
    x = 2.0 + i * 2.1
    top = (x, PEND_Y, 2.56)
    anchor = (x, 0.02, 3.45)
    rod_between(f"rod_{i}", anchor, top, 0.008, M["black"])
    bpy.ops.mesh.primitive_cone_add(radius1=0.24, radius2=0.055, depth=0.52,
                                    location=(x, PEND_Y, 2.3), vertices=28)
    cone = bpy.context.object
    cone.name = f"shade_{i}"
    cone.data.materials.append(M["shade"])
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(x, PEND_Y, 2.2))
    bulb = bpy.context.object
    bulb.name = f"bulb_{i}"
    bulb.data.materials.append(M["led"])
    # light sits below the shade mouth so it washes the table and brick
    light = bpy.data.lights.new(f"pl_{i}", "POINT")
    light.energy = 42
    light.color = (1.0, 0.68, 0.38)
    light.shadow_soft_size = 0.09
    lo = bpy.data.objects.new(f"pl_{i}", light)
    lo.location = (x, PEND_Y, 2.0)
    scene.collection.objects.link(lo)

# ------------------------------------------------------------------ canopy

CAN_Y1 = 7.2  # canopy covers the dining side; flat dark ceiling over the bar
SWAG = 3.5
NSW = 6
mesh = bpy.data.meshes.new("canopy")
verts, faces = [], []
nx, ny = NSW * 12, 10
for ix in range(nx + 1):
    x = L * ix / nx
    frac = (x % SWAG) / SWAG
    sag = 0.42 * math.sin(math.pi * frac)
    for iy in range(ny + 1):
        y = CAN_Y1 * iy / ny
        edge = math.sin(math.pi * iy / ny)  # extra belly mid-width
        verts.append((x, y, 4.5 - sag * (0.55 + 0.45 * edge)))
for ix in range(nx):
    for iy in range(ny):
        a = ix * (ny + 1) + iy
        faces.append((a, a + 1, a + ny + 2, a + ny + 1))
mesh.from_pydata(verts, [], faces)
mesh.update()
canopy = bpy.data.objects.new("canopy", mesh)
canopy.data.materials.append(M["linen"])
scene.collection.objects.link(canopy)
bpy.context.view_layer.objects.active = canopy
bpy.ops.object.shade_smooth()

# warm LED lines at every swag seam + along the bar edge (photo 3's glow line)
for i in range(NSW + 1):
    x = min(i * SWAG, L - 0.05)
    box(f"ledseam_{i}", (0.03, CAN_Y1, 0.03), (x, CAN_Y1 / 2, 4.47), M["led"])
box("ledbar", (L, 0.03, 0.03), (L / 2, CAN_Y1, 4.42), M["led"])

# soft bounce light hidden above the canopy
sun = bpy.data.lights.new("fill", "AREA")
sun.energy = 120
sun.spread = math.radians(100)
sun.color = (1.0, 0.72, 0.48)
sun.size = 18
so = bpy.data.objects.new("fill", sun)
so.location = (L / 2, 3.5, 4.4)
so.rotation_euler = (0, 0, 0)
scene.collection.objects.link(so)

# ------------------------------------------------------------------- bar

BAR_X0, BAR_X1 = 3.0, 19.0
BAR_FRONT = W - 1.0
box("bar_front", ((BAR_X1 - BAR_X0), 0.06, 1.05),
    ((BAR_X0 + BAR_X1) / 2, BAR_FRONT, 0.55), M["planks"])
box("bar_body", ((BAR_X1 - BAR_X0), 0.6, 1.05),
    ((BAR_X0 + BAR_X1) / 2, BAR_FRONT + 0.32, 0.55), M["black"])
box("bar_top", ((BAR_X1 - BAR_X0) + 0.2, 0.78, 0.05),
    ((BAR_X0 + BAR_X1) / 2, BAR_FRONT + 0.3, 1.12), M["walnut"], bevel=0.01)
rod_between("footrail", (BAR_X0 + 0.2, BAR_FRONT - 0.18, 0.25),
            (BAR_X1 - 0.2, BAR_FRONT - 0.18, 0.25), 0.02, M["brass"])
# warm underglow beneath the bar-top lip (per the photos' lit bar front)
box("bar_underglow", ((BAR_X1 - BAR_X0) - 0.3, 0.02, 0.015),
    ((BAR_X0 + BAR_X1) / 2, BAR_FRONT - 0.03, 1.07), M["led"])
box("barback_panel", ((BAR_X1 - BAR_X0), 0.04, 2.4),
    ((BAR_X0 + BAR_X1) / 2, W - 0.1, 1.7), M["mirror"])
# walnut slat screen above the barback (per the photos' wood slat walls)
slat_x = BAR_X0 + 0.1
while slat_x < BAR_X1:
    box(f"slat_{slat_x:.2f}", (0.06, 0.05, 1.5), (slat_x, W - 0.14, 3.7),
        M["walnut"])
    slat_x += 0.18
for si, sz in enumerate((1.45, 2.0)):
    box(f"shelf_{si}", ((BAR_X1 - BAR_X0) - 0.4, 0.3, 0.03),
        ((BAR_X0 + BAR_X1) / 2, W - 0.26, sz), M["walnut"])
    box(f"shelf_led_{si}", ((BAR_X1 - BAR_X0) - 0.5, 0.02, 0.012),
        ((BAR_X0 + BAR_X1) / 2, W - 0.14, sz - 0.015), M["led"])
    n = 34
    for b in range(n):
        x = BAR_X0 + 0.4 + (BAR_X1 - BAR_X0 - 0.8) * b / n + random.uniform(-0.05, 0.05)
        h = random.uniform(0.22, 0.33)
        cylinder(f"bottle_{si}_{b}", random.uniform(0.032, 0.042), h,
                 (x, W - 0.26, sz + h / 2 + 0.02), M["bottle_glass"], verts=12)

# bar stools
for i in range(9):
    x = 4.0 + i * 1.7
    cylinder(f"stool_seat_{i}", 0.19, 0.05, (x, BAR_FRONT - 0.45, 0.78),
             M["walnut"])
    cylinder(f"stool_col_{i}", 0.025, 0.74, (x, BAR_FRONT - 0.45, 0.4),
             M["black"], verts=12)
    cylinder(f"stool_base_{i}", 0.16, 0.02, (x, BAR_FRONT - 0.45, 0.02),
             M["black"])

# recessed downlights over the center-floor tables
for cx in (5.8, 10.4, 15.0):
    light = bpy.data.lights.new(f"ctr_dl_{cx}", "SPOT")
    light.energy = 200
    light.color = (1.0, 0.7, 0.42)
    light.spot_size = 0.9
    light.spot_blend = 0.5
    light.shadow_soft_size = 0.08
    lo = bpy.data.objects.new(f"ctr_dl_{cx}", light)
    lo.location = (cx, 4.3, 3.9)
    scene.collection.objects.link(lo)

# downlights over the bar
for i in range(5):
    light = bpy.data.lights.new(f"bar_dl_{i}", "SPOT")
    light.energy = 380
    light.color = (1.0, 0.72, 0.45)
    light.spot_size = 1.0
    light.spot_blend = 0.4
    light.shadow_soft_size = 0.06
    lo = bpy.data.objects.new(f"bar_dl_{i}", light)
    lo.location = (5.0 + i * 3.2, BAR_FRONT + 0.1, 4.0)
    lo.rotation_euler = (0, 0, 0)
    scene.collection.objects.link(lo)

# ------------------------------------------------- far end: glazing + door

MULL = M["black"]
for yb in (0.0, W / 3, 2 * W / 3, W):
    box(f"mull_v_{yb}", (0.08, 0.08, H), (L, yb if yb else 0.04, H / 2), MULL)
box("mull_h", (0.08, W, 0.1), (L, W / 2, 3.1), MULL)
box("glass_end", (0.02, W, H), (L + 0.02, W / 2, H / 2), M["glass"])
# vermilion double door, center bay
box("door", (0.08, 1.9, 2.25), (L - 0.02, W / 2, 1.125), M["verm"], bevel=0.01)
cylinder("door_pull", 0.015, 0.7, (L - 0.09, W / 2 - 0.4, 1.1), M["brass"],
         rot=(math.pi / 2 * 0, 0, 0))
# cool city rim light outside the glass
ext = bpy.data.lights.new("ext", "AREA")
ext.energy = 220
ext.color = (0.55, 0.65, 0.9)
ext.size = 9
ext.spread = math.radians(70)
exo = bpy.data.objects.new("ext", ext)
exo.location = (L + 2.5, W / 2, 2.6)
exo.rotation_euler = (0, math.radians(-95), 0)
scene.collection.objects.link(exo)

# bamboo screen near the far corner
for i in range(14):
    x = 19.3 + (i % 2) * 0.18
    y = 5.4 + i * 0.14
    cylinder(f"bpole_{i}", 0.032, H - 0.2, (x, y, (H - 0.2) / 2), M["bamboo"],
             verts=10)

# --------------------------------------------------------------- world/sky

world = bpy.data.worlds.new("night")
scene.world = world
world.use_nodes = True
wn = world.node_tree
env = wn.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(
    str(ASSETS / "modern_buildings_night" / "modern_buildings_night_2k.hdr"))
bg = wn.nodes["Background"]
bg.inputs["Strength"].default_value = 0.25
mapn = wn.nodes.new("ShaderNodeMapping")
mapn.inputs["Rotation"].default_value = (0, 0, math.radians(155))
coordn = wn.nodes.new("ShaderNodeTexCoord")
wn.links.new(coordn.outputs["Generated"], mapn.inputs["Vector"])
wn.links.new(mapn.outputs["Vector"], env.inputs["Vector"])
wn.links.new(env.outputs["Color"], bg.inputs["Color"])

# ----------------------------------------------------------------- cameras

CAMS = {
    "hero": dict(loc=(1.9, 2.4, 1.5), target=(13.0, 0.9, 1.15), lens=40,
                 fstop=2.8, focus=3.8),
    "wide": dict(loc=(18.0, 7.9, 2.0), target=(4.0, 3.4, 1.0), lens=28,
                 fstop=5.6, focus=10.0),
    "detail": dict(loc=(3.5, 1.9, 1.05), target=(4.25, 1.08, 0.8), lens=50,
                   fstop=2.0, focus=1.15),
}


def make_cam(name, spec):
    cam_data = bpy.data.cameras.new(name)
    cam_data.lens = spec["lens"]
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = spec["fstop"]
    cam_data.dof.focus_distance = spec["focus"]
    cam = bpy.data.objects.new(name, cam_data)
    cam.location = spec["loc"]
    scene.collection.objects.link(cam)
    look_at(cam, spec["target"])
    return cam


cams = {k: make_cam(k, v) for k, v in CAMS.items()}

# ------------------------------------------------------------ render setup

scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = True
scene.cycles.device = "GPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.sample_clamp_indirect = 8.0
scene.cycles.max_bounces = 10
scene.render.resolution_x = int(1920 * SCALE)
scene.render.resolution_y = int(1280 * SCALE)
scene.render.image_settings.file_format = "PNG"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Punchy"
scene.view_settings.exposure = 0.25

OUT.mkdir(parents=True, exist_ok=True)

shots = list(CAMS) if SHOT == "all" else [SHOT]
for s in shots:
    scene.camera = cams[s]
    scene.render.filepath = str(OUT / f"{s}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", s)

if SAVE_BLEND:
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "interior.blend"))
print("ALL DONE")
