class BankAccount:
    def __init__(self):
        self.balance = 0

    def add_amount(self, amount):
        self.balance += amount
        print(f'\nSe ha depositado {amount} a la cuenta. Saldo actual: {self.balance}')


    def substract_amount(self, amount):
        if self.balance - amount < 0:
            print(f'\nError: Fondos insuficientes. Saldo actual: {self.balance}')

        else:
            self.balance -= amount 
            print(f'\nSe ha retirado {amount} de la cuenta. Saldo actual: {self.balance}')


class SavingAccount(BankAccount):
    min_balance = 250

    def create_account(self):
        print(f'Cuenta creada!. Saldo actual {self.balance}')


    def verify_balance(self):
        if self.balance - amount < self.min_balance:
            print(f'\nError: El balance queda por debajo del mínimo.')
            return True
        
        else:
            return False
    



my_account = SavingAccount()
my_account.create_account()

while True:
    action = input('\nIngrese "1" si desea depositar dinero o "2" si desea retirar o "0" si desea salir: ')
    if action == '1':
        amount = int(input('Ingrese la cantidad que desea depositar: '))
        my_account.add_amount(amount)
         

    elif action == '2':
        amount = int(input('Ingrese la cantidad que desea retirar: '))
        if not my_account.verify_balance():
            my_account.substract_amount(amount)    

    elif action == '0':
        print('Saliendo...')
        break

    else:
        print('Opción inválida.')