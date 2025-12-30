export const SETUP_CODE = `
import json
import ast

_HISTORY = []

class Node:
    def __init__(self, val=0, next=None, prev=None):
        self.val = val
        self.next = next
        self.prev = prev


# ===============================
# YOUR ORIGINAL VISUALIZER LOGIC
# ===============================

def get_linked_list_state():
    nodes_data = []
    edges_data = []
    start_candidates = []
    id_to_vars = {}
    global_vars = list(globals().items())
    
    all_nodes = []
    for name, obj in global_vars:
        if isinstance(obj, Node) and not name.startswith('__'):
            uid = str(id(obj))
            if uid not in id_to_vars:
                id_to_vars[uid] = []
            id_to_vars[uid].append(name)
            all_nodes.append(obj)

    targets = set()
    for node in all_nodes:
        if node.next:
            targets.add(str(id(node.next)))

    seen_objs = set()
    for name, obj in global_vars:
        if isinstance(obj, Node) and not name.startswith('__'):
            uid = str(id(obj))
            if uid not in targets or name == 'head':
                if uid not in seen_objs:
                    start_candidates.append((name, obj))
                    seen_objs.add(uid)

    if not start_candidates and all_nodes:
        name = id_to_vars[str(id(all_nodes[0]))][0]
        start_candidates.append((name, all_nodes[0]))

    def sort_priority(item):
        name, _ = item
        if name == 'head': return 0
        if name.startswith('l') and name[1:].isdigit(): return 1
        return 2
        
    start_candidates.sort(key=sort_priority)
    
    positioned_nodes = {}
    current_y = 100

    for name, start_node in start_candidates:
        uid = str(id(start_node))
        if uid in positioned_nodes:
            continue
            
        curr = start_node
        curr_x = 0
        
        while curr:
            curr_uid = str(id(curr))
            
            if curr_uid not in positioned_nodes:
                positioned_nodes[curr_uid] = {'x': curr_x, 'y': current_y}
                pointers = id_to_vars.get(curr_uid, [])
                label_text = str(curr.val)
                
                nodes_data.append({
                    "id": curr_uid,
                    "data": { "label": label_text, "pointers": pointers },
                    "position": { "x": curr_x, "y": current_y }
                })
                curr_x += 150 
            
            if hasattr(curr, 'prev') and curr.prev:
                prev_uid = str(id(curr.prev))
                if prev_uid in positioned_nodes:
                    edges_data.append({
                        "id": f"{curr_uid}-prev->{prev_uid}",
                        "source": curr_uid,
                        "target": prev_uid,
                        "sourceHandle": "prev-src",
                        "targetHandle": "prev-tgt",
                        "animated": True,
                        "style": { "stroke": "#FFD700", "strokeDasharray": "5,5" }
                    })

            if curr.next:
                next_uid = str(id(curr.next))
                
                edge_type = "straight"
                edge_style = { "stroke": "#4ADE80" }
                src_handle = "next-src"
                tgt_handle = "next-tgt"
                
                if next_uid in positioned_nodes:
                    target_x = positioned_nodes[next_uid]['x']
                    source_x = positioned_nodes[curr_uid]['x']
                    if target_x <= source_x:
                        edge_style = { "stroke": "#ff0055", "strokeWidth": 2 }
                        edge_type = "smoothstep"
                        src_handle = "t-src"
                        tgt_handle = "t-tgt"

                edges_data.append({
                    "id": f"{curr_uid}->{next_uid}",
                    "source": curr_uid,
                    "target": next_uid,
                    "sourceHandle": src_handle,
                    "targetHandle": tgt_handle,
                    "animated": True,
                    "type": edge_type,
                    "style": edge_style,
                })
                
                if next_uid in positioned_nodes:
                    break
                    
                curr = curr.next
            else:
                break 

        current_y += 150

    return {"nodes": nodes_data, "edges": edges_data}


# ===============================
# 🔴 NEW: AST SNAPSHOT MECHANISM
# ===============================

def __snapshot__():
    _HISTORY.append(get_linked_list_state())


class SnapshotInjector(ast.NodeTransformer):
    def visit_Assign(self, node):
        return [node, ast.Expr(value=ast.Call(
            func=ast.Name(id="__snapshot__", ctx=ast.Load()),
            args=[], keywords=[]
        ))]

    def visit_AugAssign(self, node):
        return [node, ast.Expr(value=ast.Call(
            func=ast.Name(id="__snapshot__", ctx=ast.Load()),
            args=[], keywords=[]
        ))]


def run_user_code(code):
    global _HISTORY
    _HISTORY = []
    tree = ast.parse(code)
    tree = SnapshotInjector().visit(tree)
    ast.fix_missing_locations(tree)
    exec(compile(tree, "<instrumented>", "exec"), globals())


def get_history_json():
    return json.dumps(_HISTORY)
`;
