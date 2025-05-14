class Circle():
    radius = 5 

    def get_area(self, radius):
        pi = 3.14
        area = pi*radius**2

        print(f'El área del circulo es {area}')


circle_area = Circle()

circle_area.get_area(circle_area.radius)


