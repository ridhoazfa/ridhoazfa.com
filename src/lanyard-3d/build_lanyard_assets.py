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

# Clear embedded 2.19 MB unused texture from card material to eliminate bloat
card_obj.data.materials.clear()
base_mat = bpy.data.materials.new(name="base")
base_mat.use_nodes = True
bsdf = base_mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.05, 0.07, 0.12, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.18
    bsdf.inputs["Metallic"].default_value = 0.05
card_obj.data.materials.append(base_mat)

# Remove all unused image datablocks from blender file
for img in list(bpy.data.images):
    bpy.data.images.remove(img, do_unlink=True)

print("[Blender] Preserved card mesh successfully at (0, 0, 0):", card_obj.name)

# -------------------------------------------------------------------------
# 3. Create Precision CNC Swivel Snap Hook ('clip') Looping Through Card Slot
# -------------------------------------------------------------------------
# Card slot hole center: X = 0.000, Y = -0.0034, Z = 0.9446
# Slot bounds: X[-0.0229, 0.0229], Y[-0.0054, -0.0014], Z[0.9160, 0.9732]
# Hook wire radius: 0.0036. Passes smoothly through slot hole from front to back.

# A. 3D Sculpted Continuous Snap Hook Body (Curves in X and Y, loops through slot)
hook_curve = bpy.data.curves.new('HookCurve', type='CURVE')
hook_curve.dimensions = '3D'
hook_curve.bevel_depth = 0.0036
hook_curve.bevel_resolution = 8
hook_curve.use_fill_caps = True

spline = hook_curve.splines.new('BEZIER')
spline.bezier_points.add(4)
pts = [
    (( 0.000, -0.0034, 1.036), ( 0.000, -0.0034, 1.044), (-0.008, -0.008, 1.018)),
    ((-0.018, -0.0140, 0.984), (-0.014, -0.0120, 1.010), (-0.020, -0.015, 0.955)),
    ((-0.008, -0.0080, 0.934), (-0.016, -0.0120, 0.936), ( 0.000, -0.002, 0.932)),
    (( 0.010,  0.0080, 0.946), ( 0.004,  0.0020, 0.934), ( 0.014,  0.008, 0.962)),
    (( 0.016,  0.0080, 0.978), ( 0.016,  0.0080, 0.968), ( 0.016,  0.008, 0.984))
]
for i, (co, h_l, h_r) in enumerate(pts):
    bp = spline.bezier_points[i]
    bp.co = co
    bp.handle_left = h_l
    bp.handle_right = h_r
    bp.handle_left_type = 'ALIGNED'
    bp.handle_right_type = 'ALIGNED'

hook_spine_obj = bpy.data.objects.new('HookSpine', hook_curve)
bpy.context.collection.objects.link(hook_spine_obj)

# B. Rounded Nose Cap on Hook Tip
bpy.ops.mesh.primitive_uv_sphere_add(
    radius=0.0036,
    segments=20, ring_count=16,
    location=(0.016, 0.0080, 0.978)
)
claw_tip = bpy.context.active_object

# C. Spring Gate Arm bridging from upper spine to hook tip
gate_curve = bpy.data.curves.new('GateCurve', type='CURVE')
gate_curve.dimensions = '3D'
gate_curve.bevel_depth = 0.0024
gate_curve.bevel_resolution = 6
gate_curve.use_fill_caps = True
g_spline = gate_curve.splines.new('POLY')
g_pts = [
    (-0.010, -0.010, 0.996, 1),
    ( 0.014,  0.006, 0.978, 1)
]
g_spline.points.add(1)
g_spline.points[0].co = g_pts[0]
g_spline.points[1].co = g_pts[1]
gate_tongue = bpy.data.objects.new('GateTongue', gate_curve)
bpy.context.collection.objects.link(gate_tongue)

