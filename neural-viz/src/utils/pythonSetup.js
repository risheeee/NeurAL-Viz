export const SETUP_CODE = `
import json
import inspect
import sys

# def clean_user_memory():
#     safe_keys = {'Node', 'get_linked_list_state', 'clear_user_memory', 'json', 'inspect', 'sys', '__name__', '__builtins__', '__doc__', '__package__', '__loader__', '__spec__'}
#     keys_to_delete = [key for key in globals().keys() if key not in safe_keys]
#     for key in keys_to_delete:
#         del globals()[key]

# clean_user_memory() 

class Node:
    def __init__(self, val=0, next=None, prev=None):
        self.val = val
        self.next = next
        self.prev = prev

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
        
    start_candidates.sort(key = sort_priority)
    
    # 3. LANED LAYOUT
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
            
            # A. POSITIONING
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

            # C. NEXT POINTER (Forward)
            if curr.next:
                next_uid = str(id(curr.next))
                
                edge_type = "straight" 
                edge_style = { "stroke": "#4ADE80" }
                src_handle = "next-src"
                tgt_handle = "next-tgt"
                
                # Cycle / Backward Detection
                if next_uid in positioned_nodes:
                     target_x = positioned_nodes[next_uid]['x']
                     source_x = positioned_nodes[curr_uid]['x']
                     
                     if target_x <= source_x:
                         edge_style = { "stroke": "#ff0055", "strokeWidth": 2 } # Red
                         edge_type = "smoothstep" # curved
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

    return json.dumps({"nodes": nodes_data, "edges": edges_data})
`;