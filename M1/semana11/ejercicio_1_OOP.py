class Circle:
    def __init__(self, radius):
        self.radius = radius

    def get_area(self, radius):
        pi = 3.14
        area = pi*radius**2

        print(f'El área del circulo es {area}')

radius = int(input('Ingrese el radio del circulo: '))

circle_area = Circle(radius)

circle_area.get_area(circle_area.radius)


