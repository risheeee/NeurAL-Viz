export const SETUP_CODE = `
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# This function will run after user code to capture state
def get_linked_list_state():
    nodes = []
    edges = []
    # Logic to traverse memory and find nodes will go here later
    return {"nodes": nodes, "edges": edges}
`;