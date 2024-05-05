-- INSERT account information for Tony Stark
INSERT INTO account
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- UPDATE Tony Stark's account type to 'Admin'
UPDATE account
SET 
    account_type = 'Admin'
WHERE 
    account_id = 1;

-- DELETE Tony Stark's account record
DELETE 
FROM account
WHERE 
    account_id = 1;

-- UPDATE the inventory description for the GM Hummer
UPDATE inventory
SET 
    inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE
	inv_make = 'GM' AND inv_model = 'Hummer';

-- INNER JOIN the inventory and classification tables to return inventory items in the 'Sport' category
SELECT inv.inv_make, inv.inv_model, class.classification_name
FROM inventory inv
INNER JOIN classification class ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';

-- UPDATE all of the file paths for the images and thumbnails to include 'vehicles' in the middle
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
