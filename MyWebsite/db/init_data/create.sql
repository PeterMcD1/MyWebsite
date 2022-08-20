DROP TABLE IF EXISTS drinks CASCADE;
CREATE TABLE IF NOT EXISTS drinks (
  drinkName VARCHAR(100) PRIMARY KEY,
  drinkIng1 VARCHAR(100),
  drinkIng2 VARCHAR(100),
  drinkIng3 VARCHAR(100),
  drinkInstruct VARCHAR(1000)
);
INSERT INTO drinks(drinkName, drinkIng1, drinkIng2, drinkIng3, drinkInstruct)
VALUES('testDrink', 'testApple', 'testJuice', 'testVodka', 'testTesttest');
