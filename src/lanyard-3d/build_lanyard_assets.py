import bpy
import math
import sys
import os

print("[Blender] Starting Polished CAD Lanyard Hardware & Model Build...")

# 1. Clear existing objects
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Import existing card mesh from backup
backup_glb = 'C:/codaxiom/apps/custom-enterprise/ridhoazfa/assets/3d/card.v4.backup.glb'
bpy.ops.import_scene.gltf(filepath=backup_glb)

# Find and preserve the 'card' object
card_obj = None
for obj in list(bpy.data.objects):
    if obj.name == 'card':
        card_obj = obj
    elif obj.name in ['clip', 'clamp', 'buckle']:
        bpy.data.objects.remove(obj, do_unlink=True)

if not card_obj:
    print("[Error] card object not found in backup GLB!")
    sys.exit(1)

# Clean parent hierarchy and ensure card is exactly at (0, 0, 0)
card_obj.parent = None
card_obj.location = (0, 0, 0)
card_obj.rotation_euler = (0, 0, 0)
card_obj.scale = (1, 1, 1)

# Remove empty Scene / AuxScene nodes if any
for obj in list(bpy.data.objects):
    if obj != card_obj and obj.type == 'EMPTY':
        bpy.data.objects.remove(obj, do_unlink=True)

print("[Blender] Preserved card mesh successfully at (0, 0, 0):", card_obj.name)

# -------------------------------------------------------------------------
# 3. Create Continuous-Wire D-Ring & Precision Swivel Lobster Clasp Hook ('clip')
# -------------------------------------------------------------------------
# Card plane centerline: Y = -0.0034. Slot hole: Z = 0.9418. D-Ring: Z = 1.140.

# A. Seamless Continuous-Wire D-Ring (Curve with 3D bevel)
dring_curve_data = bpy.data.curves.new('DRingCurve', type='CURVE')
dring_curve_data.dimensions = '3D'
dring_curve_data.bevel_depth = 0.0042
dring_curve_data.bevel_resolution = 6
dring_curve_data.use_fill_caps = True

polyline = dring_curve_data.splines.new('POLY')
pts = [
    (-0.038, -0.0034, 1.140, 1),
    ( 0.038, -0.0034, 1.140, 1),
    ( 0.041, -0.0034, 1.130, 1),
    ( 0.036, -0.0034, 1.100, 1),
    ( 0.016, -0.0034, 1.074, 1),
    ( 0.000, -0.0034, 1.066, 1),
    (-0.016, -0.0034, 1.074, 1),
    (-0.036, -0.0034, 1.100, 1),
    (-0.041, -0.0034, 1.130, 1)
]
polyline.points.add(len(pts) - 1)
for i, pt in enumerate(pts):
    polyline.points[i].co = pt
polyline.use_cyclic_u = True

dring_obj = bpy.data.objects.new('DRing', dring_curve_data)
bpy.context.collection.objects.link(dring_obj)

# B. Precision CNC Swivel Joint (Collar, Eyelet, Barrel with Grooves, Washer)
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.014, depth=0.004,
    vertices=32,
    location=(0, -0.0034, 1.065)
)
swivel_top_collar = bpy.context.active_object
swivel_top_collar.name = "SwivelTopCollar"

bpy.ops.mesh.primitive_torus_add(
    major_radius=0.009, minor_radius=0.004,
    major_segments=32, minor_segments=16,
    location=(0, -0.0034, 1.066),
    rotation=(math.pi / 2, 0, 0)
)
swivel_eyelet = bpy.context.active_object
swivel_eyelet.name = "SwivelEyelet"

bpy.ops.mesh.primitive_cylinder_add(
    radius=0.013, depth=0.022,
    vertices=32,
    location=(0, -0.0034, 1.050)
)
swivel_barrel = bpy.context.active_object
swivel_barrel.name = "SwivelBarrel"

bpy.ops.mesh.primitive_torus_add(
    major_radius=0.0135, minor_radius=0.002,
    major_segments=32, minor_segments=12,
    location=(0, -0.0034, 1.050),
    rotation=(math.pi / 2, 0, 0)
)
swivel_groove = bpy.context.active_object
swivel_groove.name = "SwivelGroove"

