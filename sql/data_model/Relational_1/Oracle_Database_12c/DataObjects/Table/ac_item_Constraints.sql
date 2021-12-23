ALTER TABLE ac_item ADD CONSTRAINT ac_item_pk PRIMARY KEY ( code );

ALTER TABLE ac_item ADD CONSTRAINT ac_item__un UNIQUE ( name );