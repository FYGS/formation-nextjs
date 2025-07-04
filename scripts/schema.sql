-- scripts/schema.sql

-- Supprimer les tables dans le bon ordre à cause des clés étrangères
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- Table des Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Table des Clients
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(255),
  address TEXT -- Ajout d'un champ adresse pour le client
);

-- Table des Factures
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount_in_cents INT NOT NULL, -- Continuons à stocker le montant total en centimes pour la cohérence
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
  date DATE NOT NULL,
  billing_address TEXT -- Adresse de facturation spécifique à cette facture (peut être pré-remplie avec celle du client)
);

-- Table des Lignes de Facture (Invoice Items)
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price_in_cents INT NOT NULL -- Prix unitaire également en centimes
);

-- Données de départ (Seed Data)

-- Clients (avec adresses)
INSERT INTO customers (id, name, email, image_url, address) VALUES
('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', 'https://i.pravatar.cc/150?img=70', '1 Tech Avenue, Lisbon, Portugal'),
('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', 'https://i.pravatar.cc/150?img=21', '123 Next St, San Francisco, CA'),
('3958dc9e-737f-4377-85e9-fec4b6a6442a', 'Hector Simpson', 'hector@simpson.com', 'https://i.pravatar.cc/150?img=52', '742 Evergreen Terrace, Springfield'),
('50ca3e18-62cd-11ee-8c99-0242ac120002', 'Steven Tey', 'steven@tey.com', 'https://i.pravatar.cc/150?img=53', 'Innovation Park, Singapore'),
('3958dc9e-787f-4377-85e9-fec4b6a6442a', 'Steph Dietz', 'steph@dietz.com', 'https://i.pravatar.cc/150?img=54', 'Component Ave, Berlin, Germany');
-- Ajoutez les autres clients avec leurs adresses...
INSERT INTO customers (id, name, email, image_url, address) VALUES
('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', 'https://i.pravatar.cc/150?img=30', 'Main Street 1, Prague, Czech Republic'),
('d6e15727-9fe1-4961-8c5b-8d0f871247ba', 'Evil Rabbit', 'evil@rabbit.com', 'https://i.pravatar.cc/150?img=31', 'The Warren, Wonderland'),
('126eed9c-c90c-4ef6-a4a8-fcf7408d3c66', 'Emil Kowalski', 'emil@kowalski.com', 'https://i.pravatar.cc/150?img=32', 'UI Lane, Warsaw, Poland'),
('CC27C14A-0ACF-4F4A-A6C9-D45682C144EE', 'Amy Burns', 'amy@burns.com', 'https://i.pravatar.cc/150?img=33', '10 Downing Street, London, UK'),
('246A6A41-9728-4AA2-97EC-E799D83A53D4', 'Suresh Kumar', 'suresh@kumar.com', 'https://i.pravatar.cc/150?img=34', 'Tech Park, Bangalore, India');


-- Factures (avec adresses de facturation - peuvent être les mêmes que celles du client)
-- Pour chaque facture, on génère un UUID à la main pour pouvoir lier les items

-- Facture 1: Delba de Oliveira
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('11111111-1111-1111-1111-111111111111', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 150075, 'paid', '2023-01-15', '1 Tech Avenue, Lisbon, Portugal');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('11111111-1111-1111-1111-111111111111', 'Consulting Services', 1, 150075);

-- Facture 2: Lee Robinson
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('22222222-2222-2222-2222-222222222222', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 20000, 'pending', '2023-02-01', '123 Next St, San Francisco, CA');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('22222222-2222-2222-2222-222222222222', 'Batarangs (Lot de 100)', 2, 10000);

-- Facture 3: Hector Simpson
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('33333333-3333-3333-3333-333333333333', '3958dc9e-737f-4377-85e9-fec4b6a6442a', 325050, 'paid', '2023-01-20', '742 Evergreen Terrace, Springfield');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('33333333-3333-3333-3333-333333333333', 'Goblin Serum Research', 1, 325050);

-- Facture 4: Steven Tey
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('44444444-4444-4444-4444-444444444444', '50ca3e18-62cd-11ee-8c99-0242ac120002', 75000, 'overdue', '2023-07-05', 'Innovation Park, Singapore');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('44444444-4444-4444-4444-444444444444', 'Advanced UI Components License', 1, 75000);

-- Facture 5: Steph Dietz
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('55555555-5555-5555-5555-555555555555', '3958dc9e-787f-4377-85e9-fec4b6a6442a', 500000, 'pending', '2024-01-10', 'Component Ave, Berlin, Germany');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('55555555-5555-5555-5555-555555555555', 'Full-Stack Development Course', 10, 50000);

-- Ajoutez les autres factures avec leurs items en utilisant des UUIDs explicites
-- Facture 6: Michael Novotny
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('66666666-6666-6666-6666-666666666666', '76d65c26-f784-44a2-ac19-586678f7c2f2', 120000, 'paid', '2023-03-15', 'Main Street 1, Prague, Czech Republic');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('66666666-6666-6666-6666-666666666666', 'Web Development Services', 1, 120000);

-- Facture 7: Evil Rabbit
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('77777777-7777-7777-7777-777777777777', 'd6e15727-9fe1-4961-8c5b-8d0f871247ba', 30000, 'pending', '2023-04-01', 'The Warren, Wonderland');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('77777777-7777-7777-7777-777777777777', 'Magic Potions (Lot de 5)', 1, 30000);

-- Facture 8: Emil Kowalski
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('88888888-8888-8888-8888-888888888888', 'd6e15727-9fe1-4961-8c5b-8d0f871247ba', 30000, 'pending', '2023-04-01', 'The Warren, Wonderland');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('88888888-8888-8888-8888-888888888888', 'Magic Potions (Lot de 5)', 1, 30000);

-- Facture 9: Amy Burns
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('99999999-9999-9999-9999-999999999999', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144EE', 45000, 'paid', '2023-05-20', '10 Downing Street, London, UK');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('99999999-9999-9999-9999-999999999999', 'Confidential Document Review', 1, 45000);

-- Facture 10: Suresh Kumar
INSERT INTO invoices (id, customer_id, amount_in_cents, status, date, billing_address)
VALUES ('10101010-1010-1010-1010-101010101010', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144EE', 60000, 'paid', '2023-06-15', '1 Infinite Loop, Cupertino, CA');
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price_in_cents)
VALUES ('10101010-1010-1010-1010-101010101010', 'Apple Product Design Review', 1, 60000);

-- Utilisateur de test
INSERT INTO users (name, email, password) VALUES
('Test User', 'user@example.com', 'password123'); -- Hacher ce mot de passe au Jour 3