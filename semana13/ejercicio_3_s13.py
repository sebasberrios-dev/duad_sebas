from datetime import date


class User:
    date_of_birth: date

    def __init__(self, date_of_birth):
        self.date_of_birth = date_of_birth

    @property
    def age(self):
        today = date.today()
        return (
            today.year
            - self.date_of_birth.year
            - (
                (today.month, today.day)
                < (self.date_of_birth.month, self.date_of_birth.day)
            )
        )

#decorador 
def is_adult(func):
    def wrapper(user):
        if user.age < 18:
            raise ValueError(
                'El usuario es menor de edad.'
                )
        func(user)

    return wrapper

@is_adult
def enter_nightclub(user):
    print(f'{user.age} años. El usuario puede entrar')

try:
    adult_user = User(date(2000, 5, 16))
    enter_nightclub(adult_user)

    no_adult_user = User(date(2008, 7, 10))
    enter_nightclub(no_adult_user)

except ValueError as e:
    print(e)