bpy.ops.mesh.primitive_cylinder_add(
    radius=0.014, depth=0.005,
    vertices=32,
    location=(0, -0.0034, 1.036)
)
swivel_washer = bpy.context.active_object
swivel_washer.name = "SwivelWasher"

# C. Solid Cast Lobster Clasp Hook Body (Continuous Spine & Ergonomic J-Hook Cradle)
spine_curve_data = bpy.data.curves.new('HookSpineCurve', type='CURVE')
spine_curve_data.dimensions = '3D'
spine_curve_data.bevel_depth = 0.0062
spine_curve_data.bevel_resolution = 6

spine_poly = spine_curve_data.splines.new('POLY')
spine_pts = [
    ( 0.000, -0.0034, 1.036, 1),
    (-0.008, -0.0034, 1.020, 1),
    (-0.016, -0.0034, 0.995, 1),
    (-0.016, -0.0034, 0.965, 1),
    (-0.012, -0.0034, 0.940, 1),
    ( 0.000, -0.0034, 0.932, 1),
    ( 0.012, -0.0034, 0.940, 1),
    ( 0.016, -0.0034, 0.958, 1),
    ( 0.013, -0.0034, 0.968, 1)
]
spine_poly.points.add(len(spine_pts) - 1)
for i, pt in enumerate(spine_pts):
    spine_poly.points[i].co = pt

hook_spine_obj = bpy.data.objects.new('HookSpine', spine_curve_data)
bpy.context.collection.objects.link(hook_spine_obj)

# Smooth Rounded Nose Cap on Hook Tip
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.0062,
    segments=20, ring_count=16,
    location=(0.013, -0.0034, 0.968)
)
claw_tip = bpy.context.active_object

# Transverse Hinge Rivet Pin & Domed Caps
rivet_loc = (-0.008, -0.0034, 0.990)
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0055, depth=0.020,
    vertices=24,
    location=rivet_loc,
    rotation=(math.pi / 2, 0, 0)
)
rivet_pin = bpy.context.active_object

bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.005,
    segments=24, ring_count=16,
    location=(-0.008, 0.006, 0.990)
)
rivet_cap_front = bpy.context.active_object

bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.005,
    segments=24, ring_count=16,
    location=(-0.008, -0.012, 0.990)
)
rivet_cap_back = bpy.context.active_object

# D. Unified Contiguous Mechanical Lever (Knuckle + Bridge + Thumb Paddle + Grip Ridges + Spring Gate Tongue)
# 1. Pivot Knuckle Sleeve (Directly surrounding rivet pin)
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0068, depth=0.016,
    vertices=24,
    location=rivet_loc,
    rotation=(math.pi / 2, 0, 0)
)
lever_knuckle = bpy.context.active_object

# 2. Trigger Bridge (Knuckle to Paddle)
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0048, depth=0.028,
    vertices=16,
    location=(0.005, -0.0034, 1.000),
    rotation=(0, 0.65, 0)
)
lever_bridge = bpy.context.active_object

# 3. Ergonomic Thumb Lever Paddle
bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0.018, -0.0034, 1.010),
    rotation=(0, 0.35, 0)
)
lever_paddle = bpy.context.active_object
lever_paddle.scale = (0.014, 0.008, 0.016)

# 4. Three Tactile Grip Traction Ridges on Thumb Paddle
bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0.018, -0.0034, 1.015),
    rotation=(0, 0.35, 0)
)
ridge1 = bpy.context.active_object
ridge1.scale = (0.004, 0.009, 0.002)

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0.021, -0.0034, 1.018),
    rotation=(0, 0.35, 0)
)
ridge2 = bpy.context.active_object
ridge2.scale = (0.004, 0.009, 0.002)

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0.024, -0.0034, 1.021),
    rotation=(0, 0.35, 0)
)
ridge3 = bpy.context.active_object
ridge3.scale = (0.004, 0.009, 0.002)

