from repositories.users_repository import UserRepository
from repositories.address_repository import AddressRepository
from repositories.cars_repository import CarRepository

user_repo = UserRepository()
address_repo = AddressRepository()
car_repo = CarRepository()

#users
user_repo.create_user(
    full_name='Sebastián Berríos', 
    email='berriossebas@email.com', 
    username='sebasb', 
    password='123sebas'
    )

user_repo.update_user(1,{
    "full_name": 'Sebastián Berríos Aguilera',
    "email": 'sebasberrios@email.com'
})

user_repo.get_all_users()

user_repo.delete_user(1)

#addresses
address_repo.create_address(
    address="11 AVENUE ELISEE CUSENIER",
    user_id=2
)

address_repo.update_address(1,{
    "address": '1008 OAK STREET'
})

address_repo.get_all_addresses()

address_repo.delete_address(1)

#cars
car_repo.create_car(
    make="Mazda",
    model="CX-7",
    year=2011,
    user_id=None
)
#Se asocia con un usuario
car_repo.update_car(1,{
    "user_id": 2
})

car_repo.get_all_cars()

car_repo.delete_car(1)

