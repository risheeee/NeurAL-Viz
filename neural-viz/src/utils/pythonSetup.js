export const SETUP_CODE = `
import json

class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def get_linked_list_state():        # inspect all global variables and filter objects that are instances of the class 'Node'
    nodes_data = []
    edges_data = []
    visited_ids = set()

    def get_id(obj):
        return str(id(obj))

    global_vars = list(globals().items())

    for name, obj in global_vars:       # if we find a node variable, then traverse and build the graph
        if isinstance(obj, Node):
            curr = obj
            while curr and get_id(curr) not in visited_ids:
                uuid = get_id(curr)
                visited_ids.add(uuid)

                nodes_data.append({
                    "id": uuid,
                    "data": {"label" : str(curr.val)},
                    "position": {"x": len(visited_ids) * 150, "y": 100}
                })

                if curr.next:
                    next_uid = get_id(curr.next)
                    edges_data.append({
                        "id": f"{uuid} -> {next_uid}",
                        "source": uuid,
                        "target": next_uid,
                        "animated": True
                    })

                curr = curr.next

    return json.dumps({"nodes": nodes_data, "edges": edges_data})
`;