# 5. Spring Gate Tongue (Directly from Knuckle to Hook Nose)
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0042, depth=0.032,
    vertices=16,
    location=(0.003, -0.0034, 0.978),
    rotation=(0, -0.58, 0)
)
gate_tongue = bpy.context.active_object

# Convert curves to mesh and join all metal hardware parts into 'clip'
bpy.ops.object.select_all(action='DESELECT')
dring_obj.select_set(True)
bpy.context.view_layer.objects.active = dring_obj
bpy.ops.object.convert(target='MESH')

bpy.ops.object.select_all(action='DESELECT')
hook_spine_obj.select_set(True)
bpy.context.view_layer.objects.active = hook_spine_obj
bpy.ops.object.convert(target='MESH')

hardware_parts = [
    dring_obj, swivel_top_collar, swivel_eyelet, swivel_barrel, swivel_groove, swivel_washer,
    hook_spine_obj, rivet_pin, rivet_cap_front, rivet_cap_back,
    lever_knuckle, lever_bridge, lever_paddle, ridge1, ridge2, ridge3, gate_tongue, claw_tip
]

# Apply location, rotation, scale to all hardware parts before join so origin is (0, 0, 0)
for obj in hardware_parts:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bpy.ops.object.select_all(action='DESELECT')
for obj in hardware_parts:
    obj.select_set(True)

bpy.context.view_layer.objects.active = dring_obj
bpy.ops.object.join()
metal_clip = bpy.context.active_object
metal_clip.name = "clip"
bpy.ops.object.shade_smooth()

print("[Blender] Built 'clip' hardware successfully. Verts:", len(metal_clip.data.vertices))

# -------------------------------------------------------------------------
# 4. Create Sewn Ballistic Fabric Cuff ('clamp') Wrapping D-Ring
# -------------------------------------------------------------------------
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0068, depth=0.076,
    vertices=24,
    location=(0, -0.0034, 1.140),
    rotation=(0, math.pi / 2, 0)
)
cuff_wrap = bpy.context.active_object

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0, -0.0034, 1.154)
)
cuff_body = bpy.context.active_object
cuff_body.scale = (0.076, 0.016, 0.026)

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(-0.034, -0.0034, 1.154)
)
stitch_left = bpy.context.active_object
stitch_left.scale = (0.0025, 0.018, 0.026)

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0.034, -0.0034, 1.154)
)
stitch_right = bpy.context.active_object
stitch_right.scale = (0.0025, 0.018, 0.026)

bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0, -0.0034, 1.154)
)
stitch_cross = bpy.context.active_object
stitch_cross.scale = (0.064, 0.018, 0.0025)

# Apply location, rotation, scale to all cuff parts
cuff_parts = [cuff_wrap, cuff_body, stitch_left, stitch_right, stitch_cross]
for obj in cuff_parts:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bpy.ops.object.select_all(action='DESELECT')
for obj in cuff_parts:
    obj.select_set(True)

bpy.context.view_layer.objects.active = cuff_wrap
bpy.ops.object.join()
cuff_obj = bpy.context.active_object
cuff_obj.name = "clamp"
bpy.ops.object.shade_smooth()

print("[Blender] Built 'clamp' cuff successfully. Verts:", len(cuff_obj.data.vertices))

# -------------------------------------------------------------------------
# 5. Create CAD Tactical Quick-Release Buckle ('buckle') Centered at (0, 0, 0)
# -------------------------------------------------------------------------
# Main Outer Chassis
bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0, 0, 0)
)
buckle_body = bpy.context.active_object
buckle_body.scale = (0.22, 0.040, 0.16)

# Left Side-Release Wing & 3 Traction Teeth
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.114, 0, -0.01))
tab_left = bpy.context.active_object
tab_left.scale = (0.020, 0.038, 0.09)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.126, 0, 0.015))
lt1 = bpy.context.active_object
lt1.scale = (0.006, 0.034, 0.012)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.126, 0, -0.010))
lt2 = bpy.context.active_object
lt2.scale = (0.006, 0.034, 0.012)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.126, 0, -0.035))
lt3 = bpy.context.active_object
lt3.scale = (0.006, 0.034, 0.012)

