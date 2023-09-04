
CREATE TABLE flashcard(
  card_id SERIAL NOT NULL,
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  PRIMARY KEY (card_id)
  )

CREATE TABLE deck(
  deck_id SERIAL NOT NULL,
  name VARCHAR(55) NOT NULL,
  PRIMARY KEY (deck_id)
  )
  
 CREATE TABLE deck_card_junction(
   deck_id INT NOT NULL,
   card_id INT NOT NULL,
   PRIMARY KEY (deck_id, card_id),
   FOREIGN KEY (deck_id) REFERENCES deck(deck_id),
   FOREIGN KEY (card_id) REFERENCES flashcard(card_id)
   )