# D. Tactile Thumb Lever on Gate Arm
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0034, depth=0.010,
    vertices=16,
    location=(-0.003, -0.006, 0.994),
    rotation=(0, math.radians(45), 0)
)
thumb_lever = bpy.context.active_object

# E. Lathe-Turned CNC Swivel Barrel & Accent Groove Rings
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.0085, depth=0.014,
    vertices=32,
    location=(0, -0.0034, 1.043)
)
swivel_barrel = bpy.context.active_object

bpy.ops.mesh.primitive_torus_add(
    major_radius=0.0090, minor_radius=0.0016,
    major_segments=32, minor_segments=16,
    location=(0, -0.0034, 1.043),
    rotation=(0, 0, 0)
)
swivel_groove = bpy.context.active_object

# F. Top Swivel Eyelet (Oval Ring holding strap webbing)
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.015, minor_radius=0.0030,
    major_segments=32, minor_segments=16,
    location=(0, -0.0034, 1.060),
    rotation=(0, 0, 0)
)
swivel_eyelet = bpy.context.active_object
swivel_eyelet.scale = (1.6, 0.8, 1.0)

# Convert curves to meshes
bpy.ops.object.select_all(action='DESELECT')
hook_spine_obj.select_set(True)
bpy.context.view_layer.objects.active = hook_spine_obj
bpy.ops.object.convert(target='MESH')

bpy.ops.object.select_all(action='DESELECT')
gate_tongue.select_set(True)
bpy.context.view_layer.objects.active = gate_tongue
bpy.ops.object.convert(target='MESH')

hardware_parts = [
    swivel_eyelet, swivel_barrel, swivel_groove,
    hook_spine_obj, claw_tip, gate_tongue, thumb_lever
]

# Apply transforms to all parts
for obj in hardware_parts:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# Join all metal hardware parts into 'clip'
bpy.ops.object.select_all(action='DESELECT')
for obj in hardware_parts:
    obj.select_set(True)

bpy.context.view_layer.objects.active = swivel_barrel
bpy.ops.object.join()
metal_clip = bpy.context.active_object
metal_clip.name = "clip"
bpy.ops.object.shade_smooth()

print("[Blender] Built CNC swivel snap hook 'clip' successfully. Verts:", len(metal_clip.data.vertices))

# -------------------------------------------------------------------------
# 4. Create Webbing Crimp Ferrule Clamp ('clamp') Wrapping Swivel Eyelet
# -------------------------------------------------------------------------
# Sits flush over the top of the swivel eyelet at Z = 1.074
bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0, -0.0034, 1.074)
)
cuff_body = bpy.context.active_object
cuff_body.scale = (0.054, 0.013, 0.018)

# Subtle center crimp groove
bpy.ops.mesh.primitive_cube_add(
    size=1.0,
    location=(0, -0.0034, 1.074)
)
cuff_groove = bpy.context.active_object
cuff_groove.scale = (0.056, 0.014, 0.004)

cuff_parts = [cuff_body, cuff_groove]
for obj in cuff_parts:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bpy.ops.object.select_all(action='DESELECT')
for obj in cuff_parts:
    obj.select_set(True)

bpy.context.view_layer.objects.active = cuff_body
bpy.ops.object.join()
cuff_obj = bpy.context.active_object
cuff_obj.name = "clamp"
bpy.ops.object.shade_smooth()

print("[Blender] Built crimp ferrule 'clamp' successfully. Verts:", len(cuff_obj.data.vertices))

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

# Export to GLB (both card-blender.glb and active card.glb)
import shutil
out_glb = 'C:/codaxiom/apps/custom-enterprise/ridhoazfa/assets/3d/card-blender.glb'
target_glb = 'C:/codaxiom/apps/custom-enterprise/ridhoazfa/assets/3d/card.glb'
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

shutil.copyfile(out_glb, target_glb)
print(f"[Blender] Successfully exported CAD-grade model to: {out_glb} and {target_glb}")
bpy.ops.wm.quit_blender()
