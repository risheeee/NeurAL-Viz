export const SETUP_CODE = `
import json
import inspect
import sys

def clean_user_memory():
    safe_keys = {'Node', 'get_linked_list_state', 'clear_user_memory', 'json', 'inspect', 'sys', '__name__', '__builtins__', '__doc__', '__package__', '__loader__', '__spec__'}
    keys_to_delete = [key for key in globals().keys() if key not in safe_keys]
    for key in keys_to_delete:
        del globals()[key]

clean_user_memory() 

class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def get_linked_list_state():
    nodes_data = []
    edges_data = []
    visited_ids = set()
    
    id_to_vars = {}
    global_vars = list(globals().items())

    start_candidates = []
    
    for name, obj in global_vars:
        if isinstance(obj, Node) and not name.startswith('__'):
            uid = str(id(obj))
            if uid not in id_to_vars:
                id_to_vars[uid] = []
            id_to_vars[uid].append(name)
            start_candidates.append((name, obj))

    # i was facing a problem when working with the labels, they were not appearing in the correct order in the linked list. it was not traversing from 'head' for some reason

    def sort_priority(item):
        name, _ = item
        if name == 'head': return 0      
        if name.startswith('l') and name[1:].isdigit(): return 1 
        return 2 
        
    start_candidates.sort(key = sort_priority)
    
    queue = [obj for name, obj in start_candidates]

    current_x = 0
    processed = set()
    
    # BFS traversal
    while queue:
        curr = queue.pop(0)
        uid = str(id(curr))
        
        if uid in processed:
            continue
        processed.add(uid)
        
        # Get pointers
        pointers = id_to_vars.get(uid, [])
        label_text = str(curr.val)
        
        nodes_data.append({
            "id": uid,
            "data": { "label": label_text, "pointers": pointers },
            "position": { "x": current_x, "y": 100 }
        })
        
        current_x += 150 

        if curr.next:
            next_uid = str(id(curr.next))
            edges_data.append({
                "id": f"{uid}->{next_uid}",
                "source": uid,
                "target": next_uid,
                "animated": True,
                "style": { "stroke": "#555" }
            })
            queue.insert(0, curr.next)

    return json.dumps({"nodes": nodes_data, "edges": edges_data})
`;