from abc import ABC, abstractmethod
import math
class Shape(ABC):
    @abstractmethod
    def calculate_perimeter(self):
        pass

    @abstractmethod
    def calculate_area(self):
        pass


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    

    def calculate_perimeter(self):
        return round(2 * math.pi * self.radius)


    def calculate_area(self):
        return round(math.pi * self.radius ** 2)


class Square(Shape):
    def __init__(self, side):
        self.side = side 
    

    def calculate_perimeter(self):
        return self.side * 4


    def calculate_area(self):
        return self.side ** 2

class Rectangle(Shape):
    def __init__(self, length, width):
        self.length = length
        self.width = width

    
    def calculate_perimeter(self):
        return 2 * (self.length + self.width)


    def calculate_area(self):
        return self.length * self.width
    

# Circulo

radius = int(input('Ingrese el radio del circulo: '))

circle = Circle(radius)

print(f'Área del circulo: {circle.calculate_area()}\n'
      f'Perímetro del circulo: {circle.calculate_perimeter()}\n')

# Cuadrado
side = int(input('Ingrese la medida del lado del cuadrado: '))

square = Square(side)

print(f'Área del cuadrado: {square.calculate_area()}\n'
      f'Perímetro del cuadrado: {square.calculate_perimeter()}\n')

# Rectángulo
length = int(input('Ingrese el largo del rectángulo: '))
width = int(input('Ingrese el ancho del rectangulo: '))

rectangle = Rectangle(length, width)

print(f'Área del rectángulo: {rectangle.calculate_area()}\n'
      f'Perímetro del rectángulo: {rectangle.calculate_perimeter()}')