class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
    
class BinaryTree:
    def __init__(self, root):
        self.root = root

    def print_in_order(self, node):
        if node is not None:
            self.print_in_order(node.left)
            print(node.data)
            self.print_in_order(node.right)
    
parent_node = Node('A')
first_child_node = Node('B')
second_child_node = Node('C')

parent_node.left = first_child_node
parent_node.right = second_child_node

my_tree = BinaryTree(parent_node)

my_tree.print_in_order(my_tree.root)


        