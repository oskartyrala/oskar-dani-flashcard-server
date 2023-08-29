INSERT INTO flashcard (front, back) VALUES ('pear', 'is a green fruit');
INSERT INTO flashcard (front, back) VALUES ('banana', 'is a yellow fruit');
INSERT INTO flashcard (front, back) VALUES ('tomato', 'is a red fruit');
INSERT INTO flashcard (front, back) VALUES ('blood', 'is red');
INSERT INTO flashcard (front, back) VALUES ('mars', 'is a red planet');

INSERT INTO deck (name) VALUES ('fruit');
INSERT INTO deck (name) VALUES ('red items');

INSERT INTO deck_card_junction (deck_id, card_id) VALUES (3, 6);
INSERT INTO deck_card_junction (deck_id, card_id) VALUES (3, 7);
INSERT INTO deck_card_junction (deck_id, card_id) VALUES (3, 8);
INSERT INTO deck_card_junction (deck_id, card_id) VALUES (4, 6);
INSERT INTO deck_card_junction (deck_id, card_id) VALUES (4, 9);
INSERT INTO deck_card_junction (deck_id, card_id) VALUES (4, 10);