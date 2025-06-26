class Node:
    def __init__(self, data):
        self.data = data
        self.next = None 
        self.prev = None

class Deque:
    def __init__(self, first_node=None):
        self.head = first_node
        self.tail = first_node
    
    def push_left(self, new_node):
        if self.head is not None:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        else:
            self.head = self.tail = new_node
    
    def push_right(self, new_node):
        if self.tail is not None:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node
        else:
            self.head = self.tail = new_node

    def pop_left(self):
        if self.head is not None:
            removed_data = self.head.data
            self.head = self.head.next
            print(f'Se eliminó el primer elemento: {removed_data}')
            if self.head is not None:
                self.head.prev = None
            else:
                self.tail = None
        else:
            print('DEQUE vacío')
        
    def pop_right(self):
        if self.tail is not None:
            removed_data = self.tail.data
            self.tail = self.tail.prev
            print(f'Se eliminó el último elemento: {removed_data}')
            if self.tail is not None:
                self.tail.next = None
            else:
                self.head = None
        else:
            print('DEQUE vacío')

    
    def print_structure(self):
        current_node = self.head
        while(current_node is not None):
            print(current_node.data)
            current_node = current_node.next


print('Estructura inicial')        
first_node = Node('B')
my_deque = Deque(first_node)
my_deque.print_structure()

print('\nPush al inicio')
second_node = Node('A')
my_deque.push_left(second_node)
my_deque.print_structure()

print('\nPush al final')
third_node = Node('C')
my_deque.push_right(third_node)
my_deque.print_structure()

print('\nPop al inicio')
my_deque.pop_left()
my_deque.print_structure()

print('\nPop al final')
my_deque.pop_right()
my_deque.print_structure()

print('\nPop al último elemento y se vacía el DEQUE')
my_deque.pop_right()
my_deque.pop_right()
my_deque.pop_left()
my_deque.print_structure()







    