# Right Side-Release Wing & 3 Traction Teeth
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.114, 0, -0.01))
tab_right = bpy.context.active_object
tab_right.scale = (0.020, 0.038, 0.09)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.126, 0, 0.015))
rt1 = bpy.context.active_object
rt1.scale = (0.006, 0.034, 0.012)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.126, 0, -0.010))
rt2 = bpy.context.active_object
rt2.scale = (0.006, 0.034, 0.012)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.126, 0, -0.035))
rt3 = bpy.context.active_object
rt3.scale = (0.006, 0.034, 0.012)

# Top Dual-Webbing Slots & Center Divider Post (Z = +0.078)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.045, 0, 0.078))
t_bar_l = bpy.context.active_object
t_bar_l.scale = (0.070, 0.036, 0.014)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.045, 0, 0.078))
t_bar_r = bpy.context.active_object
t_bar_r.scale = (0.070, 0.036, 0.014)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.078))
t_div = bpy.context.active_object
t_div.scale = (0.018, 0.038, 0.016)

# Bottom Single-Webbing Exit Slot Bar (Z = -0.078)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -0.078))
b_bar = bpy.context.active_object
b_bar.scale = (0.14, 0.036, 0.014)

# Center Faceplate Frame & Recessed Plate
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.021, -0.008))
fp_frame = bpy.context.active_object
fp_frame.scale = (0.11, 0.004, 0.065)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.0225, -0.008))
fp_inner = bpy.context.active_object
fp_inner.scale = (0.09, 0.002, 0.050)

# Cyan Accent Status Bar
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.0235, -0.042))
accent_bar = bpy.context.active_object
accent_bar.scale = (0.045, 0.003, 0.006)

buckle_parts = [
    buckle_body, tab_left, lt1, lt2, lt3, tab_right, rt1, rt2, rt3,
    t_bar_l, t_bar_r, t_div, b_bar, fp_frame, fp_inner, accent_bar
]
for obj in buckle_parts:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bpy.ops.object.select_all(action='DESELECT')
for obj in buckle_parts:
    obj.select_set(True)

bpy.context.view_layer.objects.active = buckle_body
bpy.ops.object.join()
buckle_obj = bpy.context.active_object
buckle_obj.name = "buckle"
bpy.ops.object.shade_smooth()

print("[Blender] Built 'buckle' successfully. Verts:", len(buckle_obj.data.vertices))

# -------------------------------------------------------------------------
# 6. Setup PBR Materials & Export to GLB
# -------------------------------------------------------------------------
# Metal Material for clip
metal_mat = bpy.data.materials.new(name="metal_hardware")
metal_mat.use_nodes = True
bsdf = metal_mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.86, 0.92, 0.98, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.98
    bsdf.inputs["Roughness"].default_value = 0.12
metal_clip.data.materials.append(metal_mat)

# Fabric Material for clamp
fabric_mat = bpy.data.materials.new(name="fabric_cuff")
fabric_mat.use_nodes = True
bsdf = fabric_mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.04, 0.06, 0.12, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.10
    bsdf.inputs["Roughness"].default_value = 0.82
cuff_obj.data.materials.append(fabric_mat)

# Polymer Material for buckle
buckle_mat = bpy.data.materials.new(name="tactical_polymer")
buckle_mat.use_nodes = True
bsdf = buckle_mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.03, 0.05, 0.10, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.08
    bsdf.inputs["Roughness"].default_value = 0.86
buckle_obj.data.materials.append(buckle_mat)

# Export to GLB
out_glb = 'C:/codaxiom/apps/custom-enterprise/ridhoazfa/assets/3d/card-blender.glb'
os.makedirs(os.path.dirname(out_glb), exist_ok=True)

# Select all export objects: card, clip, clamp, buckle
bpy.ops.object.select_all(action='DESELECT')
card_obj.select_set(True)
metal_clip.select_set(True)
cuff_obj.select_set(True)
buckle_obj.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True
)

print(f"[Blender] Successfully exported CAD-grade model to: {out_glb}")
bpy.ops.wm.quit_blender()
