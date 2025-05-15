class Head:
    def __init__(self):
        self.eyes = 2
        self.has_mouth = True


class Arm:
    def __init__(self, hand):
        self.hand = hand


class Hand:
    def __init__(self):
        self.fingers = 5


class Leg:
    def __init__(self, foot):
        self.foot = foot


class Foot:
    def __init__(self):
        self.size = 42


class Torso:
    def __init__(self, head, right_arm, left_arm):
        self.head = head
        self.right_arm = right_arm
        self.left_arm = left_arm


class Human:
    def __init__(self):
        # Hands
        right_hand = Hand()
        left_hand = Hand()

        # Arms
        self.right_arm = Arm(right_hand)
        self.left_arm = Arm(left_hand)

        # Head
        head = Head()

        # Torso
        self.torso = Torso(head, self.right_arm, self.left_arm)

        # Feet
        right_foot = Foot()
        left_foot = Foot()

        # Legs
        self.right_leg = Leg(right_foot)
        self.left_leg = Leg(left_foot)

    def create_human(self):
        print("Humano creado con cabeza, torso, brazos (con manos) y piernas (con pies).")


person = Human()
person.create_human()

    