class Node:
    data: str
    next: "Node"

    def __init__(self, data, next=None):
        self.data = data
        self.next = next

class Stack:
    top: Node

    def __init__(self, top):
        self.top = top

    def print_structure(self):
        current_node = self.top
        while current_node is not None:
            print(current_node.data)
            current_node = current_node.next

    def push(self, new_node):
        new_node.next = self.top
        self.top = new_node

    def pop(self):
        if self.top:
            popped = self.top
            self.top = self.top.next
            print(f'Se ha retirado: {popped.data}')
        else:
            print('Stack vacío.')
            
first_node = Node('C')
my_stack = Stack(first_node)

my_stack.print_structure()

print('\nPush')
second_node = Node('B')
my_stack.push(second_node)

my_stack.print_structure()

print('\nPush')
third_node = Node('A')
my_stack.push(third_node)

my_stack.print_structure()

print('\nPop')
my_stack.pop()
my_stack.pop()
my_stack.pop()
my_stack.pop()

my_stack.print_structure()

