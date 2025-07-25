class TablesRepository:
    def __init__(self, db_manager):
        self.db_manager = db_manager
    
    def create_user_table(self):
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS lyfter_car_rental.users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                username VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL,
                birthdate DATE NOT NULL,
                user_status VARCHAR(10) NOT NULL CHECK (user_status IN ('per day', 'defaulter'))
                );
            """
            
            
            self.db_manager.execute_query(create_table_query)
            
            users = [
                ('Derry Foffano', 'dfoffano0@jigsy.com', 'dfoffano0', 'gH20DD', '2025-05-31', 'per day'),
                ('Dorian Cromley', 'dcromley1@si.edu', 'dcromley1', 'uF0DbyKEx', '2025-02-25', 'per day'),
                ('Byron Monteath', 'bmonteath2@chronoengine.com', 'bmonteath2', 'pH9FOJG*D', '2024-08-03', 'per day'),
                ('Garnet Nyssens', 'gnyssens3@dailymotion.com', 'gnyssens3', 'bZ7eZX=EN.y', '2025-05-09', 'per day'),
                ('Esra Segebrecht', 'esegebrecht4@studiopress.com', 'esegebrecht4', 'xZ7myjI9VtM', '2024-10-24', 'per day'),
                ('Piper MacCardle', 'pmaccardle5@devhub.com', 'pmaccardle5', 'uY7#E~G<eg', '2025-05-02', 'per day'),
                ('Cristiano Braben', 'cbraben6@foxnews.com', 'cbraben6', 'kO1fKBcpi9NYip.L', '2025-01-30', 'per day'),
                ('Catarina Newvill', 'cnewvill7@tuttocitta.it', 'cnewvill7', 'uF8nCl&!Gau%', '2025-03-18', 'per day'),
                ('Alisun Bleas', 'ableas8@miibeian.gov.cn', 'ableas8', 'fI2!yz7eL8*4', '2024-12-09', 'per day'),
                ('Braden Benoey', 'bbenoey9@ft.com', 'bbenoey9', 'wU5jG27', '2025-04-27', 'per day'),
                ('Waite Verbrugge', 'wverbruggea@senate.gov', 'wverbruggea', 'nI9+HHI_6_<m~', '2025-07-01', 'per day'),
                ('Martyn Morphew', 'mmorphewb@sciencedirect.com', 'mmorphewb', 'gH7BEBn&Zsw_G@', '2024-10-16', 'per day'),
                ('Averil Tullis', 'atullisc@microsoft.com', 'atullisc', 'eG5ZZoS8*W7I', '2025-01-06', 'per day'),
                ('Waverly Shorto', 'wshortod@ameblo.jp', 'wshortod', 'qS54Ngmy', '2025-03-05', 'per day'),
                ('Burch Trahear', 'btraheare@deviantart.com', 'btraheare', 'kA4a@pWZ_.(2', '2025-02-05', 'per day'),
                ('Brigitta Bramer', 'bbramerf@chron.com', 'bbramerf', 'lT06REJj', '2024-11-29', 'per day'),
                ('Mead Rubbens', 'mrubbensg@friendfeed.com', 'mrubbensg', 'hB8NuztUn*BiYNk', '2025-05-03', 'per day'),
                ('Antonietta Rittmeyer', 'arittmeyerh@spiegel.de', 'arittmeyerh', 'xT3EAuo', '2024-08-24', 'per day'),
                ('Mohandas Postans', 'mpostansi@4shared.com', 'mpostansi', 'dP9RZQx', '2025-03-08', 'per day'),
                ('Vonny Bestiman', 'vbestimanj@blogger.com', 'vbestimanj', 'sW8g06g', '2025-06-17', 'per day'),
                ('Dalton Saintpierre', 'dsaintpierrek@blogger.com', 'dsaintpierrek', 'xO222_JD~', '2024-09-14', 'per day'),
                ('Carolynn Kenson', 'ckensonl@usda.gov', 'ckensonl', 'oN06,BtD_~OZ?9Ay', '2025-04-30', 'per day'),
                ('Alonso Rotchell', 'arotchellm@cisco.com', 'arotchellm', 'lM5a_=SFJ?', '2024-12-07', 'per day'),
                ('Darya Trownson', 'dtrownsonn@vimeo.com', 'dtrownsonn', 'xH9VmP>dC+', '2025-03-05', 'per day'),
                ('Rivkah Farnorth', 'rfarnortho@who.int', 'rfarnortho', 'yJ5}1%.9Wl', '2024-09-25', 'per day'),
                ('Antonio Newitt', 'anewittp@bizjournals.com', 'anewittp', 'aW6.!4&$', '2024-08-06', 'per day'),
                ('Neila Fidgett', 'nfidgettq@prweb.com', 'nfidgettq', 'lZ1Jq.hs4oaYu', '2025-01-23', 'per day'),
                ('Gherardo De Vaux', 'gder@infoseek.co.jp', 'gder', 'tS5sjCHJQbH', '2024-10-15', 'per day'),
                ('Loralee Saunt', 'lsaunts@ow.ly', 'lsaunts', 'nH0Kk7}Zv', '2025-07-08', 'per day'),
                ('Charin Kerin', 'cokerint@free.fr', 'cokerint', 'qT2Jl2GpbYJG*y', '2025-07-02', 'per day'),
                ('Lynnette Lavrick', 'llavricku@apache.org', 'llavricku', 'bC11nKE@vgpbKNo', '2025-03-30', 'per day'),
                ('Ivan Lillecrap', 'ilillecrapv@meetup.com', 'ilillecrapv', 'qS3%!88Z8', '2024-10-06', 'per day'),
                ('Joy Entwhistle', 'jentwhistlew@fastcompany.com', 'jentwhistlew', 'cH7c+swJ*tVeV', '2024-11-07', 'per day'),
                ('Mano Mahaddie', 'mmahaddiex@g.co', 'mmahaddiex', 'lP0<N9I<=I#G', '2025-02-15', 'per day'),
                ('Hughie Elland', 'hellandy@yellowbook.com', 'hellandy', 'fU8hdhv&teT>', '2025-05-06', 'per day'),
                ('Rolph Denecamp', 'rdenecampz@msu.edu', 'rdenecampz', 'uU9~TN&', '2024-10-06', 'per day'),
                ('Standford Jose', 'sjose10@miibeian.gov.cn', 'sjose10', 'gK081N>ei.wqt', '2025-02-21', 'per day'),
                ('Beckie Jenkison', 'bjenkison11@zimbio.com', 'bjenkison11', 'zS5#&pEET36mq', '2024-12-20', 'per day'),
                ('Antone Vergo', 'avergo12@google.es', 'avergo12', 'lC98*F$6L.J', '2025-03-21', 'per day'),
                ('Emmalyn Pedican', 'epedican13@weebly.com', 'epedican13', 'hC551Max+q', '2024-12-11', 'per day'),
                ('Butch Oertzen', 'boertzen14@hostgator.com', 'boertzen14', 'rK8M2gNbE&', '2024-12-09', 'per day'),
                ('Candace Salling', 'csalling15@princeton.edu', 'csalling15', 'oW63VX_.O7f&6', '2024-09-08', 'per day'),
                ('Puff McGow', 'pmcgow16@sogou.com', 'pmcgow16', 'cU0vAE37p', '2024-09-19', 'per day'),
                ('Jordan Vamplers', 'jvamplers17@nydailynews.com', 'jvamplers17', 'nL4gEs#d', '2025-04-13', 'per day'),
                ('Chiarra Chislett', 'cchislett18@hao123.com', 'cchislett18', 'rH3tEKh', '2025-01-14', 'per day'),
                ('Mathias Birdfield', 'mbirdfield19@about.me', 'mbirdfield19', 'iN4vj$AWpQYo', '2025-05-09', 'per day'),
                ('Klarrisa Griffen', 'kgriffen1a@vimeo.com', 'kgriffen1a', 'hK0S=#M_', '2024-12-03', 'per day'),
                ('Gigi Found', 'gfound1b@uol.com.br', 'gfound1b', 'jX5vTnNUiYlbD', '2025-01-11', 'per day'),
                ('Koenraad Kamiyama', 'kkamiyama1c@businessinsider.com', 'kkamiyama1c', 'aE0oHF0', '2024-09-18', 'per day'),
                ('Padraic Head', 'phead1d@geocities.jp', 'phead1d', 'mJ2#KrY#9Ax', '2024-08-24', 'per day')
            ]
            fill_table_query = """
            INSERT INTO lyfter_car_rental.users (full_name, email, username, password, birthdate, user_status) VALUES (%s, %s, %s, %s, %s, %s);
            """
            
            
            for user in users:
                self.db_manager.execute_query(fill_table_query, *user)
            
            print("Tabla de usuarios creada y poblada exitosamente.")

            return True
            
        except Exception as e:
            print(f"Error al crear o poblar la tabla de usuarios: {e}")


    def create_car_table(self):
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS lyfter_car_rental.cars (
                id SERIAL PRIMARY KEY,
                make VARCHAR(30) NOT NULL,
                model VARCHAR(30) NOT NULL,
                year SMALLINT NOT NULL,
                car_status VARCHAR(30) NOT NULL CHECK (car_status IN ('rented', 'available'))
                );
            """
            
            self.db_manager.execute_query(create_table_query)

            cars = [
                ('Jaguar', 'S-Type', 2007, 'available'),
                ('Lexus', 'SC', 2010, 'available'),
                ('Mercury', 'Cougar', 1990, 'available'),
                ('Volkswagen', 'Passat', 2004, 'available'),
                ('Chevrolet', 'Corvette', 1960, 'available'),
                ('Chevrolet', 'S10 Blazer', 1993, 'available'),
                ('GMC', 'Sierra 1500', 2013, 'available'),
                ('Mercedes-Benz', 'M-Class', 2011, 'available'),
                ('Dodge', 'Ram 1500', 2005, 'available'),
                ('Chevrolet', 'Bel Air', 1967, 'available'),
                ('Buick', 'Regal', 2003, 'available'),
                ('Mercury', 'Sable', 1995, 'available'),
                ('Lincoln', 'Town Car', 2005, 'available'),
                ('Mercedes-Benz', 'G-Class', 2003, 'available'),
                ('Pontiac', 'Grand Prix', 1969, 'available'),
                ('Mercedes-Benz', 'S-Class', 2000, 'available'),
                ('Isuzu', 'Trooper', 1997, 'available'),
                ('Lincoln', 'Navigator L', 2008, 'available'),
                ('Ford', 'F250', 2006, 'available'),
                ('Toyota', 'RAV4', 2010, 'available'),
                ('Dodge', 'Durango', 2011, 'available'),
                ('Dodge', 'Viper', 1998, 'available'),
                ('Mercedes-Benz', 'G55 AMG', 2006, 'available'),
                ('Jeep', 'Liberty', 2010, 'available'),
                ('Suzuki', 'Reno', 2008, 'available'),
                ('BMW', 'M5', 2010, 'available'),
                ('Ford', 'F-Series', 2006, 'available'),
                ('BMW', 'X3', 2011, 'available'),
                ('Buick', 'Terraza', 2005, 'available'),
                ('Nissan', 'GT-R', 2012, 'available'),
                ('Mazda', 'CX-9', 2007, 'available'),
                ('Dodge', 'Dakota', 2003, 'available'),
                ('Mercedes-Benz', 'W201', 1985, 'available'),
                ('Honda', 'Ridgeline', 2007, 'available'),
                ('Audi', 'RS6', 2003, 'available'),
                ('Mitsubishi', 'Chariot', 1993, 'available'),
                ('Pontiac', 'Montana', 2000, 'available'),
                ('Mercedes-Benz', 'GLK-Class', 2010, 'available'),
                ('Hyundai', 'Accent', 2007, 'available'),
                ('Mitsubishi', 'Eclipse', 1994, 'available'),
                ('Bentley', 'Arnage', 2008, 'available'),
                ('GMC', 'Vandura G1500', 1995, 'available'),
                ('Cadillac', 'CTS', 2010, 'available'),
                ('Subaru', 'Justy', 1993, 'available'),
                ('Oldsmobile', 'Silhouette', 2000, 'available'),
                ('Dodge', 'Grand Caravan', 2012, 'available'),
                ('Chevrolet', 'Metro', 1999, 'available'),
                ('Lamborghini', 'Gallardo', 2010, 'available'),
                ('Ford', 'Crown Victoria', 2005, 'available'),
                ('Infiniti', 'G', 2010, 'available')
            ]
            fill_table_query = """
            INSERT INTO lyfter_car_rental.cars (make, model, year, car_status) VALUES (%s, %s, %s, %s);
            """
            
            for car in cars:
                self.db_manager.execute_query(fill_table_query, *car)
        
            print("Tabla de autos creada y poblada exitosamente.")

            return True
        
        except Exception as e:
            print(f"Error al crear o poblar la tabla de autos: {e}")

            
    def create_rental_table(self):
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS lyfter_car_rental.rentals (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES lyfter_car_rental.users(id),
                car_id INTEGER NOT NULL REFERENCES lyfter_car_rental.cars(id),
                rental_date DATE NOT NULL DEFAULT CURRENT_DATE,
                rental_status VARCHAR(10) NOT NULL CHECK (rental_status IN ('overdue', 'in time', 'returned'))
            );
            """

            self.db_manager.execute_query(create_table_query)
            print("Tabla cruz entre autos y usuarios creada exitosamente.")

            return True

        except Exception as e:
            print(f"Error al crear la tabla cruz entre autos y usuarios: {e}")