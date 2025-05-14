class Person():
    def __init__(self, name):
        self.name = name
    
class Bus():
    max_passangers = 20
    passangers = []

    def add_passanger(self, person):
        if len(self.passangers) < self.max_passangers:
            self.passangers.append(person)
            print(f'{person.name} ha subido al bus!.')
        
        else:
            print('El bus está lleno!.')
        
    def rm_passanger(self, person=None):
        if not self.passangers:
            print('El bus va vacío.')
            return

        if person:
            if person in self.passangers:
                self.passangers.remove(person)
                print(f'{person.name} ha bajado del bus.')
            else:
                print(f'{person.name} no está en el bus.')
        else:
            removed = self.passangers.pop()
            print(f'{removed.name} ha bajado del bus.')

my_bus = Bus()

p1 = Person('Sebas')

my_bus.add_passanger(p1)
my_bus.rm_passanger()