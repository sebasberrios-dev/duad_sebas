class Head():
    def __init__(self):
        pass


class Torso():
    def __init__(self, head, right_arm, left_arm):
        self.head = head
        self.right_arm = right_arm
        self.left_arm = left_arm


class Arm():
    def __init__(self, hand):
        self.hand = hand


class Hand():
    def __init__(self):
        pass


class Leg():
    def __init__(self, foot):
        self.foot = foot 


class Feet():
    def __init__(self):
        pass


class Human():
    def __init__(self):
        # Manos
        right_hand = Hand()
        left_hand = Hand()

        # Brazos
        self.right_arm = Arm(right_hand)
        self.left_arm = Arm(left_hand)

        # Cabeza 
        head = Head()

        # Torso
        self.torso = Torso(head, self.right_arm, self.left_arm)

        # Pies
        right_foot = Feet()
        left_foot = Feet()

        # Piernas
        self.right_leg = Leg(right_foot)
        self.left_leg = Leg(left_foot)

    def create_human(self):
        print('Humano creado con cabeza, torso, brazos (con manos) y piernas (con pies)')

person = Human()

person.create_human()

    